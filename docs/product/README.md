# VastgoedPulse — Productdocumentatie

Deze map is het centrale productgeheugen voor de verdere ontwikkeling van VastgoedPulse.

## Doel
Hier worden productkeuzes en uitgewerkte ontwerpen vastgelegd voordat deze als bouwopdracht naar Google AI Studio gaan.

## Werkwijze
1. Idee of vraag bespreken.
2. Product- en gebruikerswaarde uitwerken.
3. Besluit expliciet vaststellen.
4. Vastgesteld besluit documenteren in deze map.
5. Technische impact op de bestaande applicatie bepalen.
6. Concrete bouwopdracht voor Google AI Studio opstellen.
7. Implementatie toetsen aan het vastgestelde ontwerp.

## Status van informatie
Documenten maken waar relevant onderscheid tussen:
- **Concept** — nog onderwerp van discussie.
- **Vastgesteld** — productbesluit dat leidend is voor implementatie.
- **Geïmplementeerd** — vastgesteld en aantoonbaar verwerkt in de applicatie.

## Geplande productdocumenten
- `01_PRODUCTVISIE_EN_DOELGROEP.md`
- `02_FREE_VERSUS_PRO.md`
- `03_KLANTREIS_EN_BETAALTRIGGERS.md`
- `04_MONETISATIE_EN_ABONNEMENTEN.md`

- `05_PRO_NETTO_RENDEMENTSANALYSE.md`

## Huidige status
- `02_FREE_VERSUS_PRO.md` — **Vastgesteld**: productladder Anoniem → Free → Pro, zachte Pro-paywall en startprijs €5 per maand.
- `05_PRO_NETTO_RENDEMENTSANALYSE.md` — **Functionele basis vastgesteld**: netto rendementsanalyse voor Privé/Box 3 en BV, inclusief fiscale configuratie 2026 en uitgangspunten voor NCW/IRR, cashflow en verkoop.
- `01_PRODUCTVISIE_EN_DOELGROEP.md`, `03_KLANTREIS_EN_BETAALTRIGGERS.md` en `04_MONETISATIE_EN_ABONNEMENTEN.md` worden inhoudelijk ingevuld zodra de betreffende keuzes volledig zijn vastgesteld.

## Implementatiegate
Vastgestelde productdocumentatie is leidend voor toekomstige bouwopdrachten. Voor de Pro-netto-rendementsanalyse moeten exacte formules, fiscale uitzonderingen, validatieregels en referentietests nog expliciet worden vastgesteld vóór implementatie; Google AI Studio mag deze logica niet zelfstandig invullen.


## Hervatpunt — 30 september 2026

De functionele basis voor VastgoedPulse Pro is vastgelegd. Bij hervatting **niet opnieuw ontwerpen** wat reeds als vastgesteld is gemarkeerd.

### Vastgesteld
- productladder: Anoniem = ontdekken → Free = volgen → Pro = analyseren;
- Pro startprijs €5 per maand, maandelijks;
- zachte paywall op natuurlijke Pro-momenten;
- Pro netto rendementsanalyse met Privé/Box 3 en BV;
- Box 3 ondersteunt forfaitair én werkelijk rendement;
- BV toont resultaat na VPB én, indien uitgekeerd, netto privé na Box 2/dividendvoorheffing;
- fiscale parameters worden per belastingjaar geconfigureerd en niet hard gecodeerd;
- persoonlijke Box 3-uitkomst vereist voldoende gegevens over de totale Box 3-positie; met alleen objectdata wordt uitsluitend een indicatief objectscenario getoond;
- kernuitkomsten omvatten cashflow, rendement op eigen vermogen, NCW, IRR, schuld, vermogensopbouw en verkoopresultaat;
- bedrijfsmatig vastgoed krijgt geen woningachtige waardegroei-aanname; huidige conservatieve productdefault is 2%, aanpasbaar, met 0%/2%/4%-scenario's;
- rendement wordt uitgesplitst naar exploitatie/cashflow, aflossing/vermogensopbouw en waardeverandering;
- voor bedrijfsmatig vastgoed wordt een exit-yield/BAR-benadering voorbereid als controle/alternatief voor de eindwaarde.

### Nog uit te werken vóór implementatie
1. referentietestcases voor Box 3 forfaitair en werkelijk;
2. exacte fiscale afrondingsregels;
3. fiscale-partnerverdeling;
4. tussentijdse aankoop/verkoop en waardemutaties;
5. eigen-gebruik-regels voor onroerend goed;
6. negatief werkelijk rendement;
7. BV-edge-cases, waaronder verliesverrekening en fiscale behandeling van verkoop;
8. exacte exit-yield/BAR-eindwaardeformule en invoer;
9. jaarlijkse beheerprocedure voor fiscale parameters;
10. pas daarna: definitieve Google AI Studio bouwspecificatie.

### Eerstvolgende stap bij hervatting
Start met concrete, handmatig controleerbare **referentietests** en toets de fiscale uitkomsten aan actuele primaire bronnen. Pas na succesvolle tests worden de formules vrijgegeven voor implementatie.
