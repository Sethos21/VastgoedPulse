# 09 — Ontwerp: Beslissingsondersteuning en scenarioanalyse

**Status:** ontwerp/backlog — nog niet vastgesteld voor implementatie  
**Module:** Pro Box 3 Netto Rendementsanalyse  
**Doel:** de bestaande calculator doorontwikkelen van rekeninstrument naar transparant beslissingsinstrument, zonder bestaande bewezen rekenlogica opnieuw te ontwerpen.

## 1. Uitgangspunt

De huidige Pro Box 3-module bevat reeds de kern voor aankoop, financiering, exploitatie, Box 3, meerjarige projectie, exit-BAR, verkoopwaarde, NCW/IRR, sensitiviteit, uitleg en rapportage.

Dit document bevat mogelijke vervolgstappen. Het is **geen opdracht om deze onderdelen nu te implementeren**. Ieder onderdeel moet eerst functioneel/UX-matig worden uitgewerkt en vastgesteld.

## 2. Scenariovergelijking

Onderzoek een vergelijking van meerdere scenario's binnen dezelfde analyse, bijvoorbeeld:
- basis;
- positief;
- negatief.

Variabelen kunnen onder meer zijn:
- huurindexatie;
- huuruitval/leegstand;
- exploitatiekosten;
- rente;
- exit-BAR;
- relevante investeringen.

Doel: verschillen in onder meer NCW, IRR, cashflow en eindwaarde direct vergelijkbaar maken zonder drie losstaande analyses.

## 3. Break-evenanalyse

Onderzoek een dynamische break-evenanalyse waarmee zichtbaar wordt bij welke grenswaarde een gekozen rendementseis precies wordt gehaald.

Denk onder meer aan:
- maximale aankoopprijs bij NCW = 0;
- break-even exit-BAR;
- maximaal verdraagbare leegstand/huuruitval;
- eventueel andere dominante scenario-inputs.

Uitgangspunt: de bestaande centrale rekenengine blijft leidend. Geen parallelle rekenlogica.

## 4. Verdieping financieringsanalyse

Onderzoek aanvullende financierings-KPI's en ontwikkeling over de looptijd, waaronder:
- Loan-to-Value (LTV);
- schuldontwikkeling/restschuld per jaar;
- Debt Service Coverage Ratio (DSCR), indien passend bij de gekozen financieringsvorm;
- effect van aflossing op cashflow en eigen vermogen.

Alleen KPI's opnemen die voor de gebruiker praktisch interpreteerbaar zijn.

## 5. Rendement op eigen vermogen

Onderzoek aanvullende presentatie naast IRR:
- eigen vermogen/inleg;
- netto cashflow per jaar;
- cash-on-cash rendement per jaar;
- ontwikkeling van het eigen vermogensbeslag.

Doel: onderscheid tussen jaarlijks direct rendement en totaalrendement over de analyseperiode inzichtelijk maken.

## 6. Gevoeligheidsmatrix

Breid de huidige enkelvoudige sensitiviteit mogelijk uit naar een tweedimensionale matrix.

Eerste kandidaat:
- horizontale as: exit-BAR;
- verticale as: huurontwikkeling/indexatie;
- uitkomst per cel: NCW of IRR.

Doel: in één oogopslag tonen hoe gevoelig de businesscase is voor twee belangrijke aannames tegelijk.

## 7. Investeringsmomenten

Maak bij verdere uitwerking expliciet zichtbaar wanneer incidentele investeringen plaatsvinden, bijvoorbeeld:
- verduurzaming;
- achterstallig onderhoud;
- overige capex.

Onderzoek presentatie van het effect daarvan op:
- jaarlijkse cashflow;
- NCW;
- IRR;
- eventueel huur of waarde, uitsluitend wanneer daar een expliciete rekenrelatie voor is vastgesteld.

Geen automatische waarde- of huurverhoging veronderstellen zonder vastgestelde invoer/rekenregel.

## 8. Exploitatie versus exit

Onderzoek een uitsplitsing van de rendementsopbouw:
- rendement/waarde afkomstig uit operationele exploitatie;
- rendement/waarde afkomstig uit de verkoop/exit.

Doel: zichtbaar maken in welke mate de businesscase afhankelijk is van de eindwaarde en exit-aanname.

De methodiek voor deze uitsplitsing moet vóór implementatie eenduidig worden gedefinieerd.

## 9. Jaar-10 kasstroom transparanter

Onderzoek een expliciete opbouw in de laatste projectieperiode:

Netto operationele cashflow jaar 10  
+ netto verkoopopbrengst  
= totale kasstroom jaar 10

Dit is primair een transparantie-/controlefunctie. De bestaande NCW- en IRR-logica mag hierdoor niet dubbel rekenen.

## 10. Rekenkundige audit trail

Onderzoek een compacte, navolgbare rekenopbouw waarmee de gebruiker de hoofdketen kan controleren:

aankoop → eigen inleg → financiering → jaarlijkse netto cashflows → exit/verkoop → NCW/IRR.

Doel is controleerbaarheid, niet het dupliceren van de bestaande uitleglaag of het tonen van onnodige technische details.

## 11. Beslissingssamenvatting

Onderzoek een compacte samenvatting bovenaan rapport/dashboard met relevante beslisvariabelen, bijvoorbeeld:
- NCW bij gekozen rendementseis;
- IRR;
- cash-on-cash;
- exit-BAR;
- afhankelijkheid van verkoopopbrengst;
- financierings-KPI's;
- gevoeligheid voor belangrijke aannames.

VastgoedPulse geeft daarbij **geen automatisch koop-/niet-kopenadvies**. De software presenteert de relevante financiële informatie en scenario-effecten zodat de gebruiker zelf de investeringsbeslissing kan nemen.

## 12. Ontwerpprincipes

Voor alle onderdelen gelden:
1. bestaande bewezen rekenlogica niet dupliceren;
2. centrale deterministische scenario-output blijft de enige bron voor financiële waarden;
3. nieuwe analyses hergebruiken de bestaande engine waar mogelijk;
4. geen schijnnauwkeurigheid of voorspellingen presenteren als zekerheid;
5. scenarioaannames duidelijk onderscheiden van berekende resultaten;
6. eerst functioneel/UX-ontwerp vaststellen, daarna pas implementeren;
7. implementatie en tests delta-gebaseerd uitvoeren: geen onnodige heranalyse van bewezen functionaliteit.

## 13. Voorgestelde prioritering voor verdere uitwerking

Eerste ontwerpvolgorde:
1. scenariovergelijking;
2. break-evenanalyse;
3. exploitatie versus exit;
4. jaar-10 kasstroomtransparantie;
5. gevoeligheidsmatrix;
6. financieringsanalyse;
7. rendement op eigen vermogen;
8. audit trail en beslissingssamenvatting.

Deze volgorde is een ontwerpvoorstel en nog geen implementatieplanning.


## 14. Functioneel kader aankoop- en financieringsbeslissing

### 14.1 Primaire gebruiker
De primaire eindgebruiker is de **vastgoedbelegger die een object overweegt aan te kopen**.

### 14.2 Primair beslismoment
De functionaliteit ondersteunt in eerste instantie de **aankoopbeslissing**. De analyse moet de belegger in staat stellen de financiële kwaliteit en financierbaarheid van de voorgenomen aankoop te beoordelen.

### 14.3 Financieringsdoel
Naast de interne investeringsanalyse moet de onderbouwing bruikbaar zijn als basis voor een gesprek met **banken en vastgoedfinanciers**. De analyse moet daarom inzicht geven in zowel het rendement voor de belegger als de kwaliteit van het object en de kasstromen vanuit financieringsperspectief, waaronder voldoende waarde/onderpand en draagkracht van de financiering.

Dit betekent niet dat VastgoedPulse automatisch concludeert dat een financiering acceptabel is. De module levert een transparante, navolgbare financiële onderbouwing waarop belegger en financier hun eigen beoordeling kunnen baseren.

### 14.4 Rapportage — fase 1
De eerste rapportagevorm wordt een **intern beslisrapport voor de belegger**. Dit rapport brengt de relevante aannames, aankoop, financiering, exploitatie, rendement, risico's/scenario's en waarde/exit samen tot één navolgbare analyse.

Een formele, specifiek op banken/vastgoedfinanciers ingerichte financieringsrapportage is een mogelijke vervolgfase en wordt pas ontworpen nadat het interne beslisrapport functioneel is vastgesteld.

### 14.5 Nog uit te werken
De volgende ontwerpstap is het functioneel uitwerken van de financieringsanalyse, waaronder:
- één of meerdere financieringsscenario's per aankoop;
- financieringspercentage/LTV;
- rente, looptijd en aflossingsstructuur;
- schuldontwikkeling en restschuld;
- kasstroom na financieringslasten;
- DSCR en andere relevante financieringsratio's;
- waarde en onderpand in relatie tot de financiering;
- invloed van de financieringsstructuur op eigen inleg, cashflow, NCW en IRR.

Deze punten zijn ontwerpvragen en nog geen vastgestelde implementatie-eisen.


## 15. Concurrentie-inzichten en aanbodstrategie

### 15.1 Concurrentiebenchmark
De belangrijkste functionele benchmarks zijn:
- PropertyMetrics: professionele acquisitie-/underwritinganalyse met DCF, IRR/NPV, debt sizing, DSCR, debt yield, sensitiviteit en rapportage;
- ARGUS Enterprise: institutionele benchmark voor lease-by-lease cashflow, schuldmodellering en scenarioanalyse;
- Planon/Reasult: Nederlandse professionele vastgoedplanning en scenarioanalyse;
- Bloqhouse: investeerders-/kapitaalplatform met onboarding, proposities, betalingen en leningbeheer.

VastgoedPulse moet niet als Nederlandse ARGUS-kloon worden ontworpen. De gewenste positie is:
**professionele kernberekeningen + Nederlandse vastgoedcontext + actuele dealflow + eenvoudige UX + begrijpelijke uitleg.**

### 15.2 Nieuwe financierings-KPI's uit concurrentieonderzoek
Aan het financieringsontwerp toevoegen:
- **Debt Yield** als primaire financierings-KPI naast LTV en DSCR;
- **Break-even occupancy** als relevante risico-/break-evenmaatstaf;
- ICR blijft aanvullend en is niet primair bepalend voor maximale financiering.

Deze onderdelen worden functioneel verder uitgewerkt voordat ze implementatie-eisen worden.

### 15.3 Aanbodstrategie
VastgoedPulse moet niet volledig afhankelijk worden van één marktplaats of één dataprovider.

Te onderzoeken bronnen:
- Funda in Business;
- RealNext;
- makelaarsfeeds / XML-feeds;
- openbare objectbronnen;
- commerciële dataproviders;
- directe gebruikersinvoer;
- URL-import.

Doel is een brononafhankelijke objectlaag waarin data uit verschillende bronnen naar één intern objectmodel wordt genormaliseerd.

## 16. Handmatig object toevoegen via URL

Naast automatisch ingeladen aanbod moet de gebruiker een object handmatig kunnen toevoegen.

### 16.1 Primaire flow
1. gebruiker kiest **Object toevoegen**;
2. eerste invoerveld is een URL naar een online vastgoedadvertentie of publiek toegankelijke objectpagina;
3. VastgoedPulse probeert automatisch publiek beschikbare objectinformatie van die URL op te halen;
4. herkende gegevens worden vooraf ingevuld;
5. de gebruiker controleert en corrigeert deze gegevens;
6. ontbrekende velden worden handmatig aangevuld;
7. het object wordt opgeslagen als regulier analyse-object en kan vervolgens door de bestaande rekenmodules worden gebruikt.

### 16.2 Te herkennen gegevens
Waar beschikbaar:
- adres en plaats;
- vraagprijs;
- objecttype;
- oppervlakte;
- jaarhuur / huurprijs;
- gepubliceerd BAR;
- energielabel;
- bouwjaar;
- foto / bronverwijzing;
- makelaar;
- overige relevante advertentiegegevens.

### 16.3 Functionele regels
- bron-URL blijft aan het object gekoppeld;
- zichtbaar onderscheid tussen automatisch opgehaalde en handmatig ingevoerde data;
- ontbrekende data nooit gokken;
- alleen publiek toegankelijke informatie ophalen;
- gebruiker kan iedere automatisch opgehaalde waarde corrigeren;
- URL-import mag niet hard afhankelijk zijn van één website;
- volledig handmatige objectinvoer blijft later als fallback mogelijk;
- hergebruik zoveel mogelijk het bestaande centrale Property/objectmodel.

## 17. Vastgestelde financieringsscenario-richting

Voor één aankoop kunnen maximaal **drie financieringsscenario's** worden vergeleken.

### 17.1 Generatie
- gebruiker voert één basisscenario in;
- VastgoedPulse kan automatisch maximaal twee alternatieve scenario's genereren;
- automatisch gegenereerde scenario's blijven handmatig aanpasbaar.

### 17.2 Variabelen voor alternatieven
Automatische variatie mag primair plaatsvinden op:
- rente;
- aflossingsvorm;
- looptijd.

Ondersteunde aflossingsvormen:
- aflossingsvrij;
- lineair;
- annuïtair.

Geen renteherziening binnen één scenario; één gekozen rentepercentage geldt gedurende de volledige scenario-looptijd.

### 17.3 Maximale financiering
VastgoedPulse moet de maximaal haalbare financiering vanuit minimaal twee invalshoeken kunnen bepalen:
- onderpand-/waardetoets;
- kasstroomtoets.

De meest beperkende uitkomst moet expliciet zichtbaar zijn.

### 17.4 LTV-grondslag
- aankoopprijs en taxatiewaarde worden afzonderlijk opgeslagen;
- standaard LTV-grondslag = de laagste van aankoopprijs en taxatiewaarde;
- gebruiker kan deze grondslag handmatig overschrijven;
- financiering wordt in dit ontwerp uitsluitend gebaseerd op vastgoedwaarde, niet op overdrachtsbelasting of overige aankoopkosten.

### 17.5 Financieringsnormen
Per analyse instelbaar:
- maximale LTV;
- minimale DSCR;
- later ook Debt Yield-doel/norm indien functioneel vastgesteld.

DSCR:
- per jaar berekenen;
- laagste DSCR over de gehele looptijd expliciet tonen;
- laagste DSCR gebruiken als relevante stresstoets.

ICR:
- aanvullend kengetal;
- niet primair bepalend voor maximale financiering.

## 18. Marktscenario's voor investeringsrobustheid — vastgesteld voor Prompt 09

**Status:** functionele uitgangspunten vastgesteld; implementatie uitsluitend na vrijgave Prompt 09.

Drie scenario's: **zwak**, **redelijk (basis)** en **uitstekend**. Basis gebruikt exact de actuele invoer van de gebruiker. Zwak en uitstekend worden automatisch afgeleid van de basis; geen nieuwe fiscale of financiële rekenengine.

| Variabele | Zwak | Redelijk | Uitstekend |
|---|---|---|---|
| Huurindexatie (procent per jaar) | basis − 1 procentpunt | basis | basis + 1 procentpunt |
| Verwachte huuruitval | basis + 5 procentpunt | basis | basis − 2 procentpunt |
| Exit-BAR | basis + 0,5 procentpunt | basis | basis − 0,5 procentpunt |
| Exploitatiekosten | basis + 2 procentpunt | basis | basis − 2 procentpunt |

**Grenzen:** huuruitval begrenzen op 0–100%; huurindexatie mag negatief zijn; exit-BAR moet strikt positief blijven. Exploitatiekostenpercentage mag niet negatief worden; gebruik de bestaande invoervalidatie voor de bovengrens. Ongeldige scenario-uitkomsten niet stilzwijgend forceren: toon een begrijpelijke validatiemelding.

**Voorbeeld:** basis 2% huurindexatie, 0% huuruitval, 8% exit-BAR en 15% exploitatiekosten levert zwak 1% / 5% / 8,5% / 17%, redelijk 2% / 0% / 8% / 15%, uitstekend 3% / 0% / 7,5% / 13%.

**Ongewijzigd in alle scenario's:** aankoopprijs, financieringsstructuur/rente/aflossing, investeringen en uitvoeringstijdstippen, verduurzamingshuur, fiscale/objectwaardegroei, belastingparameters en overige basisinvoer. De drie scenario's vergelijken uitsluitend de vier vastgestelde marktvariabelen.

**Bediening:** automatisch gegenereerde scenario's; standaardbandbreedtes als vertrekpunt. De gebruiker mag de vier afwijkingen per analyse aanpassen. Aanpassing van de basis herberekent de scenario's met de op dat moment ingestelde afwijkingen. Het basisscenario zelf wordt niet gewijzigd door de vergelijking.

**Resultaten:** vergelijk relevante reeds beschikbare engine-uitkomsten zoals NCW, IRR, netto cashflow, exit-/verkoopwaarde en financieringsratio's indien beschikbaar. Toon de toegepaste afwijkingen naast de resultaten.

**Deterministische toelichting:** alleen signalen die direct uit bestaande uitkomsten volgen:
- NCW < 0: gekozen rendementseis wordt niet gehaald;
- IRR < ingestelde NCW-rendementseis: totaalrendement lager dan de eis;
- laagste DSCR < ingestelde minimale DSCR: financieringsdekking onder de gekozen norm;
- netto cashflow in enig jaar < 0: aanvullende liquiditeit in dat jaar nodig;
- afhankelijkheid van exit-BAR: toon de verschillen in verkoopwaarde en NCW tussen de drie scenario's, zonder een ongedocumenteerde risicodrempel te verzinnen.

Toon geen DSCR-signaal als DSCR of de norm niet beschikbaar is. Gebruik neutrale, feitelijke formuleringen voor sterktes, zwaktes en risico's; geef geen automatisch koop-/niet-kopenadvies. Geen AI-gegenereerde nieuwe cijfers.

## 19. Betaalde What-if- en herfinancieringsfunctie

De **What-if-functie** wordt gepositioneerd als betaalde functionaliteit.

Ondersteunde richtingen:
- rente verhogen/verlagen met x procentpunt;
- effect tonen op cashflow, DSCR, NCW en IRR;
- vervroegd aflossen;
- lening voortijdig aflossen en herfinancieren;
- boeterente invoeren;
- afsluitkosten invoeren.

Bediening:
- handmatige invoer;
- eenvoudige slider-achtige bediening voor snelle gevoeligheidsanalyse.

Doel is snel inzicht in het effect van één of enkele gewijzigde financieringsaannames, zonder de hoofdscenario's onnodig complex te maken.
