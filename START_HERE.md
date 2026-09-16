# START HERE - Campaign Agent Demo

## Opdracht aan Claude Code

Bouw de Campaign Agent Demo die in deze repository is gespecificeerd.

Deze repository bevat de volledige product-, UX-, agent- en technische briefing. Behandel de inhoud van deze bestanden als de requirements voor het project.

Lees voordat je code schrijft in deze volgorde:

1. `CLAUDE.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/AGENT_SPEC.md`
4. `docs/TOOL_SPEC.md`
5. `docs/UI_UX_SPEC.md`
6. `docs/TECHNICAL_ARCHITECTURE.md`
7. `docs/BUILD_PLAN.md`
8. `docs/ACCEPTANCE_CRITERIA.md`
9. `docs/OPENAI_SDK_REFERENCE.md`
10. `data/FLINK_BRAND_CONTEXT.md`
11. `data/REFERENCE_CAMPAIGNS.md`

`docs/DEMO_SCRIPT.md` beschrijft de beoogde demonstratie en gebruik je bij de laatste QA.

## Belangrijkste opdracht

Ga na het lezen zelfstandig aan de slag met de volledige implementatie.

Vraag niet om goedkeuring van een plan of tussenstappen. De product- en architectuurkeuzes die hier zijn vastgelegd zijn al goedgekeurd.

Als een detail niet expliciet is gespecificeerd:

- kies de eenvoudigste oplossing die bij de requirements past;
- optimaliseer voor begrijpelijkheid van de code en demo;
- documenteer alleen belangrijke afwijkingen of keuzes in de uiteindelijke `README.md`;
- ga vervolgens verder.

Stop alleen wanneer er een echte blocker is die je technisch niet zelf kunt oplossen. Een ontbrekende `OPENAI_API_KEY` is geen reden om de bouw te stoppen. Bouw en verifieer dan alles wat zonder live API-call kan, en beschrijf daarna exact welke live smoke test nog uitgevoerd moet worden.

## Definition of done

Het werk is pas klaar wanneer:

- de applicatie lokaal start;
- de Campaign Strategist daadwerkelijk via de OpenAI Agents SDK draait;
- de agent zelf tools kan kiezen;
- hosted web search beschikbaar is;
- de lokale brand-context tool werkt;
- de reference-campaign tool werkt;
- de save-campaign tool werkt;
- echte agent/tool-events zichtbaar zijn in de activity feed;
- er geen gesimuleerde activity-events worden getoond;
- het eindresultaat als campagnebrief zichtbaar is;
- de campagnebrief als Markdownbestand wordt opgeslagen;
- `npm run lint` slaagt;
- `npm run build` slaagt;
- de live demo-flow uit `docs/DEMO_SCRIPT.md` is getest wanneer een API key beschikbaar is;
- de uiteindelijke `README.md` in enkele stappen uitlegt hoe de demo wordt gestart.

Begin nu met de implementatie volgens `docs/BUILD_PLAN.md` en werk zelfstandig door tot deze Definition of Done is bereikt.
