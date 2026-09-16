import { campaignBriefSchema } from '@/lib/campaign-brief';
import { runCampaign } from '@/lib/agent/run-campaign';
import type { CampaignStreamEvent } from '@/lib/agent/activity-events';

// The local tools use Node's filesystem APIs, so this route needs the Node runtime.
export const runtime = 'nodejs';

function encodeEvent(event: CampaignStreamEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { message: 'OPENAI_API_KEY ontbreekt op de server. Vul deze in .env.local in.' },
      { status: 500 },
    );
  }

  const parsed = campaignBriefSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { message: 'De campagnebrief is onvolledig. Vul alle verplichte velden in.' },
      { status: 400 },
    );
  }

  // Newline-delimited JSON: one event per line, consumed incrementally by the browser.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of runCampaign(parsed.data, request.signal)) {
          controller.enqueue(encodeEvent(event));
        }
      } catch (error) {
        console.error('[campaign-route] stream failed:', error);
        controller.enqueue(
          encodeEvent({ type: 'error', message: 'De verbinding met de agent-run is verbroken.' }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
