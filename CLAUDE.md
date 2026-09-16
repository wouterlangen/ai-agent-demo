# Claude Code Project Instructions

## 1. Doel

Dit project is een educatieve demo waarmee we binnen digitaal bureau Flink willen laten zien wat een AI-agent is en hoe zo'n agent technisch werkt.

De demo moet niet alleen een goed campagneconcept genereren. De code en interface moeten vooral inzichtelijk maken:

- wat de agent is;
- welke instructions de agent krijgt;
- welke tools hij kan gebruiken;
- dat de agent zelf bepaalt welke tools relevant zijn;
- dat toolresultaten teruggaan naar de agent-loop;
- dat de agent meerdere stappen kan uitvoeren voordat hij een eindresultaat geeft;
- dat een agent naast informatie ophalen ook een actie kan uitvoeren.

Dit is nadrukkelijk geen productieproduct.

Optimaliseer in deze volgorde:

1. begrijpelijkheid van het agentconcept;
2. daadwerkelijk agentic gedrag;
3. correcte werking;
4. eenvoudige architectuur;
5. goede UX;
6. uitbreidbaarheid;
7. productiegeschiktheid.

## 2. Werk zelfstandig

Alle requirements staan in deze repository.

Vraag niet om bevestiging van implementatieplannen of tussenstappen. Werk zelfstandig door van setup naar implementatie, verificatie en afronding.

Wanneer iets niet is gespecificeerd:

1. kies de eenvoudigste redelijke oplossing;
2. voorkom nieuwe infrastructuur als die niet nodig is;
3. volg actuele officiële documentatie;
4. ga door.

Stel alleen een vraag wanneer verdere implementatie werkelijk onmogelijk is zonder ontbrekende informatie. Een ontbrekende API key blokkeert alleen live API-tests, niet de rest van de bouw.

## 3. Gebruik actuele documentatie

Gebruik de actuele officiële OpenAI Agents SDK voor TypeScript.

Vertrouw niet blind op API-syntax uit modelgeheugen. Controleer bij twijfel de officiële OpenAI Agents SDK-documentatie voordat je een SDK-feature implementeert.

De geverifieerde uitgangspunten op het moment waarop deze briefing is geschreven staan in `docs/OPENAI_SDK_REFERENCE.md`.

Als de actuele documentatie inmiddels afwijkt, heeft de actuele officiële documentatie voorrang. Pas de implementatie aan zonder het productdoel te veranderen.

## 4. Architectuurprincipes

Gebruik een kleine, directe architectuur.

Gebruik de OpenAI Agents SDK rechtstreeks. Bouw geen eigen generieke agent-frameworklaag om de SDK heen.

De kern moet tijdens een interne demo eenvoudig in broncode aan te wijzen zijn:

- dit is de agent;
- dit zijn zijn instructions;
- dit zijn zijn tools;
- hier wordt de agent-run gestart;
- hier worden echte run/tool-events vertaald naar de activity feed.

Maak hiervoor liever enkele duidelijke bestanden dan veel abstracties.

## 5. Geen overengineering

Voeg voor versie 1 niet toe:

- authenticatie;
- accounts;
- database;
- vector database;
- eigen RAG-infrastructuur;
- persistent memory;
- MCP;
- subagents;
- handoffs;
- queues;
- background jobs;
- analytics;
- externe CMS-integraties;
- HubSpot-integraties;
- Google Drive-integraties;
- cloud deployment-configuratie;
- uitgebreide state-management libraries;
- dependency injection frameworks;
- repositories/services als een directe functie duidelijker is;
- uitgebreide testframeworks voor LLM-evaluatie.

Maak ook geen features vooruit die alleen voor een mogelijke versie 2 nuttig zijn.

## 6. Codekwaliteit

- Gebruik TypeScript strict.
- Vermijd `any`.
- Gebruik betekenisvolle namen.
- Houd functies en bestanden gericht op één duidelijke verantwoordelijkheid.
- Gebruik Zod waar de Agents SDK of invoervalidatie daar logisch om vraagt.
- Voeg alleen dependencies toe wanneer ze duidelijke waarde hebben.
- Schrijf comments alleen wanneer de reden achter code niet vanzelfsprekend is.
- Houd agent-instructions als leesbare tekst bij de agentdefinitie of in één direct geïmporteerd bestand.
- Verberg de agentconfiguratie niet achter builders of factories zonder noodzaak.

## 7. Security en secrets

- `OPENAI_API_KEY` is uitsluitend server-side beschikbaar.
- Verstuur nooit een API key naar browsercode.
- Commit geen secrets.
- Maak een `.env.example` met alleen variabelenamen en veilige defaults/voorbeelden.
- Schrijf toolfouten veilig naar de UI zonder stack traces of secrets bloot te leggen.

## 8. Agentic gedrag bewaken

De demo mag niet stiekem een vaste workflow zijn.

Niet doen:

```text
brief -> altijd brand context -> altijd web search -> altijd references -> output
```

Wel doen:

```text
brief -> agent beoordeelt wat nodig is -> agent kiest relevante tools -> toolresultaten -> agent beoordeelt opnieuw -> eindresultaat
```

Het is toegestaan om productregels vast te leggen, zoals dat de definitieve campagnebrief moet worden opgeslagen. De onderzoeksroute moet echter door de agent worden bepaald.

## 9. Activity feed

De activity feed is een kernfeature van de demo.

Gebruik echte SDK-run-events, lifecycle hooks en/of stream-items als bron.

Maak nooit een lijst met vooraf geprogrammeerde stappen die doen alsof de agent ze uitvoert.

Toon geen verborgen chain-of-thought, private reasoning of ruwe redeneertokens.

Toon alleen observeerbare, betekenisvolle gebeurtenissen zoals:

- agent gestart;
- tool gestart;
- tool afgerond;
- type tool;
- veilige samenvatting van toolargumenten;
- resultaat wordt opgebouwd;
- campagnebrief opgeslagen;
- run afgerond;
- foutmelding.

## 10. UX

De UI is een demonstratie-instrument en geen AI-gimmick.

Vermijd:

- futuristische AI-vormgeving;
- neon/glow;
- gradients als decoratief AI-cliche;
- robotillustraties;
- overdadige dashboards;
- tientallen cards;
- animaties zonder functioneel doel.

Streef naar een hoogwaardige, rustige productinterface met sterke typografie en veel aandacht voor spacing, hierarchy en states.

## 11. Afronding

Wanneer de app werkt:

1. voer lint uit;
2. voer build uit;
3. voer relevante lokale verificaties uit;
4. voer een live smoke test uit als `OPENAI_API_KEY` beschikbaar is;
5. vergelijk de implementatie met `docs/ACCEPTANCE_CRITERIA.md`;
6. test de demonstratie uit `docs/DEMO_SCRIPT.md`;
7. schrijf of update `README.md` met installatie, env, starten, architectuuroverzicht en demo-instructie;
8. laat geen tijdelijke debugcode of ongebruikte scaffolding achter.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
