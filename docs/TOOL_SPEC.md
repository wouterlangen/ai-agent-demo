# Tool Spec

De Campaign Strategist heeft in versie 1 precies vier kerncapabilities.

## 1. Hosted web search

### Naam

Gebruik de hosted web search capability uit de officiële OpenAI Agents SDK. Gebruik de SDK-helper en bouw geen eigen crawler of zoek-API-wrapper.

### Doel

Actuele openbare informatie ophalen wanneer dit de campagnebeslissing aantoonbaar beter maakt.

Voorbeelden:

- recente AI-adoptietrends;
- actuele problemen van digital/communicatieteams;
- recente onderzoeken;
- marktcontext;
- actuele terminologie of ontwikkelingen.

### Gedrag

De tool is beschikbaar voor de agent, maar de applicatie roept hem niet vooraf aan.

De agent kiest zelf of web search nodig is.

### UI-event

Wanneer de hosted web search tool wordt gebruikt, toon bijvoorbeeld:

`Webresearch gestart`

en na afronding:

`Webresearch afgerond`

Toon waar betrouwbaar beschikbaar een compacte, veilige weergave van de query of het onderwerp. Toon geen enorme ruwe response in de activity feed.

## 2. `read_brand_context`

### Type

Eigen function tool.

### Doel

Interne merk- en positioneringscontext van Flink beschikbaar maken aan de agent.

### Input

Geen input nodig.

Houd dit bewust eenvoudig.

### Implementatie

Lees server-side:

`data/FLINK_BRAND_CONTEXT.md`

Retourneer de tekstinhoud.

Geen vector search, embeddings of database.

### Tool description voor het model

Gebruik een duidelijke description in de trant van:

`Read Flink's internal brand, positioning, audience and tone-of-voice context. Use when the campaign concerns Flink or when Flink's brand context is relevant.`

### UI-events

Start:

`Flink brandcontext ophalen`

Afgerond:

`Brandcontext beschikbaar`

## 3. `read_reference_campaigns`

### Type

Eigen function tool.

### Doel

Een klein aantal fictieve eerdere campagnes en leerpunten als interne referentie beschikbaar maken.

### Input

Gebruik bij voorkeur een klein Zod-schema met een optioneel veld zoals:

`focus?: string`

Het veld helpt het model uit te leggen waar het naar zoekt, maar de implementatie mag voor versie 1 gewoon het volledige kleine bestand retourneren.

### Implementatie

Lees server-side:

`data/REFERENCE_CAMPAIGNS.md`

Geen embeddings, semantische zoekmachine of database.

### Tool description

Bijvoorbeeld:

`Read a small set of internal reference campaigns and lessons. Use when previous campaign patterns, messaging approaches or channel lessons can improve the proposal.`

### UI-events

Start:

`Referentiecampagnes raadplegen`

Afgerond:

`Referenties verwerkt`

Als `focus` aanwezig is, mag deze veilig als detail in de UI worden getoond.

## 4. `save_campaign_brief`

### Type

Eigen function tool.

### Doel

Laten zien dat een agent niet alleen informatie ophaalt, maar ook een actie kan uitvoeren.

### Input

Gebruik een duidelijk Zod-schema, minimaal:

- `title: string`
- `content: string`

Optioneel:

- `slug: string`

Als `slug` niet wordt meegegeven, maak server-side een veilige slug.

### Implementatie

Schrijf de definitieve Markdown naar:

`output/`

Gebruik een veilige bestandsnaam, bijvoorbeeld:

`2026-09-16-ai-discovery-campaign.md`

Gebruik geen absolute filesystempaden in de gebruikersinterface. Retourneer het relatieve pad.

Maak `output/` automatisch aan wanneer nodig.

### Tool description

Bijvoorbeeld:

`Save the final campaign brief as a local Markdown file. Only use this once the final campaign brief is complete.`

### UI-events

Start:

`Campagnebrief opslaan`

Afgerond:

`Campagnebrief opgeslagen`

Toon als detail het geretourneerde relatieve bestandspad.

## 5. Tool errors

Toolfouten moeten:

- server-side voldoende duidelijk gelogd worden;
- als gecontroleerde fout terugkomen in de agent-run waar mogelijk;
- in de UI in gewone taal zichtbaar worden;
- nooit secrets of volledige stack traces tonen.

## 6. Geen nep-tools

Alle vier capabilities moeten echt werken.

Vooral belangrijk voor de demo:

- web search moet de hosted SDK-tool zijn;
- local tools moeten daadwerkelijk bestanden lezen/schrijven;
- de activity feed moet gekoppeld zijn aan echte calls.
