import { run, MaxTurnsExceededError, UserError } from '@openai/agents';
import { campaignAgent, MAX_TURNS } from './campaign-agent';
import { describeTool, type CampaignStreamEvent } from './activity-events';
import type { CampaignRunContext } from './run-context';
import type { CampaignBrief } from '../campaign-brief';

/** Turns the form fields into the message the agent receives. */
function toAgentInput(brief: CampaignBrief): string {
  const lines = [
    'Ontwikkel een campagnebrief op basis van de volgende briefing.',
    '',
    `Organisatie: ${brief.organisation}`,
    `Aanbod / onderwerp: ${brief.offer}`,
    `Campagnedoel: ${brief.goal}`,
    `Doelgroep: ${brief.audience}`,
  ];

  if (brief.context.trim()) {
    lines.push(`Aanvullende context: ${brief.context}`);
  }

  return lines.join('\n');
}

/** Keeps tool arguments short and safe for display in the activity feed. */
function truncate(value: string, maxLength = 120): string {
  const collapsed = value.replace(/\s+/g, ' ').trim();
  return collapsed.length > maxLength ? `${collapsed.slice(0, maxLength - 1)}…` : collapsed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Builds a compact, safe detail line from a function tool's JSON arguments.
 * Only fields we explicitly want to surface are shown - never the whole payload.
 */
function describeArguments(toolName: string, rawArguments: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawArguments);
  } catch {
    return undefined;
  }
  if (!isRecord(parsed)) return undefined;

  if (toolName === 'read_reference_campaigns' && typeof parsed.focus === 'string' && parsed.focus) {
    return `Focus: ${truncate(parsed.focus)}`;
  }
  if (toolName === 'save_campaign_brief' && typeof parsed.title === 'string' && parsed.title) {
    return `Titel: ${truncate(parsed.title)}`;
  }
  return undefined;
}

/** Reads the search queries off a hosted web_search_call item. */
function describeWebSearch(item: Record<string, unknown>): string | undefined {
  const action = item.action;
  if (!isRecord(action)) return undefined;

  if (Array.isArray(action.queries)) {
    const queries = action.queries.filter((q): q is string => typeof q === 'string');
    if (queries.length > 0) return `Zoekopdracht: ${truncate(queries.join(' / '))}`;
  }
  if (typeof action.query === 'string' && action.query) {
    return `Zoekopdracht: ${truncate(action.query)}`;
  }
  if (typeof action.url === 'string' && action.url) {
    return `Bron geopend: ${truncate(action.url)}`;
  }
  return undefined;
}

function toUserFacingError(error: unknown): string {
  if (error instanceof MaxTurnsExceededError) {
    return `De agent bereikte de veiligheidslimiet van ${MAX_TURNS} stappen zonder een definitief resultaat.`;
  }
  if (error instanceof UserError) {
    return 'De agent-run kon niet worden gestart. Controleer de serverconfiguratie.';
  }
  return 'De agent-run kon niet worden afgerond. Controleer de serverconfiguratie en probeer opnieuw.';
}

/**
 * Runs the Campaign Strategist and translates real SDK stream events into the
 * small app-level event model.
 *
 * Nothing here decides which tools run - it only reports what actually happened.
 */
export async function* runCampaign(
  brief: CampaignBrief,
  signal?: AbortSignal,
): AsyncGenerator<CampaignStreamEvent> {
  const context: CampaignRunContext = {};

  yield { type: 'run_started', label: `${campaignAgent.name} gestart` };

  try {
    const stream = await run(campaignAgent, toAgentInput(brief), {
      stream: true,
      maxTurns: MAX_TURNS,
      context,
      signal,
    });

    for await (const event of stream) {
      // Semantic run items: our own function tools starting and finishing.
      if (event.type === 'run_item_stream_event') {
        const rawItem = event.item.rawItem;

        if (event.name === 'tool_called' && rawItem?.type === 'function_call') {
          const presentation = describeTool(rawItem.name);
          yield {
            type: 'activity_started',
            id: rawItem.callId,
            kind: presentation.kind,
            label: presentation.started,
            completedLabel: presentation.completed,
            detail: describeArguments(rawItem.name, rawItem.arguments),
          };
        }

        if (event.name === 'tool_output' && rawItem?.type === 'function_call_result') {
          const detail =
            rawItem.name === 'save_campaign_brief' ? context.savedBriefPath : undefined;
          yield { type: 'activity_completed', id: rawItem.callId, detail };
        }

        continue;
      }

      if (event.type !== 'raw_model_stream_event') continue;

      // Stream the assistant text so the result builds up while the run is going.
      if (event.data.type === 'output_text_delta') {
        yield { type: 'output_delta', text: event.data.delta };
        continue;
      }

      // Hosted web search is executed by OpenAI, so it surfaces as a raw
      // response item rather than as a local tool call.
      if (event.data.type !== 'model') continue;

      const raw: unknown = event.data.event;
      if (!isRecord(raw) || typeof raw.type !== 'string') continue;
      if (raw.type !== 'response.output_item.added' && raw.type !== 'response.output_item.done') {
        continue;
      }

      const item = raw.item;
      if (!isRecord(item) || item.type !== 'web_search_call' || typeof item.id !== 'string') {
        continue;
      }

      const presentation = describeTool('web_search');

      if (raw.type === 'response.output_item.added') {
        yield {
          type: 'activity_started',
          id: item.id,
          kind: presentation.kind,
          label: presentation.started,
          completedLabel: presentation.completed,
        };
      } else if (item.status === 'failed' || item.status === 'incomplete') {
        yield { type: 'activity_failed', id: item.id, detail: 'Webresearch mislukt' };
      } else {
        yield { type: 'activity_completed', id: item.id, detail: describeWebSearch(item) };
      }
    }

    await stream.completed;

    yield {
      type: 'run_completed',
      markdown: stream.finalOutput ?? '',
      savedPath: context.savedBriefPath,
    };
  } catch (error) {
    console.error('[campaign-agent] run failed:', error);

    // The run can drop after the brief was already written to disk (for example
    // when the model connection is interrupted). The work is not lost, so show it.
    if (context.savedBriefPath && context.savedBriefContent) {
      yield {
        type: 'error',
        message:
          'De verbinding met het model werd onderbroken nadat de campagnebrief al was opgeslagen. Het opgeslagen resultaat staat hieronder.',
      };
      yield {
        type: 'run_completed',
        markdown: context.savedBriefContent,
        savedPath: context.savedBriefPath,
      };
      return;
    }

    yield { type: 'error', message: toUserFacingError(error) };
  }
}
