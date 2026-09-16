'use client';

import ReactMarkdown from 'react-markdown';

type Props = {
  markdown: string;
  savedPath?: string;
  isStreaming: boolean;
};

export function CampaignResult({ markdown, savedPath, isStreaming }: Props) {
  if (!markdown.trim()) return null;

  return (
    <section aria-labelledby="result-heading">
      <div className="section-heading">
        <h2 id="result-heading">Campaign brief</h2>
        {isStreaming && <span className="section-note">wordt opgebouwd…</span>}
      </div>

      <article className="result">
        {savedPath && (
          <p className="saved-note">
            <span>Opgeslagen als</span>
            <code>{savedPath}</code>
          </p>
        )}
        <div className="prose">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </article>
    </section>
  );
}
