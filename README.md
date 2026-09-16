# Campaign Agent Demo

Een interne demo van digital bureau Flink die laat zien wat een AI-agent is en hoe die technisch werkt.

Je geeft de **Campaign Strategist** een compacte campagnebrief. De agent bepaalt vervolgens zelf welke informatie hij nodig heeft, kiest zelf welke tools hij inzet, verwerkt de resultaten en levert uiteindelijk een onderbouwde campagnebrief op. Die brief wordt door de agent zelf als Markdownbestand weggeschreven.

De activity feed toont daarbij uitsluitend echte run- en tool-events uit de OpenAI Agents SDK. Er zit geen vooraf geprogrammeerde timeline in.

> Dit is een educatieve demo, geen productieproduct.

## Prerequisites

- Node.js 20 of hoger (ontwikkeld op Node 22)
- Een OpenAI API key met toegang tot `gpt-5.6-sol`

## Installatie

```bash
npm install
```

## Environment

Maak een `.env.local` op basis van `.env.example`:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_DEFAULT_MODEL=gpt-5.6-sol
```

- `OPENAI_API_KEY` is verplicht en wordt **uitsluitend server-side** gebruikt.
- `OPENAI_DEFAULT_MODEL` is optioneel. Zonder deze variabele gebruikt de agent expliciet `gpt-5.6-sol`.

## Starten

```bash
npm run dev
```

Open http://localhost:3000. Het formulier is al ingevuld met de demo-briefing, dus je kunt direct op **Start agent** klikken.

## Een demo-run

1. Open de app. De rechterkolom is leeg: er worden geen nepstappen getoond.
2. Klik op **Start agent**.
3. De activity feed vult zich terwijl de run loopt. Elke regel komt uit een echt SDK-event.
4. Onderaan de feed staat zolang de run duurt een statusregel met een lopende klok — `Agent is bezig`, of `Resultaat wordt opgebouwd` zodra de tekst binnenstroomt. Dat is onze eigen applicatiestatus, geen agent-event, en daarom bewust rustiger opgemaakt.
5. De campagnebrief verschijnt eronder en streamt mee.
6. Onderaan de brief staat het relatieve pad van het opgeslagen bestand in `output/`.
7. Klik op **Nieuwe run** om opnieuw te beginnen.

Draai daarna de tweede briefing uit `docs/DEMO_SCRIPT.md` (de klantmiddag, met de opmerking dat actuele marktinformatie niet nodig is). De agent kiest daar doorgaans **geen** web search. Dat verschil is het punt van de demo: een tool die beschikbaar is, is niet een tool die altijd draait.

## Waar staat wat

Vier bestanden zijn genoeg om de demo in code uit te leggen:

| Wat | Bestand |
| --- | --- |
| De agent, zijn instructions en zijn vier tools | `lib/agent/campaign-agent.ts` |
| Hier start de agent loop en worden SDK-events vertaald naar UI-events | `lib/agent/run-campaign.ts` |
| De lokale function tools | `lib/agent/tools/` |
| Het eventmodel en de tool-labels voor de feed | `lib/agent/activity-events.ts` |

Verder:

```text
app/api/campaign/route.ts   validatie + NDJSON-stream naar de browser
app/page.tsx                leest de stream en houdt de run-state bij
components/                 formulier, activity feed, resultaat
data/                       brandcontext en referentiecampagnes (input voor de tools)
output/                     hier schrijft save_campaign_brief de briefs naartoe
```

### De vier capabilities

| Tool | Type | Doet |
| --- | --- | --- |
| `web_search` | hosted bij OpenAI | actuele openbare informatie ophalen |
| `read_brand_context` | function tool | leest `data/FLINK_BRAND_CONTEXT.md` |
| `read_reference_campaigns` | function tool | leest `data/REFERENCE_CAMPAIGNS.md` |
| `save_campaign_brief` | function tool | schrijft de definitieve brief naar `output/` |

De applicatie legt één productregel op: alleen de definitieve brief wordt opgeslagen. De onderzoeksroute bepaalt de agent zelf. `maxTurns` staat op `10` als veiligheidsgrens, niet als workflow.

## Verificatie

```bash
npm run lint          # ESLint
npm run build         # typecheck + productiebuild
npm run verify:tools  # draait de drie lokale tools tegen het echte filesystem
npm run smoke:agent   # live agent-run met de demo-briefing (vereist API key)
```

`npm run smoke:agent` print de vertaalde activity-events en het aantal woorden van het resultaat. Handig om te controleren of de agent daadwerkelijk tools kiest.

## OpenAI tracing bekijken

Tracing van de Agents SDK staat standaard aan op de Node-runtime. Na een run zie je de volledige technische trace — modelaanroepen, tool calls en hun resultaten — in de OpenAI trace viewer:

https://platform.openai.com/traces

Onze activity feed is bewust een productvisualisatie en toont minder technisch detail dan de trace viewer.

## Bekende beperkingen van versie 1

- Eén agent, geen subagents, handoffs of evaluators.
- Geen database, geen accounts, geen persistent memory. Een run staat op zichzelf.
- Briefs worden op het lokale filesystem geschreven, dus dit draait lokaal en niet serverless.
- Toolkeuze is niet deterministisch. Twee runs met dezelfde briefing kunnen andere tools gebruiken. Dat is opzettelijk.
- De activity feed toont bewust geen reasoning of ruwe toolresponses — alleen observeerbare acties en compacte, veilige details.
- Geen automatische tests; verificatie gebeurt via lint, build en de twee scripts hierboven.

## Gemaakte keuzes

- **NDJSON over een streaming POST** in plaats van SSE of WebSockets. De briefing gaat als POST-body mee en events zijn regel voor regel te verwerken.
- **Hosted web search wordt niet via run-item-events gevolgd** maar via de raw response items (`response.output_item.added` / `.done`). Die bevatten zowel het begin en einde van de zoekactie als de gebruikte zoekopdracht. OpenAI voert deze tool server-side uit, dus er is geen lokale tool call om op te hangen.
- **De save-tool schrijft zijn pad op de run context**, zodat de route het pad kan tonen zonder tooloutput te parsen.
- **Tekst die vóór een tool call binnenkomt wordt in de UI gewist.** De definitieve brief volgt na de laatste tool call, dus alleen die blijft staan.
