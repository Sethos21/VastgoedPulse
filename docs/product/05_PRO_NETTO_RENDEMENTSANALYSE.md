# VastgoedPulse — Pro netto rendementsanalyse

**Status:** Functionele basis vastgesteld  
**Datum:** 30 september 2026  
**Doel:** leidende functionele basis voor verdere formule-specificatie en implementatie in Google AI Studio.

## 1. Doel
Pro moet niet alleen bruto vastgoedrendement tonen, maar inzicht geven in wat een belegger na exploitatie, financiering en belasting overhoudt.

De module vergelijkt op gelijke object- en financieringsaannames:
1. **Privé / Box 3**
2. **BV**

De module geeft informatie en rekeninzichten en presenteert geen persoonlijk fiscaal advies.

## 2. Gemeenschappelijke invoer

### Aankoop en financiering
- koopsom;
- overdrachtsbelasting;
- notaris-/advieskosten;
- overige aankoopkosten;
- eigen vermogen;
- lening;
- rentepercentage;
- looptijd;
- aflossingsvorm;
- financierings-/afsluitkosten.

### Exploitatie
- jaarhuur;
- leegstand;
- jaarlijkse huurindexatie;
- beheer;
- onderhoud;
- verzekering;
- OZB/eigenaarslasten;
- overige exploitatiekosten;
- verwachte waardegroei;
- beleggingsduur;
- verkoopkosten.

Deze basisinvoer blijft gelijk voor Box 3 en BV, zodat de vergelijking uitlegbaar blijft.

## 3. Privé / Box 3

De calculator ondersteunt twee berekeningen:
- forfaitaire Box 3-berekening;
- werkelijk rendement volgens de geldende fiscale systematiek.

Relevante persoonlijke invoer, zoals ander Box 3-vermogen, schulden en fiscale partner, moet kunnen worden meegenomen wanneer dit de uitkomst beïnvloedt.

### Fiscale configuratie 2026
Op basis van de Belastingdienst zoals geraadpleegd op 30 september 2026:
- Box 3-tarief: **36%**;
- heffingsvrij vermogen: **€59.357 per persoon**;
- met fiscale partner gezamenlijk: **€118.714**;
- forfait beleggingen en andere bezittingen: **6,00%**;
- forfait schulden: **2,70% — voorlopig percentage**.

Bij werkelijk rendement moeten de geldende regels afzonderlijk worden gemodelleerd. Betaalde rente op een Box 3-schuld kan daarbij relevant zijn; reguliere vastgoedkosten zijn niet automatisch fiscaal aftrekbaar.

**Ontwerpregel:** percentages en fiscale parameters worden niet hard gecodeerd in formules, maar opgeslagen per belastingjaar.

## 4. BV-route

De BV-route toont minimaal:
1. resultaat vóór belasting;
2. belastbare winst;
3. vennootschapsbelasting;
4. resultaat na VPB dat in de BV achterblijft;
5. keuze: winst in BV laten of uitkeren;
6. bij uitkering: dividend/Box 2-laag;
7. netto beschikbaar privé.

### Fiscale configuratie 2026
- VPB: **19% t/m €200.000 belastbare winst**;
- VPB: **25,8% over het meerdere**;
- Box 2: **24,5% t/m €68.843 belastbaar Box 2-inkomen**;
- Box 2: **31% over het meerdere**;
- dividendbelasting/voorheffing: **15%**.

De 15% ingehouden dividendbelasting wordt in het model als voorheffing behandeld en niet als een extra belasting bovenop Box 2 wanneer verrekening van toepassing is.

## 5. Verkoop
Aan het einde van de beleggingsperiode verwerkt de analyse:
- verwachte verkoopprijs;
- verkoopkosten;
- resterende financiering;
- fiscale gevolgen van het verkoopresultaat per gekozen structuur;
- netto verkoopopbrengst;
- totale netto uitkomst over de volledige beleggingsperiode.

De exacte fiscale behandeling en formules worden vóór implementatie afzonderlijk gespecificeerd en getest.

## 6. Kernuitkomsten
Voor beide routes worden definities zoveel mogelijk gelijk gehouden:
- totale investering;
- eigen inleg;
- netto cashflow per jaar;
- cumulatieve netto cashflow;
- netto rendement op eigen vermogen;
- NCW;
- IRR;
- vastgoedwaarde per jaar;
- resterende schuld per jaar;
- opgebouwd eigen vermogen;
- netto verkoopopbrengst;
- totaal netto resultaat over de beleggingsperiode.

Voor BV aanvullend:
- netto resultaat dat in de BV achterblijft;
- netto beschikbaar privé na uitkering.

## 7. Presentatie

### Bovenaan
Compacte KPI-weergave van:
- eigen inleg;
- netto cashflow;
- netto rendement;
- NCW;
- IRR.

### Jaaroverzicht
Jaartabel met onder meer:
- huur;
- exploitatiekosten;
- financiering;
- belasting;
- netto cashflow;
- vastgoedwaarde;
- resterende lening;
- opgebouwd eigen vermogen.

### Visualisatie
Cashflowgrafiek over de gekozen beleggingsperiode, waarin de effecten van exploitatie, financiering, belasting en verkoop zichtbaar worden.

### Vergelijking
Zelfde object + dezelfde aannames naast elkaar:
**Box 3 versus BV**.

De applicatie geeft inzicht in verschillen maar doet geen uitspraak welke structuur voor de gebruiker fiscaal of juridisch de beste keuze is.

## 8. Free → Pro
Free behoudt de eenvoudige BAR/rendementsindicatie en eenvoudige calculator.

De actie **‘Bekijk netto rendement na belasting’** is een Pro-trigger. De gebruiker krijgt een zachte paywall: voldoende context om de waarde van de analyse te begrijpen, terwijl verdiepende resultaten zijn afgeschermd.

## 9. Nog uit te werken vóór bouw
Deze functionele basis is vastgesteld. Nog niet vastgesteld zijn:
- exacte formules per berekening;
- fiscale uitzonderingen en randgevallen;
- validatieregels;
- afrondingsregels;
- scenario-opslag;
- tests en referentiecases;
- jaarlijkse beheerprocedure voor fiscale parameters.

Google AI Studio mag deze onderdelen niet zelfstandig invullen. Ze worden eerst expliciet gespecificeerd en getest.
