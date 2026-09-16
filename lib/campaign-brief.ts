import { z } from 'zod';

const requiredField = (max: number) => z.string().trim().min(1).max(max);

/** Server-side validation of the five briefing fields. */
export const campaignBriefSchema = z.object({
  organisation: requiredField(200),
  offer: requiredField(200),
  goal: requiredField(1000),
  audience: requiredField(1000),
  context: z.string().trim().max(2000).default(''),
});

export type CampaignBrief = z.infer<typeof campaignBriefSchema>;

/** Prefilled values so the demo is ready to run the moment it opens. */
export const demoBrief: CampaignBrief = {
  organisation: 'Flink',
  offer: 'AI Discovery',
  goal: 'Gekwalificeerde leads genereren voor een AI Discovery sessie.',
  audience:
    'Digital managers en communicatieverantwoordelijken bij middelgrote en grote missiegedreven organisaties in Nederland.',
  context:
    'De campagne moet concreet en nuchter zijn. Vermijd AI-hype. Laat zien dat de sessie organisaties helpt om bruikbare AI-kansen voor website, CMS en redactie te vinden. Gebruik waar zinvol actuele openbare inzichten over AI-adoptie of uitdagingen van digitale teams.',
};
