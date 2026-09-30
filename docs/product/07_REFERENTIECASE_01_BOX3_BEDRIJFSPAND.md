# VastgoedPulse — Referentiecase 01 Box 3 bedrijfspand

**Status:** golden testcase v1  
**Datum:** 30 september 2026  
**Scope:** uitsluitend privé/Box 3. De BV-route wordt bewust in een aparte module uitgewerkt.

## 1. Doel
Deze case is de vaste controle voor de Pro-rekenmotor. Implementaties moeten bij gelijke invoer dezelfde tussenstappen en uitkomsten produceren, behoudens expliciet vastgelegde afronding.

VastgoedPulse simuleert in deze module bewust één object plus de rechtstreeks bijbehorende financiering. Geen fiscale partner en geen overige vermogensbestanddelen. De uitkomst heet daarom **Box 3-effect objectscenario** en niet persoonlijke/definitieve belastingaangifte.

## 2. Vaste invoer
### Aankoop
- Koopsom: €1.000.000 k.k.
- Overdrachtsbelasting testcase: 10,4% = €104.000
- Overige aankoopkosten: €15.000
- Achterstallig onderhoud bij aanvang: €25.000 uit eigen middelen
- Verduurzaming bij aanvang: €75.000
- Hoofdfinanciering: €600.000
- Financiering verduurzaming: €75.000
- Totale schuld: €675.000
- Rente beide leningen: 4,5%
- Aflossing: volledig aflossingsvrij
- Jaarlijkse rente: €30.375
- Initiële eigen inleg: **€544.000**

### Exploitatie
- Kale huur jaar 1: €80.000
- Huurindexatie: 2,0% per jaar
- Extra huur verduurzaming: €6.000 vanaf jaar 2
- Vanaf jaar 2 wordt de totale dan geldende huur jaarlijks met 2,0% geïndexeerd
- Exploitatiekosten: 15% van de totale kale huur
- Achterstallig onderhoud veroorzaakt geen huurverhoging
- Analyseperiode: 10 jaar

### Eindwaarde
- Primaire eindwaardemethode bedrijfspand: exit-BAR
- Exit-BAR: 8,0%
- Exit-huur: de geannualiseerde kale huur voor jaar 11
- Verkoopkosten: 2,0% van de berekende verkoopwaarde
- Restschuld bij verkoop: €675.000
- Waardegroei 0/2/4% is alleen gevoeligheids-/controle-informatie en bepaalt niet de primaire verkoopwaarde.

## 3. Box 3 testconfiguratie
Voor deze golden test wordt de 2026-systematiek als vaste testconfiguratie gebruikt:
- overige bezittingen: 6,00%
- schulden: 2,70% (2026 voorlopig)
- schuldendrempel: €3.800
- heffingsvrij vermogen: €59.357
- tarief Box 3: 36%

De productieapp moet fiscale parameters per belastingjaar configureren. De golden test bevriest 2026 uitsluitend om reproduceerbaar te kunnen testen.

### Projectiewaarde tijdens de 10 jaar
Voor de jaarlijkse indicatieve Box 3-projectie is een aparte fiscale/projectiewaarde nodig. In deze testcase wordt hiervoor een neutrale 2,0% jaarlijkse waardegroei gebruikt vanaf €1.000.000. Dit is **niet** de eindwaardemethode. De verkoopwaarde in jaar 10 blijft uitsluitend gebaseerd op exit-BAR.

## 4. Formules
### Exploitatie
- exploitatiekosten = 15% × kale huur
- operationeel resultaat vóór financiering = huur − exploitatiekosten
- rente = €675.000 × 4,5% = €30.375
- cashflow vóór Box 3 = huur − exploitatiekosten − rente

### Forfaitair Box 3-objectscenario
Per jaar:
1. aftrekbare schuld = €675.000 − €3.800 = €671.200
2. belastbaar rendement = fiscale objectwaarde × 6,00% − €671.200 × 2,70%
3. rendementsgrondslag = fiscale objectwaarde − €671.200
4. grondslag sparen en beleggen = max(0, rendementsgrondslag − €59.357)
5. aandeel = grondslag sparen en beleggen / rendementsgrondslag
6. voordeel Box 3 = belastbaar rendement × aandeel
7. Box 3-effect = voordeel Box 3 × 36%

### Werkelijk rendement
Voor de tegenbewijscontrole worden kale huur, relevante waardeverandering en betaalde Box 3-rente meegenomen. Reguliere exploitatie-/onderhoudskosten worden niet als fiscale aftrek verwerkt. De €75.000 verduurzaming wordt afzonderlijk bewaard; een fiscale waardecorrectie wordt alleen toegepast als aan de daarvoor geldende voorwaarden is voldaan. In deze golden case wordt geen automatische waardecorrectie toegekend.

De rekenmotor gebruikt nooit een hoger werkelijk-rendementseffect wanneer het forfaitaire effect lager is.

## 5. Verwachte jaaruitkomsten
Bedragen afgerond op hele euro voor presentatie; de rekenmotor rekent intern met ongeronde waarden.

| Jaar | Kale huur | Exploitatie 15% | Rente | CF vóór Box 3 | Forfaitair Box 3-effect | Netto CF |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | €80.000 | €12.000 | €30.375 | €37.625 | €12.354 | €25.271 |
| 2 | €87.600 | €13.140 | €30.375 | €44.085 | €12.869 | €31.216 |
| 3 | €89.352 | €13.403 | €30.375 | €45.574 | €13.384 | €32.190 |
| 4 | €91.139 | €13.671 | €30.375 | €47.093 | €13.902 | €33.191 |
| 5 | €92.962 | €13.944 | €30.375 | €48.643 | €14.423 | €34.219 |
| 6 | €94.821 | €14.223 | €30.375 | €50.223 | €14.949 | €35.274 |
| 7 | €96.717 | €14.508 | €30.375 | €51.835 | €15.479 | €36.356 |
| 8 | €98.652 | €14.798 | €30.375 | €53.479 | €16.014 | €37.465 |
| 9 | €100.625 | €15.094 | €30.375 | €55.156 | €16.556 | €38.600 |
| 10 | €102.637 | €15.396 | €30.375 | €56.867 | €17.104 | €39.762 |

In deze testcase is het berekende werkelijk rendement ieder jaar hoger dan het forfaitaire rendement; het forfaitaire Box 3-effect blijft daarom leidend.

## 6. Verkoop einde jaar 10
- Jaar 10 huur: circa €102.637
- Geannualiseerde jaar 11 huur: circa **€104.690**
- Eindwaarde bij 8,0% exit-BAR: **€1.308.626**
- Verkoopkosten 2%: circa **€26.173**
- Restschuld: **€675.000**
- Netto verkoopopbrengst vóór eventuele afzonderlijke fiscale verkoopcorrectie: **€607.454**

De exitwaarde bevat de structurele extra huur uit verduurzaming. Daarom wordt de €75.000 verduurzaming of een veronderstelde waardeverhoging niet nogmaals bij de eindwaarde opgeteld.

## 7. Rendementsuitkomsten golden test
Op basis van de bovenstaande kasstromen:
- initiële eigen inleg: **€544.000**
- IRR over 10 jaar inclusief verkoop: circa **7,02% per jaar**
- NCW bij 5,0% disconteringsvoet: circa **+€90.040**

Deze KPI's zijn scenario-uitkomsten, geen gegarandeerd rendement.

## 8. Belangrijke productregels
- Aflossingsvrij is standaard.
- Aflossing wordt alleen meegenomen wanneer de gebruiker dit zelf instelt.
- Verduurzaming en achterstallig onderhoud zijn aparte invoervelden.
- Achterstallig onderhoud leidt standaard niet tot extra huur.
- Verduurzaming kan extra huur én eigen financiering hebben.
- Exploitatiekosten blijven 15% van de totale huur in de eenvoudige standaardmodus.
- Exit-BAR is voor bedrijfsmatig vastgoed de primaire eindwaardemethode.
- Huurimpact van verduurzaming mag niet dubbel als losse waardeverhoging worden geteld.
- Box 3-resultaten worden als objectscenario gepresenteerd, niet als definitieve persoonlijke belastingaangifte.
- BV-berekeningen horen niet in deze module.

## 9. Implementatiegate
Google AI Studio mag de Box 3-rekenmotor pas als correct beschouwen wanneer minimaal deze referentiecase reproduceerbaar slaagt op:
- initiële eigen inleg;
- huurpad;
- exploitatiekosten;
- rentelast;
- jaarlijkse forfaitaire Box 3-berekening;
- werkelijk-rendementvergelijking;
- netto cashflow per jaar;
- exit-huur;
- exitwaarde;
- verkoopkosten;
- restschuld;
- netto verkoopopbrengst;
- IRR;
- NCW.

Afwijkingen door presentatieafronding zijn toegestaan; afwijkingen in de onderliggende formulelogica niet.


## 10. Aanvullende vastgestelde reken- en presentatieregels

### Rente
- De door de gebruiker ingevoerde/geldende rente blijft gedurende de volledige analyseperiode gelijk.
- VastgoedPulse modelleert geen toekomstige renteontwikkeling, renteherziening of rentecurve.
- Dit geldt ook wanneer de analyseperiode langer is dan een eventuele feitelijke rentevaste periode: de calculator is een scenarioanalyse op basis van de ingevoerde rente.

### Afronding
- Bedragen worden in de gebruikersinterface weergegeven in **hele euro's, zonder decimalen**.
- Percentage-invoer en rendementspercentages mogen hun functioneel benodigde precisie behouden; geldbedragen worden als hele bedragen gepresenteerd.
- De interne rekenmotor mag met hogere precisie rekenen om cumulatieve afrondingsfouten te voorkomen; afronding voor presentatie vindt plaats op het eind van een rekenstap/resultaatweergave.

### Nog af te tikken rekenkeuzes
De resterende functionele keuzes worden één voor één vastgesteld:
1. exit-BAR: invoer/default/aanpasbaarheid;
2. leegstand en huuruitval;
3. automatische vergelijking forfaitair versus werkelijk rendement;
4. technische afrondingsvolgorde voor golden tests.

Renteontwikkeling is hiermee afgesloten en wordt niet verder ontworpen.

## 11. Actuele nieuwsfeed op de Box 3-pagina

De Box 3-module krijgt een compacte, inhoudelijk gefilterde nieuwsfeed met uitsluitend ontwikkelingen die relevant kunnen zijn voor de berekening of vastgoedbelegger.

### Onderwerpen
- Box 3;
- overdrachtsbelasting;
- relevante vastgoedfiscaliteit;
- relevante verhuurwetgeving;
- verduurzamingsregelingen en wettelijke verduurzamingsverplichtingen;
- andere wettelijke/fiscale besluiten die rechtstreeks invloed kunnen hebben op de analyse.

### Bronbeleid
Voorkeur voor primaire/officiële bronnen, waaronder:
- Rijksoverheid;
- Belastingdienst;
- officiële wet- en regelgeving/parlementaire besluitvorming waar relevant.

Geen algemene vastgoednieuwsfeed en geen nieuws puur ter vulling van de pagina.

### Weergave per bericht
Minimaal:
- datum;
- korte titel;
- samenvatting in maximaal enkele regels;
- indicatie van mogelijke impact op de berekening;
- link naar de officiële bron;
- statuslabel waar toepasselijk, bijvoorbeeld **Voorstel**, **Aangenomen** of **Definitief / in werking**.

Een voorstel of beleidsvoornemen mag nooit als geldend recht worden gepresenteerd.

### Doel
De nieuwsfeed ondersteunt de betrouwbaarheid en actualiteit van VastgoedPulse: gebruikers kunnen zien welke recente besluiten of wijzigingen mogelijk invloed hebben op de aannames en fiscale parameters van hun vastgoedanalyse.


## 12. Definitief afgetikte rekenkeuzes

### 12.1 Exit-BAR
- Voor bedrijfsmatig vastgoed is exit-BAR de leidende eindwaardemethode.
- Default exit-BAR = BAR bij aankoop.
- De gebruiker kan de exit-BAR handmatig aanpassen.
- De gekozen exit-BAR bepaalt de hoofdcalculatie.
- VastgoedPulse toont automatisch een compacte gevoeligheidsanalyse op:
  - gekozen exit-BAR − 0,5 procentpunt;
  - gekozen exit-BAR;
  - gekozen exit-BAR + 0,5 procentpunt.
- De gevoeligheidsanalyse is informatief en creëert geen drie afzonderlijke hoofdscenario's.

### 12.2 Leegstand / huuruitval
- Invoer: één percentage **verwachte huuruitval**.
- Default: **0%**.
- Huuruitval verlaagt de effectieve jaarlijkse huurinkomsten en daarmee cashflow/rendement.
- Algemene verwachte huuruitval verlaagt niet automatisch de contractuele/geannualiseerde huur die voor de exit-BAR-waardering wordt gebruikt.
- Een veronderstelde feitelijke leegstand bij verkoop is een afzonderlijke situatie en mag niet impliciet uit het algemene huuruitvalpercentage worden afgeleid.

### 12.3 Forfaitair versus werkelijk rendement
- VastgoedPulse berekent beide methoden achter de schermen.
- De hoofdweergave gebruikt het laagste toepasselijke Box 3-effect volgens de gemodelleerde regels.
- De gebruikte methode wordt expliciet vermeld.
- Via **Bekijk fiscale berekening** kan de gebruiker beide uitkomsten en de relevante tussenstappen naast elkaar bekijken.
- De keuze van de rekenmotor wordt als rekenkundige/fiscale scenario-uitkomst gepresenteerd en niet als persoonlijk fiscaal advies.

### 12.4 Afronding en precisie
- De rekenmotor rondt tussentijds niet af.
- Alle tussenberekeningen gebruiken de beschikbare interne precisie.
- Geldbedragen worden uitsluitend voor presentatie afgerond op hele euro's, zonder decimalen.
- Reguliere ingevoerde/getoonde percentages worden standaard met één decimaal weergegeven, bijvoorbeeld 8,0%, 4,5% en 2,0%.
- Berekende rendements-KPI's waarbij extra precisie nuttig is, waaronder IRR, worden met twee decimalen weergegeven.
- Golden tests vergelijken ongeronde interne uitkomsten met een kleine technische tolerantie om floating-pointverschillen niet als functionele fout te behandelen.

Met deze besluiten zijn de eerder openstaande rekenkeuzes uit paragraaf 10 functioneel afgesloten.


## 13. Definitieve aannames peildatum en waardering

- Fiscale start/peildatum van deze eerste versie: **1 januari**; het object wordt geacht op die datum reeds in bezit te zijn.
- Geen modellering van aankoop gedurende het jaar of deeljaarberekeningen.
- Toekomstige fiscale/objectwaarde: standaard **2,0% jaarlijkse waardeontwikkeling**, door gebruiker aanpasbaar.
- Deze fiscale/projectiewaarde wordt alleen gebruikt voor de toekomstige Box 3-projectie.
- Verkoopwaarde/eindwaarde van bedrijfsmatig vastgoed blijft uitsluitend gebaseerd op de gekozen **exit-BAR**.
- De UI benoemt beide waarden afzonderlijk om vermenging te voorkomen.
