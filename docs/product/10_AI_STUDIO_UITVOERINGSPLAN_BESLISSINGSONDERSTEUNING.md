# 10 — AI Studio uitvoeringsplan: beslissingsondersteuning

**Status:** uitvoeringsreeks na expliciete vrijgave per prompt
**Repository:** Sethos21/VastgoedPulse
**Branch:** main

## Werkwijze

Dit document vertaalt de vastgestelde productrichting naar korte, afgebakende bouwopdrachten voor Google AI Studio.

Regels voor iedere prompt:
- voer uitsluitend de vrijgegeven prompt uit;
- voer prompts niet automatisch achter elkaar uit;
- na iedere prompt: stop en meld kort wat is gewijzigd, welke bestanden zijn geraakt, welke gerichte tests zijn uitgevoerd en eventuele blokkades;
- wacht daarna op expliciete bevestiging, bijvoorbeeld: "Getest en akkoord, ga verder met Prompt 09."
- herontwerp of herbouw bewezen bestaande functionaliteit niet;
- lees alleen documentatie/code die voor de betreffende wijziging nodig is;
- gebruik de bestaande centrale deterministische rekenengine; maak geen parallelle financiële/fiscale rekenlogica;
- test alleen nieuwe/gewijzigde functionaliteit plus direct geraakte bestaande tests;
- geen brede regressie, architectuurheranalyse of cosmetische refactor zonder concrete noodzaak;
- fiscale en financiële aannames nooit zelfstandig aanvullen.

## Prompt 01 — Documentatie opnemen in bouwplanning

Lees:
- docs/product/08_IMPLEMENTATIESPECIFICATIE_BOX3_MODULE.md
- docs/product/09_ONTWERP_BESLISSINGSONDERSTEUNING_EN_SCENARIOANALYSE.md
- dit uitvoeringsplan.

Neem document 09 op als ontwerp-/roadmapbron voor komende uitbreidingen. Document 08 blijft leidend voor reeds vastgestelde Box 3-logica. Bouw nog niets uit document 09 dat niet via een afzonderlijke prompt hieronder is vrijgegeven.

Controleer alleen de relevante huidige implementatiestructuur en meld:
1. waar ieder nieuw onderdeel logisch aansluit;
2. welke bestaande engine/output kan worden hergebruikt;
3. eventuele echte blokkades of conflicten.

Wijzig geen productiecode. Stop daarna.

## Prompt 02 — Object toevoegen via URL: basisflow

Bouw de basisflow Object toevoegen via URL conform document 09 §16.

Maak een brononafhankelijke invoerflow:
URL → opgehaalde publieke objectdata → controle/correctie door gebruiker → ontbrekende velden aanvullen → opslaan als regulier VastgoedPulse-object.

Hergebruik het bestaande Property/objectmodel waar mogelijk. Bewaar bron-URL en onderscheid automatisch opgehaalde versus handmatig aangepaste data. Gok nooit ontbrekende waarden.

Bouw geen websitespecifieke scraperarchitectuur als dat niet nodig is. Als echte URL-extractie een backend/externe dienst vereist die niet beschikbaar is, bouw de interface en nette adaptergrens en meld de blokkade; simuleer geen live data.

Voer alleen gerichte tests voor deze flow uit. Stop daarna.

## Prompt 03 — Financieringsmodel uitbreiden

Breid het bestaande financieringsmodel uit voor:
- aankoopprijs en taxatiewaarde afzonderlijk;
- financieringswaarde standaard = laagste van beide, met handmatige override;
- rente;
- looptijd;
- aflossingsvorm: aflossingsvrij, lineair, annuïtair;
- schuld/restschuld per jaar.

Financiering heeft alleen betrekking op vastgoedwaarde, niet automatisch op overdrachtsbelasting of overige aankoopkosten.

Hergebruik bestaande financieringsberekeningen waar correct; wijzig Box 3-logica niet. Voeg alleen gerichte tests toe voor de drie aflossingsvormen en schuldontwikkeling. Stop daarna.

## Prompt 04 — LTV

Voeg LTV toe aan dezelfde centrale scenario-output.

Bereken LTV vanuit lening en gekozen financieringswaarde. Toon:
- financieringswaarde en herkomst;
- lening;
- LTV;
- instelbare maximale LTV;
- maximale lening op basis van LTV.

Gebruik geen bank-specifieke norm als vaste default zonder gedocumenteerde configuratie. Geen parallelle waarderingslogica.

Test alleen LTV-berekening, override en grensgevallen. Stop daarna.

## Prompt 05 — DSCR en kasstroomtoets

Voeg DSCR per jaar toe op basis van de bestaande operationele kasstroom en debt service.

Toon:
- DSCR per jaar;
- laagste DSCR over de analyseperiode;
- jaar waarin de laagste DSCR optreedt;
- instelbare minimale DSCR;
- maximale financiering volgens de kasstroomtoets zodra de exacte debt-sizingregel in het FO is vastgesteld.

Verzin geen ontbrekende debt-sizingnorm of formule. Als die nog niet functioneel is vastgesteld, implementeer de ratio en interface/configuratie maar laat automatische maximale lening op DSCR nog open.

Gerichte tests uitsluitend voor DSCR en direct geraakte financieringscashflows. Stop daarna.

## Prompt 06 — Debt Yield en ICR

Voeg financierings-KPI’s toe aan dezelfde scenario-output:
- Debt Yield als primaire KPI;
- ICR als aanvullende KPI.

Gebruik NOI/rente/schuld uit de bestaande engine; reken deze waarden niet opnieuw op een afwijkende manier uit. Normen blijven configureerbaar.

Toon korte begrijpelijke uitleg via de bestaande uitleglaag. Test alleen formules, presentatie en relevante grensgevallen. Stop daarna.

## Prompt 07 — Maximale financiering

Bouw de gecombineerde financieringstoets zodra LTV- en kasstroomregels functioneel volledig zijn vastgesteld.

Toon afzonderlijk:
- maximum op waarde/LTV;
- maximum op kasstroom/DSCR;
- eventueel Debt Yield-limiet indien als norm vastgesteld;
- uiteindelijke maximale financiering = meest beperkende geldige toets;
- welke toets limiterend is.

Geen automatische uitspraak dat een bank de lening zal verstrekken.

Gebruik bestaande outputs uit Prompts 04–06; geen dubbele berekeningen. Gerichte tests op limiterende toets en grensgevallen. Stop daarna.

## Prompt 08 — Maximaal drie financieringsscenario’s

Maak vergelijking van maximaal drie financieringsscenario’s:
- één basisscenario;
- maximaal twee automatisch voorgestelde alternatieven;
- ieder scenario daarna handmatig aanpasbaar.

Alternatieven mogen variëren op rente, aflossingsvorm en looptijd. Gebruik één rente per scenario; modelleer geen renteherziening.

Vergelijk minimaal eigen inleg, schuld/restschuld, cashflow, LTV, laagste DSCR, Debt Yield, NCW en IRR met dezelfde centrale engine.

Maak geen nieuw rekenmodel per scenario; voer dezelfde engine met andere inputs uit. Test alleen scenariogeneratie en vergelijking. Stop daarna.

## Prompt 09 — Marktscenario’s zwak / redelijk / uitstekend

Bouw drie object-/marktscenario’s:
- zwak;
- redelijk/basis;
- uitstekend.

Het basisscenario komt uit de normale invoer. Zwak en uitstekend worden automatisch afgeleid volgens uitsluitend de bandbreedtes die tegen die tijd in document 09 zijn vastgesteld.

Toon per scenario de relevante financiële uitkomsten en belangrijkste sterktes, zwaktes en risicofactoren. Geef geen automatisch koop-/niet-kopenadvies.

Als bandbreedtes nog niet zijn vastgesteld: bouw dit onderdeel nog niet en meld exact welke ontwerpbeslissingen ontbreken.

Gebruik dezelfde engine; gerichte scenariotests. Stop daarna.

## Prompt 10 — Break-evenanalyse

Voeg break-evenanalyse toe met alleen functioneel vastgestelde grenswaarden, waaronder waar beschikbaar:
- maximale aankoopprijs bij NCW = 0;
- break-even exit-BAR;
- maximaal verdraagbare huuruitval/leegstand;
- break-even occupancy.

Gebruik de bestaande engine iteratief/analytisch zonder alternatieve rendementslogica. Toon aannames en uitkomst begrijpelijk.

Test alleen de break-evenfuncties en relevante randgevallen. Stop daarna.

## Prompt 11 — Pro What-if en herfinanciering

Bouw de betaalde What-if-functie los van de hoofdscenario’s.

Ondersteun conform document 09:
- rente +/− wijziging;
- effect op cashflow, DSCR, NCW en IRR;
- vervroegd aflossen;
- herfinancieren;
- boeterente;
- afsluitkosten;
- handmatige invoer en eenvoudige gevoeligheidsbediening.

Dit is een scenarioactie, geen renteprognose door de tijd. Hergebruik dezelfde financierings- en rendementsengine. Respecteer bestaande Pro/paywallarchitectuur.

Gerichte tests; stop daarna.

## Prompt 12 — Intern beslisrapport uitbreiden

Breid het bestaande interne rapport uit met uitsluitend de inmiddels geïmplementeerde en vastgestelde beslissingsondersteuning:
- financieringsstructuur;
- LTV/DSCR/Debt Yield/ICR;
- limiterende financieringstoets;
- scenariovergelijkingen;
- break-even/gevoeligheden;
- risico’s en aannames.

Alle cijfers komen rechtstreeks uit dezelfde deterministische scenario-output als het dashboard. De rapportlaag mag niets financieel of fiscaal herberekenen.

Geen formeel bankrapport bouwen. Geen koop-/niet-kopenadvies genereren.

Test rapport-dataconsistentie alleen voor de nieuw toegevoegde onderdelen. Stop daarna.

## Gate

Een volgende prompt wordt pas uitgevoerd nadat de gebruiker de vorige implementatie heeft getest en expliciet heeft vrijgegeven.

Voorbeeld:
"Getest en akkoord, ga verder met Prompt 09."

AI Studio moet dan uitsluitend Prompt 09 uit dit document uitvoeren en daarna opnieuw stoppen.
