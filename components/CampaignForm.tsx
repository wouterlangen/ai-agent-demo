'use client';

import type { CampaignBrief } from '@/lib/campaign-brief';

type Props = {
  brief: CampaignBrief;
  isRunning: boolean;
  hasResult: boolean;
  onChange: (brief: CampaignBrief) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export function CampaignForm({ brief, isRunning, hasResult, onChange, onSubmit, onReset }: Props) {
  const update = (field: keyof CampaignBrief) => (value: string) =>
    onChange({ ...brief, [field]: value });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="section-heading">
        <h2>Campagnebrief</h2>
      </div>

      <div className="field">
        <label htmlFor="organisation">Organisatie</label>
        <input
          id="organisation"
          value={brief.organisation}
          onChange={(e) => update('organisation')(e.target.value)}
          disabled={isRunning}
          required
          maxLength={200}
        />
      </div>

      <div className="field">
        <label htmlFor="offer">Aanbod / onderwerp</label>
        <input
          id="offer"
          value={brief.offer}
          onChange={(e) => update('offer')(e.target.value)}
          disabled={isRunning}
          required
          maxLength={200}
        />
      </div>

      <div className="field">
        <label htmlFor="goal">Campagnedoel</label>
        <textarea
          id="goal"
          rows={2}
          value={brief.goal}
          onChange={(e) => update('goal')(e.target.value)}
          disabled={isRunning}
          required
          maxLength={1000}
        />
      </div>

      <div className="field">
        <label htmlFor="audience">Doelgroep</label>
        <textarea
          id="audience"
          rows={3}
          value={brief.audience}
          onChange={(e) => update('audience')(e.target.value)}
          disabled={isRunning}
          required
          maxLength={1000}
        />
      </div>

      <div className="field">
        <label htmlFor="context">Aanvullende context</label>
        <textarea
          id="context"
          rows={6}
          value={brief.context}
          onChange={(e) => update('context')(e.target.value)}
          disabled={isRunning}
          maxLength={2000}
        />
        <p className="field-hint">Optioneel. Stuurt mee welke research de agent zinvol vindt.</p>
      </div>

      <div className="actions">
        <button className="button-primary" type="submit" disabled={isRunning}>
          {isRunning ? 'Agent draait…' : 'Start agent'}
        </button>
        {!isRunning && hasResult && (
          <button className="button-quiet" type="button" onClick={onReset}>
            Nieuwe run
          </button>
        )}
      </div>
    </form>
  );
}
