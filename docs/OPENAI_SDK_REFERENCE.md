# OpenAI Agents SDK - Verified Technical Assumptions

Laatst gecontroleerd: 15 september 2026.

Dit document voorkomt dat de implementatie onnodig op verouderde SDK-aannames wordt gebaseerd.

Controleer bij implementatietwijfel altijd opnieuw de actuele officiële documentatie. De actuele documentatie heeft voorrang op dit bestand.

## 1. Package en basis

Officiele TypeScript package:

```text
@openai/agents
```

Zod v4 wordt gebruikt voor onder andere tool schemas.

Basisinstallatie volgens de officiele quickstart:

```bash
npm install @openai/agents zod
```

Official docs:

- https://openai.github.io/openai-agents-js/
- https://openai.github.io/openai-agents-js/guides/quickstart/

## 2. Agent en runner

Een text agent kan rechtstreeks met `Agent` worden gedefinieerd en met `run()` of `Runner` worden uitgevoerd.

De runner voert de agent-loop uit:

1. model aanroepen;
2. final output, handoff of tool call inspecteren;
3. tools uitvoeren indien nodig;
4. toolresultaten aan context toevoegen;
5. agent opnieuw aanroepen;
6. herhalen tot final output of safety limit.

Official docs:

- https://openai.github.io/openai-agents-js/guides/agents/
- https://openai.github.io/openai-agents-js/guides/running-agents/

## 3. Hosted web search

De TypeScript Agents SDK heeft een hosted web search tool.

De helper heet op het moment van schrijven:

```text
webSearchTool(...)
```

Dit is een hosted OpenAI tool. Bouw voor deze demo dus geen eigen browser, crawler of zoek-API.

Official docs:

- https://openai.github.io/openai-agents-js/guides/tools/
- https://openai.github.io/openai-agents-js/openai/agents/functions/websearchtool/

## 4. Function tools

Lokale TypeScript-functies kunnen als agent tools worden aangeboden via de SDK function-tool capability.

De SDK-helper heet op het moment van schrijven:

```text
tool(...)
```

Gebruik Zod voor parameters waar relevant.

Official docs:

- https://openai.github.io/openai-agents-js/guides/tools/
- https://openai.github.io/openai-agents-js/openai/agents/functions/tool/

## 5. Streaming

De SDK ondersteunt streaming runs.

Met streaming levert de run een async iterable van events.

Belangrijke eventcategorieen zijn volgens de huidige documentatie onder andere:

- raw model stream events;
- run item stream events;
- agent update events.

Run item events kunnen informatie bevatten over berichten, tool calls, tool outputs en handoffs.

Gebruik voor de activity feed bij voorkeur semantische run/tool events, niet ruwe model-reasoning.

Official docs:

- https://openai.github.io/openai-agents-js/guides/streaming/

## 6. Lifecycle hooks

Agents/Runner ondersteunen lifecycle events, waaronder op het moment van schrijven:

- `agent_start`
- `agent_end`
- `agent_handoff`
- `agent_tool_start`
- `agent_tool_end`

Deze kunnen nuttig zijn voor een begrijpelijke tool activity feed.

Controleer tijdens implementatie of lifecycle hooks of streamed run item events de eenvoudigste betrouwbare oplossing geven.

Official docs:

- https://openai.github.io/openai-agents-js/guides/agents/

## 7. Tracing

Tracing is ingebouwd.

In ondersteunde server runtimes zoals Node.js is tracing volgens de huidige documentatie standaard ingeschakeld, tenzij expliciet uitgeschakeld.

Tracing bevat onder andere modelgeneraties en tool calls en is bedoeld voor debugging/observability.

Official docs:

- https://openai.github.io/openai-agents-js/guides/tracing/

## 8. maxTurns

De runner heeft een max-turn safety limit.

De huidige documentatie noemt `10` als default.

Voor de demo mag `maxTurns: 10` expliciet worden ingesteld zodat dit gedrag in de code zichtbaar is.

Official docs:

- https://openai.github.io/openai-agents-js/guides/running-agents/

## 9. Model

De huidige SDK-documentatie noemt `gpt-5.6-luna` als default wanneer geen model wordt gespecificeerd en `gpt-5.6-sol` als expliciet model voor zwaardere taken.

Voor deze demo is `gpt-5.6-sol` een passende expliciete keuze, tenzij actuele documentatie of accountbeschikbaarheid anders vereist.

Maak de keuze eenvoudig configureerbaar.

Official docs:

- https://openai.github.io/openai-agents-js/guides/models/

## 10. Technische regel voor Claude Code

Als een codevoorbeeld uit deze briefing niet exact compileert met de geinstalleerde SDK-versie:

1. controleer eerst de actuele officiele SDK-documentatie;
2. pas de syntax aan de actuele SDK aan;
3. behoud het productgedrag uit de briefing;
4. voeg geen alternatieve agentframeworks toe om een kleine SDK-wijziging te omzeilen.
