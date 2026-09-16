# Product Spec - Campaign Agent Demo

## 1. Productnaam

**Campaign Agent Demo**

Naam van de agent in de applicatie:

**Campaign Strategist**

## 2. Productdoel

De applicatie demonstreert aan collega's hoe een agent verschilt van een gewone chatprompt of vooraf vastgelegde workflow.

De gebruiker geeft een compacte campagnebrief. De Campaign Strategist bepaalt vervolgens zelfstandig welke beschikbare informatie relevant is, gebruikt waar nodig tools en levert uiteindelijk een onderbouwde campagnebrief op.

De gebruiker moet tijdens de run kunnen zien welke observeerbare acties de agent uitvoert.

## 3. Belangrijkste leerdoelen van de demo

Na een demo moet een collega kunnen begrijpen dat:

1. een agent instructions en een doel krijgt;
2. een agent capabilities in de vorm van tools krijgt;
3. niet iedere tool in iedere run gebruikt hoeft te worden;
4. de agent zelf kan bepalen welke tool op welk moment nuttig is;
5. toolresultaten onderdeel worden van de volgende stap van de agent;
6. de agent kan doorgaan totdat hij voldoende informatie heeft;
7. een tool zowel informatie kan ophalen als een actie kan uitvoeren;
8. de agent zelf in onze applicatie draait, terwijl het model via OpenAI wordt aangeroepen.

## 4. Primaire user flow

1. Gebruiker opent de demo.
2. Gebruiker vult een campagnebrief in.
3. Gebruiker klikt op `Start agent`.
4. Formulier wordt tijdelijk read-only of duidelijk in running-state gezet.
5. Activity feed toont echte gebeurtenissen uit de agent-run.
6. Agent kiest zelfstandig relevante tools.
7. Tool calls en afronding worden begrijpelijk zichtbaar gemaakt.
8. Eindresultaat verschijnt als leesbare campagnebrief.
9. Definitieve campagnebrief wordt via de save-tool lokaal als Markdown opgeslagen.
10. UI toont dat het bestand is opgeslagen en eventueel het relatieve pad.
11. Gebruiker kan daarna een nieuwe run starten.

## 5. Inputvelden

Gebruik de volgende velden.

### Organisatie

- type: text
- verplicht
- default voor demo: `Flink`

### Aanbod / onderwerp

- type: text
- verplicht
- default voor demo: `AI Discovery`

### Campagnedoel

- type: textarea of text
- verplicht
- default voor demo: `Gekwalificeerde leads genereren voor een AI Discovery sessie.`

### Doelgroep

- type: textarea
- verplicht
- default voor demo: `Digital managers en communicatieverantwoordelijken bij middelgrote en grote missiegedreven organisaties in Nederland.`

### Aanvullende context

- type: textarea
- optioneel
- default voor demo: `De campagne moet concreet en nuchter zijn. Vermijd AI-hype. Laat zien dat de sessie organisaties helpt om bruikbare AI-kansen voor website, CMS en redactie te vinden.`

Gebruik defaults zodat de demo direct startklaar is, maar laat alle velden aanpasbaar.

## 6. Verwacht eindresultaat

Laat de agent een compacte, professionele campagnebrief in Markdown genereren.

De campagnebrief bevat in beginsel:

1. `Campagnerichting`
2. `Waarom dit relevant is`
3. `Doelgroepinzicht`
4. `Propositie`
5. `Creatief haakje`
6. `Kernboodschap`
7. `Kanalen en middelen`
8. `Voorbeeldcopy`
9. `Onderbouwing / gebruikte externe inzichten` wanneer web search relevant is gebruikt
10. `Aannames en aandachtspunten`

Dit is geen hard JSON-schema. De agent mag de structuur licht aanpassen wanneer dat het resultaat inhoudelijk verbetert.

Het resultaat moet scanbaar blijven. Geen rapport van duizenden woorden.

Richtlengte: ongeveer 700 tot 1.200 woorden.

## 7. Kwaliteitscriteria voor inhoud

Het resultaat moet:

- specifiek zijn voor de briefing;
- aansluiten op de beschikbare brandcontext;
- geen algemene AI-marketingtekst worden;
- onderscheid maken tussen feitelijke externe informatie en creatieve voorstellen;
- geen actuele marktclaims verzinnen wanneer web search beschikbaar is;
- bruikbare keuzes maken in plaats van twintig losse ideeen geven;
- nuchter en professioneel geschreven zijn;
- in het Nederlands antwoorden wanneer de briefing Nederlandstalig is.

## 8. Wat de demo niet is

De applicatie is geen:

- volwaardig campaign management platform;
- contentkalender;
- marketing automation platform;
- chatbot met lange gespreksgeschiedenis;
- CMS;
- analytics dashboard;
- multi-agent systeem;
- productieklare SaaS.

## 9. Succes van versie 1

Versie 1 is succesvol wanneer iemand zonder technische achtergrond na vijf minuten demonstreren begrijpt:

> De Campaign Strategist krijgt een doel en tools. Wij schrijven niet vooraf uit welke stappen hij precies moet uitvoeren. De agent kiest zelf relevante tools, verwerkt de resultaten en werkt door totdat er een campagnebrief ligt.
