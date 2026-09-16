/**
 * Live smoke test: runs the real agent and prints the translated activity events.
 * Requires OPENAI_API_KEY. Run with: npm run smoke:agent
 */
import { runCampaign } from '../lib/agent/run-campaign';
import { demoBrief } from '../lib/campaign-brief';

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY ontbreekt. Zet deze in .env.local.');
    process.exit(1);
  }

  let deltas = 0;

  for await (const event of runCampaign(demoBrief)) {
    if (event.type === 'output_delta') {
      deltas += 1;
      continue;
    }
    if (event.type === 'run_completed') {
      console.log(`\n[${event.type}] ${event.markdown.split(/\s+/).length} woorden`);
      console.log(`opgeslagen als: ${event.savedPath ?? '(niets opgeslagen)'}`);
      continue;
    }
    console.log(JSON.stringify(event));
  }

  console.log(`\noutput_delta events: ${deltas}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
