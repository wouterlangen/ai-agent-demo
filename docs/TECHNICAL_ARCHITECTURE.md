# Technical Architecture

## 1. Stack

Gebruik een eenvoudige full-stack TypeScript-opzet.

Voorkeursstack:

- actuele stabiele Next.js;
- App Router;
- TypeScript strict;
- React;
- Node.js server runtime;
- officiële `@openai/agents` package;
- Zod v4;
- eenvoudige Markdown renderer voor het eindresultaat indien nodig.

Gebruik geen Edge runtime voor de agent-route als Node filesystem APIs nodig zijn voor lokale tools.

Als de repository al een passende TypeScript/React-setup bevat, behoud die in plaats van onnodig opnieuw te initialiseren.

## 2. Voorgestelde projectstructuur

Houd de uiteindelijke structuur ongeveer als volgt. Kleine afwijkingen zijn toegestaan als ze eenvoudiger zijn.

```text
/
├── app/
│   ├── api/
│   │   └── campaign/
│   │       └── route.ts
│   ├── page.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── CampaignForm.tsx
│   ├── AgentActivity.tsx
│   └── CampaignResult.tsx
│
├── lib/
│   └── agent/
│       ├── campaign-agent.ts
│       ├── run-campaign.ts
│       ├── activity-events.ts
│       └── tools/
│           ├── read-brand-context.ts
│           ├── read-reference-campaigns.ts
│           └── save-campaign-brief.ts
│
├── data/
│   ├── FLINK_BRAND_CONTEXT.md
│   └── REFERENCE_CAMPAIGNS.md
│
├── output/
│
├── docs/
│   └── ... briefing files ...
│
├── .env.example
├── CLAUDE.md
├── START_HERE.md
└── README.md
```

Het belangrijkste is dat `campaign-agent.ts`, de tools en de runner snel vindbaar zijn.

## 3. Agentdefinitie

`campaign-agent.ts` bevat zichtbaar:

- Agent import;
- agentnaam;
- model/configuratie;
- instructions;
- lijst van tools.

Hosted web search wordt rechtstreeks als tool aan de agent toegevoegd.

De drie lokale function tools worden rechtstreeks toegevoegd.

Vermijd een generieke registry tenzij de SDK dit aantoonbaar vereist.

## 4. Runner

Gebruik de officiële SDK `Runner` of `run()`.

Een expliciete `Runner` heeft de voorkeur wanneer dit de lifecycle en event-observability duidelijker maakt.

Gebruik streaming voor de webroute zodat activity-events tijdens de run naar de browser kunnen worden gestuurd.

Stel `maxTurns` expliciet in op ongeveer 10.

Gebruik ingebouwde tracing in server-side development. Schakel tracing niet zonder reden uit.

## 5. Streaming protocol tussen server en browser

Gebruik een eenvoudige streaming response op de POST-request.

Voorkeur: newline-delimited JSON (`application/x-ndjson`) over een gewone `fetch()` request, omdat:

- de campagnebrief als POST-body wordt verstuurd;
- er geen aparte WebSocket-infrastructuur nodig is;
- events gemakkelijk incrementeel verwerkt kunnen worden.

SSE over een streaming POST-response is ook toegestaan als de implementatie aantoonbaar eenvoudiger/robuuster is in de gekozen Next.js-versie.

Bouw geen WebSocket-server voor deze demo.

## 6. App-level eventmodel

Vertaal SDK-events naar een klein eigen UI-eventmodel.

Bijvoorbeeld:

```ts
type CampaignStreamEvent =
  | { type: 'run_started'; label: string }
  | { type: 'activity_started'; id: string; label: string; detail?: string }
  | { type: 'activity_completed'; id: string; label: string; detail?: string }
  | { type: 'output_delta'; text: string }
  | { type: 'final'; markdown: string; savedPath?: string }
  | { type: 'error'; message: string };
```

Exacte naming mag afwijken.

Houd het model klein.

## 7. Bronnen voor activity-events

Gebruik echte OpenAI Agents SDK observability.

Geschikte bronnen zijn afhankelijk van de actuele SDK:

- streamed run events;
- `run_item_stream_event` voor tool calls/tool outputs;
- agent/runner lifecycle hooks zoals tool start/tool end;
- raw text deltas uitsluitend voor output streaming wanneer nuttig.

Gebruik lifecycle hooks of run items zo dat tool calls betrouwbaar kunnen worden gekoppeld aan activity entries.

Maak een kleine mapping van technische toolnaam naar gebruikerslabel, bijvoorbeeld:

```text
read_brand_context -> Flink brandcontext ophalen
read_reference_campaigns -> Referentiecampagnes raadplegen
save_campaign_brief -> Campagnebrief opslaan
web_search -> Webresearch
```

Gebruik geen model-reasoning als bron voor activity labels.

## 8. Inputvalidatie

Valideer server-side minimaal:

- organisatie niet leeg;
- aanbod niet leeg;
- campagnedoel niet leeg;
- doelgroep niet leeg;
- redelijke maximale veldlengtes.

Client-side `required` is handig maar geen vervanging voor servervalidatie.

## 9. Local filesystem

Gebruik Node filesystem APIs voor:

- brandcontext lezen;
- reference campaigns lezen;
- definitieve campagnebrief schrijven.

Los paden op vanaf projectroot op een robuuste manier.

Schrijf alleen binnen `output/`.

Sanitize een eventuele slug/bestandsnaam.

## 10. Environment

Maak minimaal:

```env
OPENAI_API_KEY=
OPENAI_DEFAULT_MODEL=gpt-5.6-sol
```

Voeg `.env.local` aan `.gitignore` toe.

Gebruik geen client-prefixed environment variable voor de OpenAI API key.

## 11. Tracing

De OpenAI Agents SDK ondersteunt server-side tracing.

Gebruik de standaard tracing zodat de developer in OpenAI's trace viewer tool calls en agent-runs kan onderzoeken.

Onze eigen activity feed is een productvisualisatie en hoeft niet dezelfde hoeveelheid technische detail te tonen als tracing.

## 12. Error handling

Vang minimaal af:

- ontbrekende API key;
- inputvalidatiefouten;
- SDK/API errors;
- tool filesystem errors;
- max-turn fout;
- streaming client disconnect indien eenvoudig detecteerbaar.

Stuur een gecontroleerd `error` event voordat de stream sluit wanneer mogelijk.

## 13. Dependencies

Verwacht minimaal:

- `@openai/agents`
- `zod`
- frameworkdependencies
- eventueel `react-markdown` voor rendering

Voeg geen orchestration frameworks zoals LangGraph toe.

## 14. Tests en verificatie

Geen uitgebreid testframework verplicht.

Wel verplicht:

- typecheck via build;
- lint;
- lokale functions handmatig of met klein script verifieerbaar;
- live agent smoke test wanneer API key beschikbaar is.

Als een paar kleine unit tests met de standaard setup eenvoudig waarde toevoegen, mag dat. Bouw geen testarchitectuur die groter is dan de demo.
