/**
 * Verifies the three local function tools against the real filesystem.
 * Run with: npm run verify:tools
 */
import { RunContext } from '@openai/agents';
import { readBrandContext } from '../lib/agent/tools/read-brand-context';
import { readReferenceCampaigns } from '../lib/agent/tools/read-reference-campaigns';
import { saveCampaignBrief } from '../lib/agent/tools/save-campaign-brief';
import type { CampaignRunContext } from '../lib/agent/run-context';

async function main() {
  const brand = await readBrandContext.invoke(new RunContext({}), '{}');
  console.log(`read_brand_context      -> ${String(brand).length} tekens`);

  const references = await readReferenceCampaigns.invoke(
    new RunContext({}),
    JSON.stringify({ focus: 'leadgeneratie' }),
  );
  console.log(`read_reference_campaigns -> ${String(references).length} tekens`);

  const context: CampaignRunContext = {};
  const saved = await saveCampaignBrief.invoke(
    new RunContext<CampaignRunContext>(context),
    JSON.stringify({
      title: 'Verificatie toolrun',
      content: '# Verificatie toolrun\n\nDit bestand is geschreven door scripts/verify-tools.ts.\n',
      slug: 'verificatie-toolrun',
    }),
  );
  console.log(`save_campaign_brief      -> ${String(saved)}`);
  console.log(`run context savedBriefPath -> ${context.savedBriefPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
