import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory store for incoming scraped properties
let scrapedPropertiesStore: any[] = [];

// Helper normalization function for incoming Funda scraper data
function normalizeScrapedProperty(raw: any, index: number) {
  const price = Number(raw.price || raw.koopprijs || raw.vraagprijs || 0);
  const areaM2 = Number(raw.areaM2 || raw.oppervlakte || raw.woonoppervlakte || 100);
  const pricePerM2 = areaM2 > 0 ? Math.round(price / areaM2) : 0;
  
  // Estimate rent if not provided (typical market rent ~ 5.5% gross yield)
  const annualRent = Number(raw.annualRent || raw.jaarhuur || Math.round(price * 0.055));
  const barYield = price > 0 ? Number(((annualRent / price) * 100).toFixed(2)) : 5.5;
  const narYield = Number((barYield * 0.82).toFixed(2));

  // Clean status
  let status = 'Te Koop';
  const rawStatus = (raw.status || '').toLowerCase();
  if (rawStatus.includes('verkocht')) status = 'Verkocht';
  else if (rawStatus.includes('onder bod') || rawStatus.includes('voorbehoud')) status = 'Onder Bod';
  else if (rawStatus.includes('verhuurd')) status = 'Verhuurd';
  else if (rawStatus.includes('nieuw')) status = 'Nieuw in Aanbod';

  return {
    id: raw.id || `FUNDA-${Date.now()}-${index + 1}`,
    title: raw.title || raw.titel || `${raw.address || 'Object'}, ${raw.city || 'Nederland'}`,
    address: raw.address || raw.adres || 'Onbekend adres',
    city: raw.city || raw.stad || raw.plaats || 'Amsterdam',
    postalCode: raw.postalCode || raw.postcode || '1000 AA',
    district: raw.district || raw.wijk || raw.buurt || 'Centrum',
    type: raw.type || raw.soort || (areaM2 < 120 ? 'Appartement' : 'Woning'),
    price,
    areaM2,
    pricePerM2,
    annualRent,
    barYield,
    narYield,
    energyLabel: raw.energyLabel || raw.energielabel || 'A',
    constructionYear: Number(raw.constructionYear || raw.bouwjaar || 2015),
    status,
    lastUpdated: 'Zojuist geïmporteerd via Funda scraper',
    imageUrl: raw.imageUrl || raw.foto || raw.afbeelding || '',
    wozValue: Number(raw.wozValue || raw.woz || Math.round(price * 0.94)),
    cadastralCode: raw.cadastralCode || raw.kadaster || `FND-${Math.floor(1000 + Math.random() * 9000)}`,
    monthlyHoaFee: Number(raw.monthlyHoaFee || raw.vve || 0),
    projectedGrowth: Number(raw.projectedGrowth || 5.8),
    rooms: Number(raw.rooms || raw.kamers || 3),
    bedrooms: Number(raw.bedrooms || raw.slaapkamers || 2),
    fundaUrl: raw.fundaUrl || raw.url || raw.link || '',
    brokerName: raw.brokerName || raw.makelaar || 'NVM Makelaarskantoor',
    source: 'funda',
    coordinates: raw.coordinates || {
      lat: 52.3676 + (Math.random() - 0.5) * 0.1,
      lng: 4.9041 + (Math.random() - 0.5) * 0.1
    },
    features: Array.isArray(raw.features) ? raw.features : (raw.kenmerken || ['Geverifieerd via Funda scraper'])
  };
}

// Scraper Webhook Endpoint: receives JSON from Funda scraper
app.post('/api/webhook/funda', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    let items = Array.isArray(payload) ? payload : (payload.properties || payload.data || [payload]);

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Geen objecten gevonden in payload.' });
    }

    const normalized = items.map((item: any, idx: number) => normalizeScrapedProperty(item, idx));
    scrapedPropertiesStore = [...normalized, ...scrapedPropertiesStore].slice(0, 100);

    return res.status(200).json({
      success: true,
      count: normalized.length,
      message: `${normalized.length} objecten succesvol verwerkt vanuit Funda scraper.`,
      sample: normalized[0]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to fetch currently imported Funda properties
app.get('/api/webhook/funda', (_req: Request, res: Response) => {
  res.json({
    count: scrapedPropertiesStore.length,
    properties: scrapedPropertiesStore
  });
});

// Live Open Data Proxy: PDOK / BAG Locatieserver API (100% gratis officiële overheidsserver)
app.get('/api/pdok/bag', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  if (!query || query.trim().length < 3) {
    return res.status(400).json({ error: 'Minimaal 3 karakters vereist voor PDOK zoekopdracht' });
  }

  try {
    const pdokUrl = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(query)}&rows=5`;
    const pdokRes = await fetch(pdokUrl);
    if (!pdokRes.ok) {
      return res.status(502).json({ error: 'PDOK server gaf een fout terug' });
    }
    const data = await pdokRes.json();
    return res.json({
      success: true,
      docs: data?.response?.docs || []
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Download full repository ZIP archive directly
app.get('/api/git/download-zip', async (_req: Request, res: Response) => {
  try {
    const { execSync } = await import('child_process');
    const zipPath = '/tmp/vastgoedpulse-latest.zip';
    execSync(`git archive --format=zip -o ${zipPath} HEAD`);
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="vastgoedpulse-nl.zip"');
    
    const fileStream = fs.createReadStream(zipPath);
    fileStream.pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: 'Kon zip archief niet genereren: ' + err.message });
  }
});

// Push directly to user's GitHub repository
app.post('/api/git/push-github', async (req: Request, res: Response) => {
  const { repoUrl, token } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: 'GitHub repository URL is verplicht' });
  }

  try {
    const { execSync } = await import('child_process');
    let targetUrl = repoUrl.trim();
    if (targetUrl.startsWith('https://')) {
      targetUrl = targetUrl.replace('https://', '');
    }

    const authRemote = token 
      ? `https://${encodeURIComponent(token.trim())}@${targetUrl}`
      : `https://${targetUrl}`;

    execSync(`git remote remove origin || true`);
    execSync(`git remote add origin "${authRemote}"`);
    const output = execSync(`git push -u origin main --force`).toString();

    return res.json({
      success: true,
      message: 'Succesvol gepusht naar GitHub repository!',
      output
    });
  } catch (err: any) {
    return res.status(500).json({ 
      error: 'Pushen naar GitHub mislukt: ' + (err.stderr ? err.stderr.toString() : err.message)
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
