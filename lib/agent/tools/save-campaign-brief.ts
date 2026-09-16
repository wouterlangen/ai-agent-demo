import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tool } from '@openai/agents';
import { z } from 'zod';
import { outputDir, toRelativePath } from '../paths';
import type { CampaignRunContext } from '../run-context';

/** Reduces arbitrary text to a safe, lowercase, hyphenated filename fragment. */
function toSlug(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return slug || 'campaign-brief';
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Function tool: writes the final campaign brief to disk.
 *
 * This is the tool that shows an agent can perform an action, not just read
 * information. It always writes inside `output/` and returns a project-relative
 * path so no absolute filesystem path ever reaches the browser.
 */
export const saveCampaignBrief = tool({
  name: 'save_campaign_brief',
  description:
    'Save the final campaign brief as a local Markdown file. Only use this once the final campaign brief is complete.',
  parameters: z.object({
    title: z.string().describe('Short title of the campaign brief.'),
    content: z.string().describe('The complete campaign brief in Markdown.'),
    slug: z
      .string()
      .nullable()
      .describe('Optional filename slug. A safe slug is generated from the title when omitted.'),
  }),
  execute: async ({ title, content, slug }, runContext) => {
    const fileName = `${todayIsoDate()}-${toSlug(slug ?? title)}.md`;
    const absolutePath = path.join(outputDir, fileName);

    await mkdir(outputDir, { recursive: true });
    await writeFile(absolutePath, content, 'utf8');

    const relativePath = toRelativePath(absolutePath);

    // Record the path on the run context so the API route can report it to the UI.
    const context = runContext?.context as CampaignRunContext | undefined;
    if (context) {
      context.savedBriefPath = relativePath;
      context.savedBriefContent = content;
    }

    return `Saved the campaign brief to ${relativePath}`;
  },
});
