# Build Plan

Werk onderstaande fasen zelfstandig en in volgorde af. Stop niet voor approval tussen fasen.

## Fase 0 - Repository inspecteren

1. Lees alle briefingbestanden.
2. Inspecteer de bestaande repository.
3. Bepaal of er al een bruikbare Next.js/TypeScript-app staat.
4. Behoud bruikbare bestaande setup.
5. Als de repository alleen deze instructies bevat, initialiseer de applicatie in dezelfde projectroot zonder de briefingbestanden te verwijderen.

Controleer voor SDK-details de actuele officiële OpenAI Agents SDK TypeScript-documentatie.

## Fase 1 - Basissetup

1. Richt actuele stabiele Next.js + TypeScript in als dat nog nodig is.
2. Gebruik App Router.
3. Installeer `@openai/agents` en `zod`.
4. Voeg alleen extra packages toe die aantoonbaar nodig zijn.
5. Maak `.env.example`.
6. Controleer `.gitignore`.
7. Zorg dat `npm run dev`, `npm run lint` en `npm run build` beschikbaar zijn.

Voer een eerste build uit voordat je verder gaat.

## Fase 2 - Local function tools

Implementeer eerst de drie eenvoudige lokale tools:

1. `read_brand_context`
2. `read_reference_campaigns`
3. `save_campaign_brief`

Verifieer dat ze server-side de juiste bestanden lezen/schrijven.

Houd de implementatie direct en leesbaar.

## Fase 3 - Campaign Strategist agent

1. Maak de `Campaign Strategist` Agent.
2. Gebruik de instructions uit `AGENT_SPEC.md`.
3. Voeg hosted web search toe.
4. Voeg de drie lokale tools toe.
5. Configureer model en max-turn policy.
6. Zorg dat de kernconfiguratie in broncode zeer eenvoudig te begrijpen is.

Maak eerst een kleine server-side smoke path/script of tijdelijke eenvoudige call om te controleren dat de agent-run werkt. Verwijder tijdelijke debugcode daarna of zet een nuttige smoke script netjes in `scripts/`.

Als `OPENAI_API_KEY` ontbreekt, ga verder met de overige fasen.

## Fase 4 - Streaming runner en eventvertaling

1. Start de agent via de officiële runner.
2. Gebruik streaming.
3. Observeer echte tool/run-events.
4. Vertaal deze naar het kleine app-level eventmodel.
5. Zorg dat hosted web search en function tools in de activity feed herkenbaar zijn.
6. Stream het finale resultaat en foutstates betrouwbaar naar de client.

Val niet terug op gesimuleerde activity-stappen wanneer een event lastig te vangen is. Zoek eerst in de actuele SDK-documentatie naar run item events of lifecycle hooks.

## Fase 5 - API route

Bouw de serverroute voor een campaign-run.

Verantwoordelijkheden:

- input lezen;
- valideren;
- een nette agent-input samenstellen;
- streaming runner starten;
- NDJSON/SSE events naar client sturen;
- abort/error netjes afhandelen.

De route bevat geen UI-logica en zo min mogelijk agentconfiguratie.

## Fase 6 - Interface

Bouw de UI volgens `UI_UX_SPEC.md`.

Prioriteit:

1. helder formulier;
2. activity feed;
3. campaign result;
4. loading/error/reset states;
5. visuele polish.

Gebruik de demo-defaults uit `PRODUCT_SPEC.md`.

Maak de interface niet groter dan nodig.

## Fase 7 - Integratie-QA

Controleer:

- form -> API -> agent -> tools -> stream -> UI;
- save-tool schrijft werkelijk een bestand;
- activity feed gebruikt werkelijk ontvangen events;
- nieuwe run reset oude run state correct;
- API key blijft server-side;
- UI blijft bruikbaar bij een fout.

## Fase 8 - Kwaliteitscontrole

Voer uit:

```bash
npm run lint
npm run build
```

Los alle fouten op.

Voer live smoke test uit als een API key beschikbaar is.

Controleer daarna punt voor punt `ACCEPTANCE_CRITERIA.md`.

## Fase 9 - Demo-QA

Gebruik `DEMO_SCRIPT.md`.

Start met de standaard ingevulde Flink / AI Discovery brief.

Controleer of een run daadwerkelijk zichtbaar maakt dat de agent zelfstandig tools gebruikt.

Omdat toolkeuze niet deterministisch is, is niet vereist dat iedere run exact dezelfde tools aanroept. Wel moet minstens een gerichte demo/smoke input kunnen aantonen dat hosted web search en de function tools werken.

Pas de agent instructions alleen aan als toolgebruik structureel onlogisch is. Programmeer geen vaste toolvolgorde om de demo voorspelbaar te maken.

## Fase 10 - README en cleanup

Schrijf `README.md` voor de mens die de demo morgen opent.

README bevat compact:

- wat dit is;
- prerequisites;
- installatie;
- `.env.local` setup;
- starten;
- waar agent, tools en activity-eventcode staan;
- hoe een demo-run werkt;
- hoe OpenAI tracing bekeken kan worden;
- bekende beperkingen van versie 1.

Verwijder:

- debug logging die niet meer nuttig is;
- ongebruikte imports;
- scaffold content;
- tijdelijke testbestanden;
- placeholder UI.

Rond pas daarna af.
