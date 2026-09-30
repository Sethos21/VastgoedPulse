# VastgoedPulse — Box 3 invoer, validatie en rekenvoorwaarden

**Status:** Vastgesteld als functionele rekenbasis  
**Datum:** 30 september 2026  
**Primaire bron:** Belastingdienst (regels 2026; fiscale parameters blijven versieerbaar per belastingjaar)

## 1. Doel
Deze specificatie bepaalt welke invoer de Pro-calculator nodig heeft om:
1. een vastgoedobject commercieel door te rekenen;
2. de forfaitaire Box 3-route te berekenen;
3. het werkelijke Box 3-rendement te berekenen;
4. beide fiscale routes volgens de geldende regels te vergelijken.

De calculator mag geen persoonlijke Box 3-belasting suggereren als daarvoor onvoldoende gegevens over het totale Box 3-vermogen zijn aangeleverd.

## 2. Invoerstrategie

Elk veld krijgt één van drie statussen:
- **Verplicht** — noodzakelijk voor de betreffende berekening.
- **Automatisch** — overnemen uit object-/financieringsdata indien betrouwbaar aanwezig; gebruiker kan controleren/aanpassen.
- **Conditioneel** — alleen vragen als de situatie dit vereist.

De UI vraagt niet opnieuw om gegevens die al betrouwbaar uit het object of de financiering bekend zijn.

## 3. Gemeenschappelijke gegevens

### Verplicht voor persoonlijke Box 3-berekening
- belastingjaar;
- fiscale partner: ja/nee;
- eigendomsaandeel gebruiker;
- relevante verdeling met fiscale partner waar de fiscale methode dit vereist;
- totale Box 3-banktegoeden op relevante peildatum;
- totale overige Box 3-bezittingen op relevante peildatum;
- totale Box 3-schulden op relevante peildatum.

### Automatisch indien bekend
- vastgoedwaarde/WOZ-waarde volgens de voor het belastingjaar geldende waarderingsregel;
- schuld behorend bij het object;
- kale huur;
- betaalde rente;
- aankoop-/verkoopmoment;
- eigendomsaandeel.

### Conditioneel
- overige inkomsten uit Box 3-vermogen;
- overige waardeveranderingen;
- tussentijdse aankopen/verkopen/mutaties;
- eigen gebruik van onroerend goed;
- dagen eigen gebruik;
- economische huurwaarde indien die methode voor eigen gebruik wordt gekozen;
- investeringen die volgens de fiscale regels de waardeverandering mogen corrigeren.

## 4. Forfaitaire Box 3-route

### Benodigd
Voor de forfaitaire methode zijn de bezittingen en schulden op **1 januari** van het belastingjaar bepalend.

Minimaal:
- banktegoeden 1 januari;
- overige bezittingen 1 januari, inclusief relevant vastgoed;
- schulden 1 januari;
- fiscale partner;
- fiscale parameters van het gekozen belastingjaar.

### 2026-configuratie
- banktegoeden: 1,28% — voorlopig;
- overige bezittingen: 6,00% — voorlopig;
- schulden: 2,70% — voorlopig;
- heffingsvrij vermogen: €59.357 per persoon;
- met fiscale partner: €118.714 gezamenlijk;
- Box 3-tarief: 36%.

De applicatie toont zichtbaar wanneer een percentage voorlopig is.

## 5. Werkelijk rendement

### Belangrijk uitgangspunt
Werkelijk rendement wordt berekend over het **totale relevante Box 3-vermogen**. Er geldt daarbij geen heffingsvrij vermogen.

### Verplicht
- werkelijk ontvangen inkomsten uit het Box 3-vermogen gedurende het jaar;
- begin- en eindwaarde van relevante bezittingen volgens de geldende fiscale waarderingsregels;
- werkelijk betaalde rente op Box 3-schulden;
- mutaties gedurende het jaar voor zover fiscaal relevant.

### Vastgoed
Voor verhuurd vastgoed:
- kale huur;
- fiscale beginwaarde;
- fiscale eindwaarde;
- werkelijk betaalde rente op de Box 3-schuld.

Reguliere kosten zoals onderhoud worden niet als aftrekpost in het werkelijk Box 3-rendement verwerkt. Ze blijven wél onderdeel van de commerciële vastgoedcashflow.

Vanaf 2026 moet eigen gebruik van een 2e woning of andere onroerende zaak conditioneel worden ondersteund. De fiscale engine moet daarvoor de dan geldende bijtellingsmethode gebruiken.

## 6. Validaties

### Blokkerend voor persoonlijke Box 3-uitkomst
Geen definitieve/persoonlijke Box 3-belasting tonen als één van deze gegevens ontbreekt:
- belastingjaar;
- fiscale-partnerstatus;
- totale relevante Box 3-bezittingen;
- totale relevante Box 3-schulden;
- benodigde waarden/inkomsten voor de gekozen werkelijk-rendementroute.

De vastgoedanalyse zelf blijft beschikbaar.

### Waarschuwing, niet blokkerend
- fiscale parameters voor het jaar zijn nog voorlopig;
- objectwaarde is geschat of niet uit een fiscale bron afkomstig;
- kale huur is afgeleid uit een bruto huurbedrag;
- betaalde rente is geschat vanuit rentepercentage in plaats van werkelijke jaarbetaling;
- gebruiker heeft alleen het object ingevuld en niet de rest van zijn Box 3-vermogen;
- object is gedurende het jaar gekocht/verkocht;
- sprake is van gedeeltelijk eigen gebruik;
- gegevens van fiscale partner zijn mogelijk onvolledig.

### Geen schijnprecisie
Als alleen objectdata bekend zijn, mag de applicatie een **objectscenario** tonen, maar niet labelen als 'uw Box 3-belasting'. Gebruik bijvoorbeeld:
**'Indicatief fiscaal effect van dit object — uw totale Box 3-positie is nog niet meegenomen.'**

## 7. Vergelijking forfaitair versus werkelijk

Alleen wanneer beide routes voldoende invoer hebben:
1. bereken forfaitaire fiscale uitkomst;
2. bereken werkelijk rendement volgens de geldende regels;
3. vergelijk volgens de wettelijke systematiek;
4. toon beide berekeningen transparant;
5. markeer welke uitkomst volgens de ingestelde fiscale regels wordt toegepast.

De UI moet uitleggen waarom de uitkomsten verschillen.

## 8. UX-volgorde

### Stap A — Object
Automatisch zoveel mogelijk vullen vanuit VastgoedPulse.

### Stap B — Financiering
Schuld en rente controleren/aanvullen.

### Stap C — Uw Box 3-situatie
Compact vragen:
- fiscale partner?
- overige banktegoeden?
- overige bezittingen?
- overige schulden?

### Stap D — Werkelijk rendement
Alleen aanvullende gegevens vragen die niet uit object/financiering volgen.

### Stap E — Resultaat
Toon:
- vastgoedcashflow;
- forfaitaire Box 3-uitkomst;
- werkelijke Box 3-uitkomst;
- toegepaste fiscale uitkomst;
- netto cashflow na belasting;
- waarschuwingen/datacompleetheid.

## 9. Implementatiegate
Google AI Studio mag:
- de vastgestelde velden en UX implementeren;
- berekeningen implementeren nadat de exacte formule-specificatie en referentietests zijn vastgesteld.

Google AI Studio mag niet:
- ontbrekende fiscale gegevens gokken;
- voorlopige percentages als definitief presenteren;
- eigen fiscale regels of aftrekposten verzinnen;
- objectscenario's presenteren als persoonlijke belastingberekening.

## 10. Nog te specificeren
- exacte fiscale afrondingsregels;
- behandeling van fiscale partners/verdeling in alle scenario's;
- tussentijdse aankoop/verkoop;
- eigen-gebruik-bijtelling 2026;
- verlies/negatief werkelijk rendement;
- referentietestcases tegen voorbeelden van de Belastingdienst;
- jaarlijkse updateprocedure fiscale configuratie.
