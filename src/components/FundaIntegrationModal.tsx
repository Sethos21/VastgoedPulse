import React, { useState } from 'react';
import { 
  X, 
  Code, 
  Terminal, 
  Copy, 
  Check, 
  Upload, 
  Database, 
  ExternalLink, 
  FileJson, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Property } from '../types/property';

interface FundaIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProperties: (importedProperties: Property[]) => void;
}

export const FundaIntegrationModal: React.FC<FundaIntegrationModalProps> = ({
  isOpen,
  onClose,
  onImportProperties,
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'code' | 'testImport'>('schema');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [pastedJson, setPastedJson] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://jouw-app-url';
  const webhookUrl = `${currentOrigin}/api/webhook/funda`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Example JSON schema for a single property
  const sampleJson = [
    {
      "title": "Prinsengracht 642 Luxe Dubbel Bovenhuis",
      "address": "Prinsengracht 642",
      "city": "Amsterdam",
      "postalCode": "1017 JH",
      "district": "Centrum / Grachtengordel",
      "type": "Appartement",
      "price": 1250000,
      "areaM2": 165,
      "rooms": 4,
      "bedrooms": 2,
      "constructionYear": 1890,
      "energyLabel": "A",
      "status": "Te Koop",
      "fundaUrl": "https://www.funda.nl/koop/amsterdam/appartement-prinsengracht-642",
      "brokerName": "Eefje Voogd Makelaardij",
      "imageUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "annualRent": 68000,
      "wozValue": 1180000,
      "cadastralCode": "ASD00-E-05112",
      "monthlyHoaFee": 240,
      "features": [
        "Rijksmonumentaal pand",
        "Dakterras op het zuiden",
        "Eigen grond"
      ]
    }
  ];

  // Python Scraper integration code
  const pythonSnippet = `import requests
import json

# URL van de VastgoedPulse Funda Webhook
API_URL = "${webhookUrl}"

# Jouw gescrapete data geformatteerd als een lijst van dicts
scraped_data = [
    {
        "title": "Keizersgracht 412",
        "address": "Keizersgracht 412",
        "city": "Amsterdam",
        "postalCode": "1016 EK",
        "district": "Centrum",
        "type": "Woning",                # Woning | Appartement | Kantoor | Logistiek
        "price": 950000,                  # Koopprijs in EUR
        "areaM2": 140,                    # Woonoppervlakte in m2
        "rooms": 5,                       # Aantal kamers
        "bedrooms": 3,                    # Aantal slaapkamers
        "constructionYear": 1920,
        "energyLabel": "A+",              # A++++ t/m G
        "status": "Te Koop",              # Te Koop | Onder Bod | Verkocht
        "fundaUrl": "https://www.funda.nl/koop/...",
        "brokerName": "Makelaarskantoor Beukelaar",
        "imageUrl": "https://...",        # Foto URL (optioneel)
        "annualRent": 52000,              # Optioneel (automatisch berekend indien leeg)
        "features": ["Tuin", "Parkeerplaats", "Eigen grond"]
    }
]

# Verstuur rechtstreeks naar het dashboard
response = requests.post(API_URL, json=scraped_data)

if response.status_code == 200:
    print(f"Succesvol geïmporteerd: {response.json().get('message')}")
else:
    print(f"Fout bij import: {response.text}")`;

  // cURL snippet
  const curlSnippet = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(sampleJson, null, 2)}'`;

  // Client-side parser for testing pasted JSON
  const handleTestImport = () => {
    try {
      if (!pastedJson.trim()) {
        setImportStatus({ success: false, message: 'Plak eerst JSON data in het tekstvak hierboven.' });
        return;
      }
      const parsed = JSON.parse(pastedJson);
      const items = Array.isArray(parsed) ? parsed : (parsed.properties || parsed.data || [parsed]);
      
      if (!items || items.length === 0) {
        setImportStatus({ success: false, message: 'Geen objecten gevonden in de JSON array.' });
        return;
      }

      const formatted: Property[] = items.map((raw: any, idx: number) => {
        const price = Number(raw.price || raw.koopprijs || raw.vraagprijs || 500000);
        const areaM2 = Number(raw.areaM2 || raw.oppervlakte || raw.woonoppervlakte || 100);
        const pricePerM2 = areaM2 > 0 ? Math.round(price / areaM2) : 5000;
        const annualRent = Number(raw.annualRent || raw.jaarhuur || Math.round(price * 0.055));
        const barYield = Number(((annualRent / price) * 100).toFixed(2));
        const narYield = Number((barYield * 0.82).toFixed(2));

        return {
          id: raw.id || `SCRAPED-${Date.now()}-${idx + 1}`,
          title: raw.title || raw.titel || `${raw.address || 'Object'}, ${raw.city || 'Nederland'}`,
          address: raw.address || raw.adres || 'Onbekend adres',
          city: raw.city || raw.stad || raw.plaats || 'Amsterdam',
          postalCode: raw.postalCode || raw.postcode || '1000 AA',
          district: raw.district || raw.wijk || 'Centrum',
          type: raw.type || 'Appartement',
          price,
          areaM2,
          pricePerM2,
          annualRent,
          barYield,
          narYield,
          energyLabel: raw.energyLabel || raw.energielabel || 'A',
          constructionYear: Number(raw.constructionYear || raw.bouwjaar || 2018),
          status: raw.status || 'Te Koop',
          lastUpdated: 'Zojuist geïmporteerd uit Funda scraper',
          imageUrl: raw.imageUrl || raw.foto || '',
          wozValue: Number(raw.wozValue || raw.woz || Math.round(price * 0.95)),
          cadastralCode: raw.cadastralCode || `FND-${Math.floor(1000 + Math.random() * 9000)}`,
          monthlyHoaFee: Number(raw.monthlyHoaFee || 0),
          projectedGrowth: 5.8,
          rooms: Number(raw.rooms || 3),
          bedrooms: Number(raw.bedrooms || 2),
          fundaUrl: raw.fundaUrl || raw.url || '',
          brokerName: raw.brokerName || raw.makelaar || 'Gescrapet Makelaarskantoor',
          source: 'funda',
          coordinates: { lat: 52.3676, lng: 4.9041 },
          features: Array.isArray(raw.features) ? raw.features : ['Geïmporteerd via Funda scraper']
        };
      });

      onImportProperties(formatted);
      setImportStatus({ 
        success: true, 
        message: `${formatted.length} objecten succesvol ingeladen in het dashboard!` 
      });
      setPastedJson('');
    } catch (err: any) {
      setImportStatus({ success: false, message: `JSON syntax fout: ${err.message}` });
    }
  };

  const handleLoadSample = () => {
    setPastedJson(JSON.stringify(sampleJson, null, 2));
    setImportStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-950/80 border border-orange-800/60 rounded-lg text-orange-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Funda Scraper Data Integratie</span>
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/80 border border-orange-800/80 px-2 py-0.5 rounded">
                  REST API & Ingestie
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Koppel jouw scraper aan dit dashboard om actuele makelaarsobjecten direct te visualiseren
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2">
          {[
            { id: 'schema', label: '1. Vereiste Datastructuur (JSON Schema)', icon: FileJson },
            { id: 'code', label: '2. Scraper Code & Webhook', icon: Code },
            { id: 'testImport', label: '3. Direct Testen (Plakken / Upload)', icon: Upload },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Datastructuur / Schema */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Overzicht van velden die het dashboard verwacht
                </h3>
                <p className="text-xs text-slate-400">
                  Zorg dat jouw Funda scraper de data output naar onderstaande JSON structuur. Het dashboard berekent automatisch ontbrekende waarden zoals prijs/m² en bruto rendement (BAR).
                </p>
              </div>

              {/* Fields Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Veldnaam</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Verplicht?</th>
                      <th className="py-2.5 px-3">Omschrijving & Voorbeeld</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400 font-bold">price</td>
                      <td className="py-2 px-3 text-purple-400">number</td>
                      <td className="py-2 px-3 text-emerald-400 font-sans font-semibold">Ja</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Koopprijs / Vraagprijs (bijv. <code>650000</code>). Ook <code>vraagprijs</code> wordt herkend.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400 font-bold">address</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-emerald-400 font-sans font-semibold">Ja</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Straat + huisnummer (bijv. <code>"Keizersgracht 412"</code>).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400 font-bold">city</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-emerald-400 font-sans font-semibold">Ja</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Plaatsnaam (bijv. <code>"Amsterdam"</code>, <code>"Rotterdam"</code>).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400 font-bold">areaM2</td>
                      <td className="py-2 px-3 text-purple-400">number</td>
                      <td className="py-2 px-3 text-emerald-400 font-sans font-semibold">Ja</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Woonoppervlakte of b.v.o. in $m^2$ (bijv. <code>128</code>).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">fundaUrl</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Aanbevolen</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Directe link naar de Funda pagina (opent in nieuw tabblad).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">brokerName</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Aanbevolen</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Naam van de verkopende makelaar (voor makelaarsmonitoring).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">type</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Optioneel</td>
                      <td className="py-2 px-3 font-sans text-slate-300"><code>"Woning"</code>, <code>"Appartement"</code>, <code>"Kantoor"</code>, <code>"Logistiek"</code>.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">rooms / bedrooms</td>
                      <td className="py-2 px-3 text-purple-400">number</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Optioneel</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Aantal kamers en slaapkamers (bijv. <code>rooms: 4, bedrooms: 2</code>).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">energyLabel</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Optioneel</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Energielabel (bijv. <code>"A+++"</code>, <code>"A"</code>, <code>"B"</code>). Standaard: A.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">status</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Optioneel</td>
                      <td className="py-2 px-3 font-sans text-slate-300"><code>"Te Koop"</code>, <code>"Onder Bod"</code>, <code>"Verkocht"</code>, <code>"Nieuw in Aanbod"</code>.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">imageUrl</td>
                      <td className="py-2 px-3 text-purple-400">string</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Optioneel</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Hoofdafbeelding van Funda (voor de fiches en de vergelijker).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400">features</td>
                      <td className="py-2 px-3 text-purple-400">string[]</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">Optioneel</td>
                      <td className="py-2 px-3 font-sans text-slate-300">Lijst van kenmerken (bijv. <code>["Balkon", "Lift", "Warmtepomp"]</code>).</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Example JSON payload */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    Voorbeeld JSON Payload (1 object of lijst)
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(sampleJson, null, 2), 'schema')}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedType === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'schema' ? 'Gekopieerd!' : 'Kopieer JSON'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 bg-slate-900/60 p-3 rounded border border-slate-800/60">
                  {JSON.stringify(sampleJson, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: Scraper Code Snippets & Webhook */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              {/* Webhook endpoint URL banner */}
              <div className="bg-slate-950 border border-orange-800/50 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                  Jouw Directe Webhook Endpoint
                </span>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono">
                  <span className="text-slate-200 select-all">{webhookUrl}</span>
                  <button
                    onClick={() => copyToClipboard(webhookUrl, 'url')}
                    className="text-cyan-400 hover:text-cyan-300 p-1 cursor-pointer"
                    title="Kopieer URL"
                  >
                    {copiedType === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ondersteunt <code>POST</code> requests met <code>application/json</code> (max 15MB).
                </p>
              </div>

              {/* Python Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span>Python Scraper Integratie (Copy-Paste)</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(pythonSnippet, 'python')}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedType === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'python' ? 'Gekopieerd!' : 'Kopieer Script'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-64">
                  {pythonSnippet}
                </pre>
              </div>

              {/* cURL Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span>cURL Test Commando</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(curlSnippet, 'curl')}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedType === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'curl' ? 'Gekopieerd!' : 'Kopieer cURL'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {curlSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Direct Testen (Plakken / Upload) */}
          {activeTab === 'testImport' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Test scraper data direct in de browser
                </h3>
                <p className="text-xs text-slate-400">
                  Plak hier de ruwe JSON output van jouw scraper. Zodra je op "Verwerk & Toevoegen aan Dashboard" klikt, worden de objecten direct ingeladen in de tabel, op de kaart en in de vergelijker!
                </p>
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={handleLoadSample}
                  className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Laad voorbeeld Funda object
                </button>
                <span className="text-slate-500 font-mono">Formaat: JSON array of object</span>
              </div>

              <textarea
                value={pastedJson}
                onChange={(e) => setPastedJson(e.target.value)}
                placeholder="Plak hier de JSON van jouw Funda scraper (bijv. [{ title: '...', price: 750000, ... }])"
                rows={10}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />

              {importStatus && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  importStatus.success
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                }`}>
                  {importStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleTestImport}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-950/50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Verwerk & Toevoegen aan Dashboard</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <span>Ondersteunt alle gangbare Funda scraper tools (BeautifulSoup, Scrapy, Puppeteer, Selenium)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>

      </div>
    </div>
  );
};
