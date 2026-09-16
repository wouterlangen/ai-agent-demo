/** The small event model the browser consumes. Kept intentionally minimal. */
export type CampaignStreamEvent =
  | { type: 'run_started'; label: string }
  | {
      type: 'activity_started';
      id: string;
      kind: ToolKind;
      label: string;
      completedLabel: string;
      detail?: string;
    }
  | { type: 'activity_completed'; id: string; detail?: string }
  | { type: 'activity_failed'; id: string; detail?: string }
  | { type: 'output_delta'; text: string }
  | { type: 'run_completed'; markdown: string; savedPath?: string }
  | { type: 'error'; message: string };

/** Distinguishes an OpenAI-hosted capability from one implemented in this app. */
export type ToolKind = 'hosted' | 'function';

type ToolPresentation = { kind: ToolKind; started: string; completed: string };

/**
 * Maps technical tool names onto the labels shown in the activity feed.
 * Anything not listed here still shows up, using its raw tool name.
 */
const toolPresentation: Record<string, ToolPresentation> = {
  web_search: {
    kind: 'hosted',
    started: 'Webresearch gestart',
    completed: 'Webresearch afgerond',
  },
  read_brand_context: {
    kind: 'function',
    started: 'Flink brandcontext ophalen',
    completed: 'Brandcontext beschikbaar',
  },
  read_reference_campaigns: {
    kind: 'function',
    started: 'Referentiecampagnes raadplegen',
    completed: 'Referenties verwerkt',
  },
  save_campaign_brief: {
    kind: 'function',
    started: 'Campagnebrief opslaan',
    completed: 'Campagnebrief opgeslagen',
  },
};

export function describeTool(toolName: string): ToolPresentation {
  return (
    toolPresentation[toolName] ?? {
      kind: 'function',
      started: `Tool ${toolName} gestart`,
      completed: `Tool ${toolName} afgerond`,
    }
  );
}
