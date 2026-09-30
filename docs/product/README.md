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
