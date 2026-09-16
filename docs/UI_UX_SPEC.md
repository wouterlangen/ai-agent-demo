# UI / UX Spec

## 1. Ontwerpdoel

Maak een rustige, hoogwaardige productinterface waarmee de agent-run eenvoudig te volgen is.

De UI moet meer lijken op een goed ontworpen interne producttool dan op een futuristische AI-demo.

Visuele trefwoorden:

- minimalistisch;
- editorial;
- precies;
- veel witruimte;
- duidelijke typografische hierarchie;
- subtiele borders;
- rustige states;
- professioneel digital-agency niveau.

## 2. Desktop layout

Gebruik op brede schermen een duidelijke tweekoloms workspace.

### Linkerkolom

Ongeveer 34-40% breed.

Bevat:

- producttitel;
- korte uitleg;
- campagnebrief-formulier;
- primaire button `Start agent`.

De formkolom mag sticky zijn als dat eenvoudig blijft.

### Rechterkolom

Ongeveer 60-66% breed.

Bevat tijdens/na een run:

1. `Agent activity`
2. `Campaign brief`

Plaats activity bovenaan en de campagnebrief eronder, zodat de gebruiker tijdens de run eerst het proces ziet en daarna het resultaat.

## 3. Header

Houd de header klein.

Voorstel:

- eyebrow: `Agent demo`
- titel: `Campaign Strategist`
- subtitel: `Van campagnebrief naar onderbouwd concept, met tools die de agent zelf inzet.`

Geen groot hero-blok.

## 4. Formulier

Gebruik labels boven velden.

Velden:

- Organisatie
- Aanbod / onderwerp
- Campagnedoel
- Doelgroep
- Aanvullende context

Gebruik ruime textareas waar inhoud langer is.

Button states:

- idle: `Start agent`
- running: `Agent draait...`
- disabled zolang run actief is

Bied na afronding een eenvoudige actie `Nieuwe run` of resetmogelijkheid.

## 5. Agent activity

Dit is het belangrijkste visuele onderdeel.

Gebruik een verticale lijst/timeline van observeerbare events.

Voor ieder event:

- korte titel;
- optioneel compact detail;
- status `running`, `done` of `error`;
- optioneel tijdstip of verstreken tijd als dit eenvoudig is.

Voorbeelden:

```text
Campaign Strategist gestart

Flink brandcontext ophalen
Brandcontext beschikbaar

Webresearch gestart
Onderwerp: AI adoption digital teams Netherlands
Webresearch afgerond

Referentiecampagnes raadplegen
Focus: thought leadership en leadgeneratie
Referenties verwerkt

Campagnebrief opslaan
output/2026-09-16-ai-discovery-campaign.md
Campagnebrief opgeslagen

Run afgerond
```

Dit voorbeeld is geen vaste workflow. Toon alleen events die werkelijk plaatsvinden.

### Tool details

Toon veilige en compacte tooldetails.

Niet tonen:

- volledige toolresponses;
- volledige branddocumenten;
- volledige webpagina's;
- chain-of-thought;
- verborgen reasoning;
- API metadata die alleen voor developers relevant is.

## 6. Resultaat

Render Markdown prettig leesbaar.

Typography:

- duidelijke H2/H3 hierarchy;
- comfortabele line-height;
- voldoende ruimte tussen secties;
- lijsten duidelijk maar niet overdreven gestyled;
- maximale leesbreedte zodat lange regels worden voorkomen.

Tijdens de run mag output tekst streamen als dat zonder onnodige complexiteit kan. Dit is nice-to-have. Het belangrijkste is dat activity-events live verschijnen en het definitieve resultaat betrouwbaar wordt getoond.

## 7. Empty state

Voor de eerste run toont de rechterkolom geen nepactiviteiten.

Toon een rustige uitleg, bijvoorbeeld:

`Start een campagne om te zien welke tools de agent zelf besluit te gebruiken.`

Eventueel daaronder een korte legenda:

- `Hosted tool` - capability van OpenAI
- `Function tool` - capability uit onze eigen applicatie

Houd dit klein.

## 8. Error state

Toon een duidelijke foutmelding in de activity feed en/of boven het resultaat.

Voorbeeld:

`De agent-run kon niet worden afgerond. Controleer de serverconfiguratie en probeer opnieuw.`

Wanneer relevant mag een veilige foutcode of korte oorzaak worden getoond, zoals ontbrekende API key.

## 9. Responsive

Op kleinere schermen:

- stapel formulier, activity en resultaat onder elkaar;
- behoud alle functionaliteit;
- voorkom horizontale scrolling.

Desktop is de primaire demosituatie.

## 10. Stylingbeperkingen

Niet gebruiken tenzij technisch noodzakelijk:

- component library;
- icon library;
- Tailwind als het project niet al Tailwind gebruikt;
- grote design-system dependency.

Plain CSS, CSS Modules of een even eenvoudige aanpak heeft de voorkeur.

Gebruik geen emoji's als UI-iconen.

## 11. Accessibility basics

- semantische labels;
- keyboard bedienbare form controls;
- zichtbare focus state;
- voldoende kleurcontrast;
- statusinformatie niet uitsluitend met kleur communiceren;
- `aria-live` voor relevante live statusupdates als dit passend en eenvoudig is.
