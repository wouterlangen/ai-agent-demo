'use client';

import type { ToolKind } from '@/lib/agent/activity-events';

export type ActivityStatus = 'running' | 'done' | 'error';

export type ActivityItem = {
  id: string;
  label: string;
  completedLabel?: string;
  detail?: string;
  kind?: ToolKind;
  status: ActivityStatus;
  elapsedMs?: number;
};

const statusText: Record<ActivityStatus, string> = {
  running: 'bezig',
  done: 'gereed',
  error: 'fout',
};

const kindLabel: Record<ToolKind, string> = {
  hosted: 'Hosted tool',
  function: 'Function tool',
};

function formatElapsed(ms?: number): string | undefined {
  if (ms === undefined) return undefined;
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`;
}

/** Loopende runtijd als m:ss, zodat zichtbaar blijft dat er iets gebeurt. */
function formatClock(ms: number): string {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

type Props = {
  items: ActivityItem[];
  isRunning: boolean;
  /** Generieke applicatiestatus - nooit een weergave van wat het model denkt. */
  liveLabel: string;
  runElapsedMs: number;
};

export function AgentActivity({ items, isRunning, liveLabel, runElapsedMs }: Props) {
  return (
    <section aria-labelledby="activity-heading">
      <div className="section-heading">
        <h2 id="activity-heading">Agent activity</h2>
        {isRunning ? (
          <span className="section-note is-live">
            <span className="live-dot" aria-hidden="true" />
            Agent draait
            <span aria-hidden="true"> · {formatClock(runElapsedMs)}</span>
          </span>
        ) : (
          items.length > 0 && (
            <span className="section-note">
              {items.length} {items.length === 1 ? 'gebeurtenis' : 'gebeurtenissen'}
            </span>
          )
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <p>Start een campagne om te zien welke tools de agent zelf besluit te gebruiken.</p>
          <ul className="legend">
            <li>
              <span className="badge" data-kind="hosted">
                Hosted tool
              </span>
              capability van OpenAI
            </li>
            <li>
              <span className="badge" data-kind="function">
                Function tool
              </span>
              capability uit deze applicatie
            </li>
          </ul>
        </div>
      ) : (
        <ul className="activity" aria-live="polite" aria-busy={isRunning}>
          {items.map((item) => {
            const label =
              item.status === 'done' && item.completedLabel ? item.completedLabel : item.label;
            const elapsed = formatElapsed(item.elapsedMs);

            return (
              <li className="activity-item" key={item.id} data-status={item.status}>
                <span className="marker" data-status={item.status} aria-hidden="true" />
                <div>
                  <p className="activity-label">{label}</p>
                  {item.detail && (
                    <p className={`activity-detail${item.detail.includes('/') ? ' is-path' : ''}`}>
                      {item.detail}
                    </p>
                  )}
                </div>
                <div className="activity-meta">
                  {item.kind && (
                    <span className="badge" data-kind={item.kind}>
                      {kindLabel[item.kind]}
                    </span>
                  )}
                  <span className="status-text">
                    {elapsed && item.status !== 'running' ? elapsed : statusText[item.status]}
                  </span>
                </div>
              </li>
            );
          })}

          {isRunning && (
            <li className="activity-item is-live" data-status="running">
              <span className="marker" data-status="running" aria-hidden="true" />
              <div>
                <p className="activity-label">{liveLabel}</p>
              </div>
              <div className="activity-meta">
                <span className="status-text" aria-hidden="true">
                  {formatClock(runElapsedMs)}
                </span>
              </div>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
