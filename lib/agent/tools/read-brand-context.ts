import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { tool } from '@openai/agents';
import { z } from 'zod';
import { dataDir } from '../paths';

/**
 * Function tool: reads Flink's internal brand context from a local Markdown file.
 * Deliberately a plain file read - no vector store, no embeddings.
 */
export const readBrandContext = tool({
  name: 'read_brand_context',
  description:
    "Read Flink's internal brand, positioning, audience and tone-of-voice context. Use when the campaign concerns Flink or when Flink's brand context is relevant.",
  parameters: z.object({}),
  execute: async () => {
    return readFile(path.join(dataDir, 'FLINK_BRAND_CONTEXT.md'), 'utf8');
  },
});
