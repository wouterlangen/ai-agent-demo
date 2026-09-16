import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { tool } from '@openai/agents';
import { z } from 'zod';
import { dataDir } from '../paths';

/**
 * Function tool: reads a small set of internal reference campaigns.
 *
 * `focus` lets the model state what it is looking for. For this demo the tool
 * simply returns the whole (small) file; the field mainly makes the agent's
 * intent visible in the activity feed.
 */
export const readReferenceCampaigns = tool({
  name: 'read_reference_campaigns',
  description:
    'Read a small set of internal reference campaigns and lessons. Use when previous campaign patterns, messaging approaches or channel lessons can improve the proposal.',
  parameters: z.object({
    focus: z
      .string()
      .nullable()
      .describe('Optional short description of what you are looking for in the references.'),
  }),
  execute: async () => {
    return readFile(path.join(dataDir, 'REFERENCE_CAMPAIGNS.md'), 'utf8');
  },
});
