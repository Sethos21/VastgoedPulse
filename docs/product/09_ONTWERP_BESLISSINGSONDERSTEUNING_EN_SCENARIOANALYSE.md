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
