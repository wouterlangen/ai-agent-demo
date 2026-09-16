'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AgentActivity, type ActivityItem } from '@/components/AgentActivity';
import { CampaignForm } from '@/components/CampaignForm';
import { CampaignResult } from '@/components/CampaignResult';
import { demoBrief, type CampaignBrief } from '@/lib/campaign-brief';
import type { CampaignStreamEvent } from '@/lib/agent/activity-events';

const RUN_STARTED_ID = 'run-started';
const RUN_FINISHED_ID = 'run-finished';

/** Reads the NDJSON response body and yields one parsed event per line. */
async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<CampaignStreamEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.trim()) yield JSON.parse(line) as CampaignStreamEvent;
    }
  }

  if (buffer.trim()) yield JSON.parse(buffer) as CampaignStreamEvent;
}

export default function Page() {
  const [brief, setBrief] = useState<CampaignBrief>(demoBrief);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [savedPath, setSavedPath] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [runElapsedMs, setRunElapsedMs] = useState(0);

  // Only what we can actually observe: either a tool is between start and
  // finish, or the model is streaming the result. Never a claim about reasoning.
  const [isWriting, setIsWriting] = useState(false);

  // Start times are only needed to show elapsed time, so they stay out of state.
  const startTimes = useRef(new Map<string, number>());
  const runStartedAt = useRef(0);

  // Ticking clock so the feed keeps showing signs of life during long silences.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setRunElapsedMs(Date.now() - runStartedAt.current), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const finishActivity = useCallback((id: string, status: 'done' | 'error', detail?: string) => {
    const startedAt = startTimes.current.get(id);
    const elapsedMs = startedAt ? Date.now() - startedAt : undefined;

    setActivities((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status, elapsedMs, detail: detail ?? item.detail } : item,
      ),
    );
  }, []);

  const reset = useCallback(() => {
    startTimes.current.clear();
    setActivities([]);
    setMarkdown('');
    setSavedPath(undefined);
    setError(undefined);
    setRunElapsedMs(0);
    setIsWriting(false);
  }, []);

  const start = useCallback(async () => {
    reset();
    runStartedAt.current = Date.now();
    setIsRunning(true);

    try {
      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'De agent-run kon niet worden gestart.');
      }

      for await (const event of readEvents(response.body)) {
        switch (event.type) {
          case 'run_started':
            setActivities([{ id: RUN_STARTED_ID, label: event.label, status: 'done' }]);
            break;

          case 'activity_started':
            startTimes.current.set(event.id, Date.now());
            setIsWriting(false);
            setActivities((current) => [
              ...current,
              {
                id: event.id,
                label: event.label,
                completedLabel: event.completedLabel,
                detail: event.detail,
                kind: event.kind,
                status: 'running',
              },
            ]);
            // Text written before a tool call is commentary, not the final brief.
            setMarkdown('');
            break;

          case 'activity_completed':
            finishActivity(event.id, 'done', event.detail);
            break;

          case 'activity_failed':
            finishActivity(event.id, 'error', event.detail);
            break;

          case 'output_delta':
            setMarkdown((current) => current + event.text);
            setIsWriting(true);
            break;

          case 'run_completed':
            if (event.markdown) setMarkdown(event.markdown);
            setSavedPath(event.savedPath);
            setActivities((current) => [
              ...current,
              { id: RUN_FINISHED_ID, label: 'Run afgerond', status: 'done' },
            ]);
            break;

          case 'error':
            setError(event.message);
            setActivities((current) => [
              ...current,
              { id: `error-${current.length}`, label: event.message, status: 'error' },
            ]);
            break;
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Er ging iets mis tijdens de agent-run.');
    } finally {
      setIsRunning(false);
    }
  }, [brief, finishActivity, reset]);

  return (
    <main className="shell">
      <header className="masthead">
        <p className="eyebrow">Agent demo</p>
        <h1>Campaign Strategist</h1>
        <p>Van campagnebrief naar onderbouwd concept, met tools die de agent zelf inzet.</p>
      </header>

      <div className="workspace">
        <div className="column-form">
          <CampaignForm
            brief={brief}
            isRunning={isRunning}
            hasResult={Boolean(markdown) || Boolean(error)}
            onChange={setBrief}
            onSubmit={start}
            onReset={reset}
          />
        </div>

        <div className="column-run">
          {error && (
            <p className="banner" role="alert">
              {error}
            </p>
          )}

          <AgentActivity
            items={activities}
            isRunning={isRunning}
            liveLabel={isWriting ? 'Resultaat wordt opgebouwd' : 'Agent is bezig'}
            runElapsedMs={runElapsedMs}
          />

          <CampaignResult
            markdown={markdown}
            savedPath={savedPath}
            isStreaming={isRunning && !savedPath}
          />
        </div>
      </div>
    </main>
  );
}
