# VastgoedPulse — Implementatiespecificatie Pro Box 3-module

**Status:** BOUWRIJP / leidend voor implementatie  
**Repository:** Sethos21/VastgoedPulse  
**Branch:** main  
**Datum:** 30 september 2026  
**Doel:** eenduidige bouwinstructie voor Google AI Studio. Dit document consolideert de reeds vastgestelde product-, reken- en UX-besluiten. AI Studio mag deze regels implementeren, maar niet zelfstandig wijzigen of aanvullen met nieuwe fiscale/rekenkundige aannames.

## 1. Scope

Bouw uitsluitend de **Pro Box 3-module voor één vastgoedobject**.

In scope:
- geselecteerd VastgoedPulse-object als startpunt;
- aankoop, financiering en exploitatie;
- verduurzaming en achterstallig onderhoud;
- 10-jaars projectie;
- forfaitair Box 3-objectscenario;
- werkelijk-rendementroute;
- automatisch vergelijken van beide fiscale routes;
- netto cashflow;
- NCW;
- IRR;
- exit-BAR en gevoeligheidsanalyse;
- verkoop aan einde looptijd;
- transparante fiscale detailweergave;
- Pro/paywall-voorbereiding;
- compact nieuwsfeedblok als UI/datamodel, zonder fictieve live brondata.

Niet in scope:
- BV-berekening;
- vergelijking Box 3 versus BV;
- fiscale partner;
- banktegoeden of andere persoonlijke Box 3-bezittingen;
- andere persoonlijke schulden;
- definitieve persoonlijke belastingaangifte;
- aankoop gedurende belastingjaar/deeljaren;
- renteontwikkeling/refinancieringsprognose;
- automatische live juridische/fiscale nieuwsfeed indien geen echte officiële bron is gekoppeld.

De uitkomst heet consequent **Box 3-effect objectscenario** en niet “uw Box 3-belasting”.

## 2. Bestaande applicatie

De huidige app bevat `RoiCalculatorModal.tsx`. Gebruik de bestaande integratiepunten en visuele stijl waar nuttig, maar beschouw de huidige rekenlogica NIET als leidend.

De bestaande calculator bevat verouderde aannames zoals:
- 5-jaarsprojectie;
- generieke samengestelde waardegroei als verkoopwaarde;
- 3% standaard leegstand;
- één generieke renovationCost;
- financiering afgeleid uit eigen-inbrengpercentage.

Deze logica moet worden vervangen door de hieronder gespecificeerde engine.

Gebruik bestaande `Property`-velden waar betrouwbaar beschikbaar:
- price → koopsom;
- annualRent → kale jaarhuur;
- barYield → referentie BAR aankoop;
- wozValue/objectwaarde alleen als relevante startwaarde en duidelijk gelabeld;
- overige objectmetadata voor context.

Alle automatisch overgenomen waarden blijven controleerbaar/aanpasbaar in het scenario.

## 3. Leidende defaults referentiecase

### Aankoop
- koopsom: €1.000.000;
- overdrachtsbelasting testcase: 10,4% = €104.000;
- overige aankoopkosten: €15.000;
- achterstallig onderhoud bij aanvang: €25.000 uit eigen middelen;
- verduurzaming bij aanvang: €75.000;
- hoofdfinanciering: €600.000;
- aanvullende verduurzamingsfinanciering: €75.000;
- totale schuld: €675.000;
- rente beide leningen: 4,5%;
- beide leningen aflossingsvrij;
- jaarlijkse rente: €30.375;
- initiële eigen investering referentiecase: €544.000.

### Exploitatie
- kale jaarhuur jaar 1: €80.000;
- huurindexatie: 2,0% per jaar;
- extra verduurzamingshuur: €6.000 vanaf jaar 2;
- vanaf jaar 2 indexeert de dan geldende totale huur jaarlijks met 2,0%;
- exploitatiekosten: 15% van de totale kale huur;
- verwachte huuruitval: default 0%;
- analyseperiode: 10 jaar.

### Waardering
- fiscale/objectprojectiewaarde: start €1.000.000;
- standaard jaarlijkse ontwikkeling fiscale/objectwaarde: 2,0%, aanpasbaar;
- deze projectiewaarde is uitsluitend voor toekomstige Box 3-projectie;
- verkoop/eindwaarde bedrijfsmatig vastgoed: uitsluitend via exit-BAR;
- default exit-BAR = BAR bij aankoop;
- referentiecase exit-BAR: 8,0%;
- exit-rent = geannualiseerde kale huur van jaar 11;
- verkoopkosten: 2,0% van verkoopwaarde;
- resterende schuld bij verkoop referentiecase: €675.000.

## 4. Financiering

Standaard financieringsvorm is **aflossingsvrij**.

Hoofdfinanciering en eventuele verduurzamingsfinanciering zijn afzonderlijke leningen/scenarioblokken.

Per lening minimaal:
- hoofdsom;
- rentepercentage;
- aflossingsvorm;
- indien aflossing geactiveerd: looptijd en gewenste restschuld/benodigde parameters.

Regels:
- huidige ingevoerde rente blijft gedurende de gehele analyse gelijk;
- geen renteprognoses;
- aflossing verlaagt cashflow maar is geen exploitatiekostenpost;
- aflossing bouwt eigen vermogen op;
- restschuld wordt bij verkoop afgelost;
- verduurzamingsfinanciering staat standaard uit, tenzij gebruiker deze activeert; referentiecase activeert deze volledig.

## 5. Exploitatie

Per jaar:
1. bepaal contractuele/geprojecteerde kale huur;
2. verwerk eventuele structurele extra huur uit verduurzaming vanaf gekozen startjaar;
3. pas huurindexatie toe volgens het vastgestelde scenario;
4. bereken verwachte huuruitval als percentage van jaarlijkse huur;
5. effectieve huur = huur minus huuruitval;
6. exploitatiekosten = standaard 15% van de relevante huurgrondslag volgens golden testcase;
7. NOI vóór financiering;
8. rente;
9. eventuele aflossing afzonderlijk;
10. commerciële cashflow vóór Box 3;
11. Box 3-effect;
12. netto cashflow na Box 3.

Huuruitval:
- één veld **Verwachte huuruitval**;
- default 0%;
- verlaagt cashflow/effectieve huur;
- verlaagt niet automatisch de contractuele/geannualiseerde exit-rent;
- feitelijke leegstand bij verkoop is geen impliciete afleiding uit dit percentage.

## 6. Verduurzaming

Apart invoerblok:
- investeringsbedrag;
- uitvoeringsjaar;
- extra jaarlijkse huur;
- startjaar extra huur;
- optionele aanvullende financiering;
- rente;
- aflossingsparameters indien relevant;
- optionele directe waardecorrectie alleen wanneer aantoonbaar losstaand van huurimpact.

Voor bedrijfsmatig vastgoed is huurimpact leidend.

**Anti-dubbeltelling:** extra huur die via exit-BAR al de terminal value verhoogt mag niet nogmaals als directe waardeverhoging worden toegevoegd.

## 7. Achterstallig onderhoud

Apart invoerblok:
- investeringsbedrag;
- uitvoeringsjaar.

Default:
- eigen middelen;
- geen automatische huurverhoging;
- geen automatische waardeverhoging;
- geen automatische fiscale aftrek in Box 3.

Niet samenvoegen met standaard exploitatiekosten van 15%.

## 8. Box 3 — scope en peildatum

De module modelleert één object + rechtstreeks bijbehorende financiering.

Peildatum:
- eerste versie veronderstelt bezit op **1 januari**;
- geen aankoop gedurende het jaar;
- geen deeljaar/proratering.

Toon waar nodig dat de fiscale projectie uitgaat van bezit op 1 januari.

Fiscale parameters worden per belastingjaar configureerbaar/versioneerbaar opgeslagen. Zet ze niet verspreid hard-coded in componenten.

Referentieconfiguratie 2026:
- overige bezittingen: 6,00%;
- schulden: 2,70% voorlopig;
- schuldendrempel: €3.800;
- heffingsvrij vermogen objectscenario: €59.357;
- Box 3-tarief: 36%.

Een voorlopig percentage moet als zodanig kunnen worden gelabeld.

## 9. Forfaitaire Box 3-route — golden formule

Voor referentiecase/objectscenario:

1. `aftrekbareSchuld = max(0, objectSchuld - schuldendrempel)`
2. `forfaitairRendement = fiscaleObjectwaarde * forfaitOverigeBezittingen - aftrekbareSchuld * forfaitSchulden`
3. `rendementsgrondslag = fiscaleObjectwaarde - aftrekbareSchuld`
4. `belastbareGrondslag = max(0, rendementsgrondslag - heffingsvrijVermogen)`
5. `aandeel = rendementsgrondslag > 0 ? belastbareGrondslag / rendementsgrondslag : 0`
6. `box3Voordeel = forfaitairRendement * aandeel`
7. `box3EffectForfaitair = max(0, box3Voordeel * box3Tarief)`

Behoud intern volledige precisie.

## 10. Werkelijk rendement

Bereken daarnaast de werkelijk-rendementroute volgens de in de productspecificatie vastgelegde objectscenario-logica.

Voor verhuurd vastgoed minimaal:
- kale huur;
- fiscale beginwaarde;
- fiscale eindwaarde;
- relevante waardeverandering;
- werkelijk betaalde rente op de Box 3-objectschuld.

Reguliere vastgoedkosten zoals onderhoud worden niet automatisch fiscaal afgetrokken in deze route; ze blijven wel in de commerciële cashflow.

Verduurzamingsinvesteringen zijn niet automatisch aftrekbaar. Voorkom automatische fiscale correcties die niet expliciet zijn gespecificeerd.

## 11. Keuze forfaitair versus werkelijk

Altijd beide routes berekenen wanneer voldoende scenario-invoer aanwezig is.

Hoofdweergave:
- gebruik het **laagste toepasselijke Box 3-effect** binnen de gemodelleerde regels;
- vermeld expliciet welke methode is toegepast.

Detail:
- actie **Bekijk fiscale berekening**;
- toon forfaitaire uitkomst;
- toon werkelijk-rendementuitkomst;
- toon belangrijkste tussenstappen en parameters;
- leg kort uit waarom de uitkomsten verschillen.

Geen persoonlijk fiscaal advies formuleren.

## 12. Fiscale/objectwaarde versus verkoopwaarde

Deze twee concepten mogen nergens worden vermengd.

**Verwachte fiscale/objectwaarde**
- start vanuit relevante objectwaarde;
- standaard 2,0% jaarlijkse ontwikkeling;
- gebruiker kan percentage wijzigen;
- dient voor toekomstige Box 3-projectie.

**Verwachte verkoopwaarde**
- voor bedrijfsmatig vastgoed bepaald via exit-BAR;
- geen samengestelde 2%-waardegroei gebruiken voor de verkoopprijs.

## 13. Exit-BAR

Default:
- exit-BAR = BAR bij aankoop.

Gebruiker kan vrij aanpassen.

Hoofdberekening:
- gekozen exit-BAR bepaalt terminal value;
- `terminalValue = annualizedExitRent / (exitBar / 100)`.

Toon automatisch gevoeligheid:
- gekozen exit-BAR − 0,5 procentpunt;
- gekozen exit-BAR;
- gekozen exit-BAR + 0,5 procentpunt.

De gekozen waarde is het hoofdscenario; de andere twee zijn alleen sensitiviteit.

Referentiecase:
- jaar-10-huur circa €102.637;
- geannualiseerde jaar-11-huur circa €104.690;
- exit-BAR 8,0%;
- terminal value circa €1.308.626;
- verkoopkosten circa €26.173;
- restschuld €675.000;
- netto verkoopopbrengst vóór afzonderlijke fiscale verkoopcorrectie circa €607.454.

## 14. NCW en IRR

Bereken op basis van de volledige ongeronde cashflowreeks.

Referentiecase:
- initiële eigen investering: €544.000;
- IRR circa 7,02% per jaar;
- NCW bij 5,0% discontovoet circa +€90.040.

NCW-discontovoet moet als scenario-input/configuratie beschikbaar zijn en in referentiecase 5,0% bedragen.

Verkoopopbrengst wordt in de laatste periode aan de cashflow toegevoegd.

## 15. Presentatie en afronding

Intern:
- geen tussentijdse afronding;
- volledige beschikbare numerieke precisie;
- NCW/IRR op ongeronde cashflows.

UI:
- geldbedragen: hele euro's;
- reguliere percentages: standaard één decimaal;
- berekende rendements-KPI's zoals IRR: twee decimalen.

Tests:
- interne uitkomsten vergelijken met kleine floating-pointtolerantie;
- daarnaast afzonderlijk weergegeven hele-euro-uitkomsten testen.

## 16. UX-structuur

De module moet passen binnen de bestaande donkere VastgoedPulse-stijl en responsive blijven.

Aanbevolen informatiehiërarchie:
1. objectcontext;
2. aankoop & kosten;
3. financiering;
4. exploitatie & huuruitval;
5. verduurzaming;
6. achterstallig onderhoud;
7. fiscale/projectie-aannames;
8. exit-BAR/verkoop;
9. resultaten;
10. fiscale details.

Bovenaan resultaat minimaal:
- eigen inleg;
- netto cashflow;
- NCW;
- IRR;
- toegepast Box 3-effect/methode.

Jaaroverzicht minimaal:
- jaar;
- kale/geprojecteerde huur;
- huuruitval;
- exploitatiekosten;
- rente;
- aflossing indien aanwezig;
- cashflow vóór Box 3;
- fiscale/objectwaarde;
- forfaitair Box 3-effect;
- werkelijk Box 3-effect;
- toegepast Box 3-effect;
- netto cashflow;
- resterende schuld.

Maak lange details inklapbaar zodat de calculator bruikbaar blijft.

## 17. Free / Pro

De bestaande eenvoudige calculator kan conceptueel Free blijven.

De uitgebreide Box 3-analyse is Pro:
- CTA/paywall-context: **Bekijk netto rendement na belasting**;
- zachte paywall;
- geen trial verplicht;
- geen implementatie van een fictief betalingssysteem als dit nog niet bestaat.

Bouw entitlement/paywall logisch scheidbaar van de rekenengine.

## 18. Nieuwsfeedblok

Plaats op/naast de Box 3-pagina een compact blok voor relevante wijzigingen:
- Box 3;
- overdrachtsbelasting;
- relevante vastgoedbelasting;
- relevante huurwetgeving;
- verduurzamingssubsidies/-verplichtingen.

Per item datamodel:
- datum;
- titel;
- korte samenvatting;
- impactindicator;
- officiële bronlink;
- status: Voorstel / Aangenomen / Definitief-in-werking.

Alleen officiële/primaire bronnen zijn later toegestaan.

**Belangrijk:** als nog geen echte feed/API/backend is aangesloten, toon geen verzonnen “actuele” nieuwsitems. Bouw dan uitsluitend component + interface/datamodel + lege staat.

## 19. Architectuurvereisten

Plaats rekenlogica niet monolithisch in de React-modal.

Maak minimaal logisch gescheiden:
- types/inputmodel;
- fiscale configuratie per belastingjaar;
- pure financiële rekenfuncties;
- Box 3-rekenfuncties;
- projectie-engine;
- formattering uitsluitend in UI;
- tests/golden testcase.

Rekenfuncties moeten deterministisch en unit-testbaar zijn.

Vermijd businesslogica die uitsluitend via React state bestaat.

## 20. Validatie

Minimaal:
- bedragen niet negatief waar onmogelijk;
- percentages begrenzen op functioneel geldige ranges;
- exit-BAR > 0;
- analyseperiode > 0;
- huur en koopsom niet stilzwijgend gokken;
- geen deling door nul;
- schuld kan niet door UI-fouten negatieve restschuld veroorzaken;
- waarschuwing bij ontbrekende/geschatte fiscale objectwaarde;
- waarschuwing bij voorlopige fiscale parameters.

Fouten moeten begrijpelijk in de UI verschijnen; geen NaN/Infinity.

## 21. Golden testcase / acceptatie

Implementeer een geautomatiseerde referentietest voor de in dit document vastgelegde testcase.

Verwachte jaarlijkse presentatie-uitkomsten:

| Jaar | Kale huur | OpEx 15% | Rente | CF vóór Box 3 | Forfait Box 3 | Netto CF |
|---:|---:|---:|---:|---:|---:|---:|
|1|€80.000|€12.000|€30.375|€37.625|€12.354|€25.271|
|2|€87.600|€13.140|€30.375|€44.085|€12.869|€31.216|
|3|€89.352|€13.403|€30.375|€45.574|€13.384|€32.190|
|4|€91.139|€13.671|€30.375|€47.093|€13.902|€33.191|
|5|€92.962|€13.944|€30.375|€48.643|€14.423|€34.219|
|6|€94.821|€14.223|€30.375|€50.223|€14.949|€35.274|
|7|€96.717|€14.508|€30.375|€51.835|€15.479|€36.356|
|8|€98.652|€14.798|€30.375|€53.479|€16.014|€37.465|
|9|€100.625|€15.094|€30.375|€55.156|€16.556|€38.600|
|10|€102.637|€15.396|€30.375|€56.867|€17.104|€39.762|

Controleer daarnaast:
- terminal value circa €1.308.626;
- verkoopkosten circa €26.173;
- netto verkoopopbrengst circa €607.454;
- IRR circa 7,02%;
- NCW bij 5% circa +€90.040.

Golden tests gebruiken ongeronde enginewaarden met tolerantie; tabel hierboven is presentatieniveau.

## 22. Verboden interpretaties tijdens bouw

AI Studio mag NIET:
- fiscale partner/overig vermogen alsnog toevoegen;
- BV-module meebouwen;
- exitwaarde weer op generieke samengestelde waardegroei baseren;
- renteontwikkeling verzinnen;
- onderhoud als fiscale aftrekpost behandelen zonder expliciete regel;
- verduurzaming dubbel in terminal value tellen;
- actuele nieuwsitems simuleren alsof ze live zijn;
- NVM/RICS/Kadaster/CBS-integraties claimen die technisch niet aantoonbaar bestaan;
- golden testcase aanpassen om code groen te krijgen;
- bestaande vastgestelde rekenregels “verbeteren” zonder nieuw productbesluit.

Bij een onduidelijkheid: stop die specifieke interpretatie, noteer de vraag en behoud de bestaande vastgestelde regel.

## 23. Definition of Done

De fase is gereed wanneer:
- Box 3-module vanuit bestaand object kan worden geopend;
- objectdata correct voorgevuld en wijzigbaar zijn;
- alle vastgestelde scenario-invoer aanwezig is;
- 10-jaars engine werkt;
- forfaitair en werkelijk rendement afzonderlijk berekend worden;
- toegepaste laagste toepasselijke Box 3-route transparant is;
- fiscale/objectwaarde en exit-BAR-verkoopwaarde strikt gescheiden zijn;
- verduurzaming/onderhoud correct verwerkt zijn;
- financiering standaard aflossingsvrij werkt;
- exit-BAR-sensitiviteit werkt;
- NCW en IRR werken;
- euro/percentagepresentatie aan afrondingsregels voldoet;
- golden testcase slaagt;
- relevante unit tests slagen;
- bestaande app buiten deze module niet regressief breekt;
- nieuwsfeed geen fictieve live data bevat;
- code en types voldoende gescheiden zijn om later BV als aparte module toe te voegen.

## 24. Leidende bronvolgorde

Bij conflict geldt:
1. dit implementatiedocument;
2. `07_REFERENTIECASE_01_BOX3_BEDRIJFSPAND.md`;
3. latere scopecorrecties in `06_BOX3_INVOER_EN_VALIDATIE.md`;
4. `05_PRO_NETTO_RENDEMENTSANALYSE.md`;
5. bestaande calculatorcode.

Bestaande code is dus nooit leidend wanneer die botst met de vastgestelde productspecificatie.


## 25. UX-uitleg en dynamische rapportagetoelichting — vastgesteld na praktijktest

**Aanleiding:** praktijktest met Waalhaven Logistiek Distributiecentrum.

De rekenmodule toont professionele financiële en fiscale begrippen. Correcte cijfers alleen zijn onvoldoende: de gebruiker moet zowel tijdens invoer/analyse als in de uiteindelijke rapportage kunnen begrijpen wat een begrip betekent en hoe het concrete scenario tot de getoonde uitkomst leidt.

### 25.1 Twee uitleg-lagen

Implementeer dezelfde inhoudelijke uitleg op twee niveaus:

1. **Korte context in de applicatie**
   - gebruik een herkenbare info-knop/ⓘ bij financiële/fiscale KPI's, vaktermen en belangrijke scenarioaannames;
   - tooltip/popover in gewone Nederlandse taal;
   - kort genoeg om de workflow niet te onderbreken;
   - waar nuttig mag een verdere uitleg worden geopend.

2. **Uitgebreide toelichting in de rapportage**
   - voeg onderin iedere uitgebreide Box 3-rapportage een vaste sectie toe: **Toelichting op de berekening**;
   - deze toelichting is dynamisch opgebouwd uit het daadwerkelijk doorgerekende scenario;
   - uitleg combineert definitie, gebruikte aanname, concrete scenariowaarden, rekenverband en betekenis van de uitkomst;
   - bedragen en percentages moeten exact afkomstig zijn uit de deterministische rekenengine en mogen niet door generatieve AI opnieuw worden berekend.

### 25.2 Begrippen die minimaal uitleg krijgen

Minimaal:
- BAR;
- exit-BAR;
- jaarhuur voor verkoopwaardering / geannualiseerde jaar-11-huur;
- fiscale/objectwaarde;
- verwachte verkoopwaarde;
- netto verkoopopbrengst;
- restschuld;
- NCW;
- rendementseis/discontovoet;
- IRR;
- netto cashflow;
- forfaitair Box 3-effect;
- werkelijk rendement;
- toegepaste fiscale route;
- rendementsgrondslag en andere zichtbare fiscale tussenbegrippen;
- aflossing versus operationele kosten.

Deze lijst is minimum, geen maximum: ieder niet-vanzelfsprekend financieel/fiscaal begrip dat zichtbaar wordt, moet begrijpelijke context kunnen krijgen.

### 25.3 NCW-presentatie

Vervang waar mogelijk technische labels als **NCW Disconto (%)** door begrijpelijker taal:

**Rendementseis voor NCW (%)**

KPI:
**NCW (bij {rendementseis}% rendementseis)**

Korte uitleg:
De NCW rekent toekomstige netto kasstromen, inclusief netto verkoopopbrengst, terug naar hun waarde vandaag. Een positieve NCW betekent dat het scenario boven de gekozen rendementseis een positieve contante meerwaarde laat zien.

De rapportage moet dit vervolgens toepassen op het concrete scenario en benoemen:
- gekozen rendementseis;
- analyseperiode;
- initiële eigen investering;
- relevante toekomstige cashflows;
- netto verkoopopbrengst;
- berekende NCW;
- betekenis van positief, nul of negatief.

NCW is geen eindbedrag in jaar 10 en mag niet zo worden gepresenteerd.

### 25.4 Exit-BAR-presentatie

Bij het exit-BAR-veld:
- info-knop;
- toon bij voorkeur tevens de BAR bij aankoop als referentie;
- leg uit dat de default exit-BAR gelijk is aan BAR bij aankoop, tenzij gebruiker deze wijzigt;
- leg uit dat hogere exit-BAR een lagere verkoopwaarde geeft en lagere exit-BAR een hogere verkoopwaarde;
- benoem exit-BAR als scenarioaanname, niet als voorspelling.

De rapportage beschrijft de werkelijk gekozen exit-BAR, de gebruikte huur voor verkoopwaardering, de daaruit berekende verkoopwaarde, verkoopkosten, restschuld en netto verkoopopbrengst.

### 25.5 Jaarhuur voor verkoopwaardering

Gebruik in de primaire UI bij voorkeur:
**Jaarhuur voor verkoopwaardering**

In technische detailuitleg mag worden vermeld dat dit de geannualiseerde jaar-11-huur is.

Leg uit:
Dit is de verwachte structurele jaarhuur die geldt bij verkoop aan het einde van jaar 10 en die samen met de exit-BAR wordt gebruikt om de verkoopwaarde te bepalen.

### 25.6 Dynamische rapportagetekst

De rapportagesectie **Toelichting op de berekening** bevat minimaal afzonderlijke toelichtingen op:
1. aankoop en initiële eigen inleg;
2. financiering en eventuele aflossing;
3. huurontwikkeling, huuruitval en exploitatiecashflow;
4. verduurzaming en/of achterstallig onderhoud indien van toepassing;
5. Box 3-objectscenario en toegepaste fiscale methode;
6. fiscale/objectwaarde;
7. NCW en gekozen rendementseis;
8. IRR;
9. exit-BAR en verkoopwaardering;
10. verkoopkosten, restschuld en netto verkoopopbrengst;
11. belangrijkste scenarioaannames en beperkingen.

De tekst moet scenario-afhankelijk zijn: niet-relevante onderdelen worden niet kunstmatig beschreven.

### 25.7 Geen generatieve rekenlogica

De rapportage-uitleg mag template-/regelgestuurd of met AI worden geformuleerd, maar:
- alle cijfers komen uit de rekenengine;
- AI mag geen bedragen, percentages, jaren of fiscale uitkomsten opnieuw berekenen;
- AI mag geen ontbrekende waarden verzinnen;
- rapportage en dashboard moeten dezelfde onderliggende scenario-output gebruiken;
- bij ontbrekende waarden moet de tekst dit overslaan of expliciet als ontbrekend aangeven;
- generatieve formulering mag de betekenis van de berekening niet wijzigen.

### 25.8 Voorbeeld toepassing Waalhaven

Bij een scenario met bijvoorbeeld NCW +€493.123 bij 5,0% rendementseis moet de toelichting duidelijk maken dat dit geen eindbedrag in jaar 10 is, maar de positieve contante meerwaarde boven de gekozen rendementseis op basis van de volledige doorgerekende kasstroomreeks.

Bij een exit-BAR-scenario moet de toelichting concreet de gebruikte jaarhuur voor verkoopwaardering, exit-BAR, berekende verkoopwaarde, verkoopkosten, restschuld en netto verkoopopbrengst aan elkaar verbinden.

De genoemde Waalhaven-cijfers zijn illustratief voor de UX-eis en vervangen de golden testcase niet.

## 26. Aflossingstermijnen — uitbreiding

Wanneer aflossing wordt geactiveerd, bied snelle looptijdkeuzes:
- 10 jaar;
- 15 jaar;
- 20 jaar;
- 25 jaar;
- 30 jaar;
- Anders.

**Anders** maakt handmatige invoer mogelijk.

De productdefault voor financiering blijft aflossingsvrij. De looptijdkeuzes veranderen die default niet.

Aflossing blijft afzonderlijk zichtbaar van exploitatiekosten en verlaagt cashflow terwijl zij eigen vermogen opbouwt.

## 27. Aanvulling Definition of Done

Naast de eerdere eisen geldt nu ook:
- relevante financiële/fiscale begrippen hebben een korte info-uitleg in de UI;
- NCW wordt begrijpelijk als contante meerwaarde t.o.v. rendementseis uitgelegd en niet als eindwaarde;
- exit-BAR en jaarhuur voor verkoopwaardering zijn voorzien van context;
- aflossing ondersteunt 10/15/20/25/30 jaar en Anders;
- uitgebreide rapportage bevat onderaan **Toelichting op de berekening**;
- deze toelichting gebruikt de concrete scenario-output;
- rapportagecijfers komen uitsluitend uit dezelfde deterministische engine als het dashboard;
- geen generatieve herberekening of verzonnen waarden;
- toelichting past zich aan aan de daadwerkelijk gebruikte scenario-onderdelen.
