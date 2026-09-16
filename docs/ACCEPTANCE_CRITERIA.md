# Acceptance Criteria

Gebruik deze lijst als finale Definition of Done.

## A. Applicatie

- [ ] Applicatie is een werkende lokale webapp.
- [ ] Setup is reproduceerbaar vanaf `README.md`.
- [ ] `npm run dev` start de demo.
- [ ] `npm run lint` slaagt.
- [ ] `npm run build` slaagt.

## B. Agent

- [ ] Er bestaat precies één primaire agent: `Campaign Strategist`.
- [ ] De agent gebruikt de officiële OpenAI Agents SDK voor TypeScript.
- [ ] De agentconfiguratie is eenvoudig terug te vinden.
- [ ] Agent instructions zijn eenvoudig terug te vinden.
- [ ] Toolkeuze wordt niet als vaste workflow door applicatiecode afgedwongen.
- [ ] Een run heeft een redelijke max-turn safety limit.

## C. Tools

- [ ] Hosted OpenAI web search is direct beschikbaar als agent tool.
- [ ] Web search is niet zelf als crawler gebouwd.
- [ ] `read_brand_context` leest echt `data/FLINK_BRAND_CONTEXT.md`.
- [ ] `read_reference_campaigns` leest echt `data/REFERENCE_CAMPAIGNS.md`.
- [ ] `save_campaign_brief` schrijft echt een Markdownbestand in `output/`.
- [ ] Het opgeslagen pad wordt aan de run teruggegeven.
- [ ] Tool schemas zijn met Zod of een gelijkwaardige SDK-conforme aanpak gevalideerd.

## D. Activity feed

- [ ] Activity feed toont alleen events die gebaseerd zijn op echte run/tool-events.
- [ ] Er is geen vooraf vastgelegde nep-timeline.
- [ ] Tool start is zichtbaar.
- [ ] Tool completion is zichtbaar.
- [ ] Web search kan als webresearch-event zichtbaar worden.
- [ ] Local tools zijn herkenbaar met mensvriendelijke labels.
- [ ] Tooldetails zijn compact en veilig.
- [ ] Verborgen chain-of-thought wordt niet getoond.
- [ ] Errors krijgen een duidelijke UI-state.

## E. Input en resultaat

- [ ] De vijf briefingvelden uit de productspec zijn aanwezig.
- [ ] Demo-defaults zijn ingevuld.
- [ ] Verplichte velden worden client- en/of server-side correct afgevangen.
- [ ] Resultaat wordt als leesbare Markdown weergegeven.
- [ ] Resultaat bevat een bruikbare campagnerichting, geen generieke brainstormdump.
- [ ] Definitief resultaat wordt opgeslagen via de agent tool.

## F. Security

- [ ] OpenAI API key wordt alleen server-side gebruikt.
- [ ] `.env.example` bevat geen secret.
- [ ] `.env.local` wordt niet gecommit.
- [ ] UI-errors tonen geen secrets of stack traces.

## G. UX

- [ ] Interface is rustig en professioneel.
- [ ] Geen AI-sci-fi styling.
- [ ] Duidelijke visuele hierarchy.
- [ ] Running-state is duidelijk.
- [ ] Button kan niet per ongeluk meerdere runs tegelijk starten.
- [ ] Nieuwe run/reset werkt.
- [ ] Mobiele layout blijft functioneel.
- [ ] Focus states en labels zijn aanwezig.

## H. Educatieve waarde

Tijdens een demo moet de ontwikkelaar binnen ongeveer twee minuten in code kunnen aanwijzen:

- [ ] hier staat de Agent;
- [ ] hier staan zijn instructions;
- [ ] hier staan de lokale function tools;
- [ ] hier wordt hosted web search toegevoegd;
- [ ] hier start de agent loop;
- [ ] hier worden SDK-events naar UI-events vertaald;
- [ ] hier schrijft de agent een echt bestand weg.

Als dit alleen kan na uitleg van een complexe frameworklaag, is de implementatie te ingewikkeld.

## I. Live demo smoke test

Wanneer `OPENAI_API_KEY` beschikbaar is:

- [ ] standaard demo-input kan succesvol worden uitgevoerd;
- [ ] minimaal één run demonstreert echte tool calls;
- [ ] hosted web search is aantoonbaar functioneel met een researchgerichte input;
- [ ] brand context tool is aantoonbaar functioneel;
- [ ] references tool is aantoonbaar functioneel;
- [ ] save tool is aantoonbaar functioneel;
- [ ] eindresultaat verschijnt in UI en als bestand in `output/`.
