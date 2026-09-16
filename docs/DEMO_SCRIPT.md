# Demo Script

Dit document helpt de uiteindelijke applicatie te testen en intern te demonstreren.

## 1. Verhaal in een zin

`We geven de agent een doel en een set capabilities, maar we programmeren niet vooraf welke onderzoekstappen hij moet nemen.`

## 2. Standaard demo-input

Gebruik de standaardwaarden in het formulier:

**Organisatie**

Flink

**Aanbod / onderwerp**

AI Discovery

**Campagnedoel**

Gekwalificeerde leads genereren voor een AI Discovery sessie.

**Doelgroep**

Digital managers en communicatieverantwoordelijken bij middelgrote en grote missiegedreven organisaties in Nederland.

**Aanvullende context**

De campagne moet concreet en nuchter zijn. Vermijd AI-hype. Laat zien dat de sessie organisaties helpt om bruikbare AI-kansen voor website, CMS en redactie te vinden. Gebruik waar zinvol actuele openbare inzichten over AI-adoptie of uitdagingen van digitale teams.

De laatste zin maakt webresearch waarschijnlijk relevant, zonder in applicatiecode af te dwingen dat web search altijd gebruikt wordt.

## 3. Wat je tijdens de demo vertelt

Start met de broncode van de agent of de applicatie.

Leg kort uit:

1. `Dit is de Campaign Strategist.`
2. `Hier krijgt hij zijn doel en gedragsregels.`
3. `Hier geven we hem vier capabilities.`
4. `Een daarvan, web search, wordt door OpenAI gehost.`
5. `Twee tools lezen onze eigen lokale context.`
6. `De laatste tool kan daadwerkelijk een bestand opslaan.`
7. `Wat we niet programmeren is: doe eerst tool A, daarna B, daarna C.`

Start daarna de run.

## 4. Waar het publiek op moet letten

Wijs tijdens de activity feed aan:

- welke tool de agent gebruikt;
- dat een tool kan starten en afronden;
- dat niet de UI maar de agent-run deze events veroorzaakt;
- dat de volgorde niet hardcoded hoeft te zijn;
- dat het resultaat pas na meerdere agent/tool-turns ontstaat;
- dat de save-tool een echte actie uitvoert.

## 5. Na afloop

Open desgewenst:

- het opgeslagen Markdownbestand in `output/`;
- de OpenAI trace viewer om de technische run te laten zien;
- `campaign-agent.ts`;
- een lokale toolimplementatie.

Daarmee kun je drie niveaus laten zien:

```text
UI
-> onze agent runtime/code
-> OpenAI model + hosted capabilities
```

## 6. Extra test om autonomie zichtbaar te maken

Voer daarna een tweede, eenvoudigere briefing uit waarbij actuele research nauwelijks nodig is, bijvoorbeeld:

**Organisatie:** Flink

**Aanbod:** Bestaande klanten uitnodigen voor een kleinschalige klantmiddag

**Doel:** Bestaande relaties versterken

**Doelgroep:** Bestaande klanten van Flink

**Context:** Gebruik alleen de beschikbare interne context. Actuele marktinformatie is niet nodig.

Verwachting:

De agent hoeft in deze run niet per se web search te gebruiken.

Dat verschil is educatief waardevol. Het laat zien dat `tool beschikbaar` niet hetzelfde is als `tool altijd uitvoeren`.

## 7. Als web search in de eerste run niet wordt gebruikt

Maak de applicatie niet deterministisch om de demo te forceren.

Test eerst een briefing waarbij actuele onderbouwing explicieter waarde toevoegt, bijvoorbeeld:

`Onderbouw de campagnerichting met actuele openbare inzichten uit 2026 over AI-adoptie en de belangrijkste praktische blokkades voor digitale en communicatieteams in Nederland.`

Wanneer web search dan nog structureel niet wordt gekozen, verbeter de agent-instruction over research. Hardcode de toolcall niet.
