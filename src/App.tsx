import React, { useState, useEffect, useCallback } from 'react';
import { initialProperties, initialCities, initialRealtimeEvents } from './data/initialData';
import { Property, CityBenchmark, RealtimeEvent, HeatmapMode } from './types/property';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { KpiMetrics } from './components/KpiMetrics';
import { NetherlandsMap } from './components/NetherlandsMap';
import { PropertyTable } from './components/PropertyTable';
import { MarketAnalytics } from './components/MarketAnalytics';
import { TrendAnalysisModule } from './components/TrendAnalysisModule';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { PropertyDrawer } from './components/PropertyDrawer';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';
import { MarketAlertsModal } from './components/MarketAlertsModal';
import { FundaIntegrationModal } from './components/FundaIntegrationModal';
import { KadasterReportModal } from './components/KadasterReportModal';
import { GitExportModal } from './components/GitExportModal';
import { subscribeToProperties, saveScrapedPropertiesToFirestore } from './services/firestoreService';

let liveEventSequence = 10000;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overzicht');
  
  // Realtime simulation state
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [cities] = useState<CityBenchmark[]>(initialCities);
  const [events, setEvents] = useState<RealtimeEvent[]>(initialRealtimeEvents);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(4);

  // Selected filters & views
  const [selectedCity, setSelectedCity] = useState<CityBenchmark | null>(null);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('pricePerM2');

  // Modals & Drawers state
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<Property | null>(null);
  const [selectedPropertyIdsForComparison, setSelectedPropertyIdsForComparison] = useState<string[]>([
    'PROP-AMS-001',
    'PROP-ROT-002',
    'PROP-UTR-003'
  ]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState<boolean>(false);
  const [calculatorProperty, setCalculatorProperty] = useState<Property | null>(null);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState<boolean>(false);
  const [isFundaModalOpen, setIsFundaModalOpen] = useState<boolean>(false);
  const [isKadasterModalOpen, setIsKadasterModalOpen] = useState<boolean>(false);
  const [isGitModalOpen, setIsGitModalOpen] = useState<boolean>(false);
  const [kadasterProperty, setKadasterProperty] = useState<Property | null>(null);

  const handleOpenKadasterReport = useCallback((prop: Property) => {
    setKadasterProperty(prop);
    setIsKadasterModalOpen(true);
  }, []);

  // Realtime Firestore synchronization for properties
  useEffect(() => {
    const unsubscribe = subscribeToProperties((firestoreProps) => {
      if (firestoreProps && firestoreProps.length > 0) {
        setProperties(firestoreProps);
      }
    });
    return () => unsubscribe();
  }, []);

  // Ingest properties imported via Funda scraper
  const handleImportFundaProperties = useCallback((imported: Property[]) => {
    setProperties((prev) => {
      // Avoid duplicate IDs
      const newItems = imported.filter((item) => !prev.some((p) => p.id === item.id));
      return [...newItems, ...prev];
    });

    // Persist to Firebase Firestore
    saveScrapedPropertiesToFirestore(imported).catch(console.error);

    // Notify ticker
    liveEventSequence += 1;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const importEvent: RealtimeEvent = {
      id: `EVT-${Date.now()}-${liveEventSequence}`,
      timestamp: timeStr,
      type: 'NEW_LISTING',
      propertyId: imported[0]?.id || 'FUNDA-IMPORT',
      propertyTitle: `${imported.length} objecten geïmporteerd via Funda`,
      city: imported[0]?.city || 'Nederland',
      price: imported[0]?.price || 750000,
      yield: imported[0]?.barYield || 5.8,
      areaM2: imported[0]?.areaM2 || 120
    };
    setEvents((prev) => [importEvent, ...prev.slice(0, 19)]);
  }, []);

  // Poll server webhook endpoint for scraped properties sent via API
  useEffect(() => {
    const fetchScraped = async () => {
      try {
        const res = await fetch('/api/webhook/funda');
        if (res.ok) {
          const data = await res.json();
          if (data && data.properties && data.properties.length > 0) {
            handleImportFundaProperties(data.properties);
          }
        }
      } catch (e) {
        // Dev / client fallback
      }
    };

    fetchScraped();
    const interval = setInterval(fetchScraped, 10000);
    return () => clearInterval(interval);
  }, [handleImportFundaProperties]);

  // Toggle Property for Side-by-Side Comparison
  const handleToggleCompare = useCallback((property: Property) => {
    setSelectedPropertyIdsForComparison((prev) => {
      if (prev.includes(property.id)) {
        return prev.filter((id) => id !== property.id);
      } else {
        if (prev.length >= 4) {
          // Max 4 for side-by-side
          return [...prev.slice(1), property.id];
        }
        return [...prev, property.id];
      }
    });
  }, []);

  const handleRemoveCompare = useCallback((id: string) => {
    setSelectedPropertyIdsForComparison((prev) => prev.filter((item) => item !== id));
  }, []);

  const handleAddCompare = useCallback((property: Property) => {
    setSelectedPropertyIdsForComparison((prev) => {
      if (!prev.includes(property.id) && prev.length < 4) {
        return [...prev, property.id];
      }
      return prev;
    });
  }, []);

  // Simulate a live transaction event
  const simulateLiveEvent = useCallback(() => {
    const eventTypes: Array<'TRANSACTION' | 'PRICE_CHANGE' | 'NEW_LISTING' | 'OFFER_ACCEPTED'> = [
      'TRANSACTION', 'PRICE_CHANGE', 'NEW_LISTING', 'OFFER_ACCEPTED'
    ];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomProperty = properties[Math.floor(Math.random() * properties.length)];
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const priceDelta = randomType === 'PRICE_CHANGE' 
      ? (Math.random() > 0.5 ? 25000 : -35000)
      : (Math.random() > 0.5 ? 15000 : -10000);

    const newPrice = Math.max(250000, randomProperty.price + (randomType === 'PRICE_CHANGE' ? priceDelta : 0));

    liveEventSequence += 1;
    const newEvent: RealtimeEvent = {
      id: `EVT-${Date.now()}-${liveEventSequence}`,
      timestamp: timeStr,
      type: randomType,
      propertyId: randomProperty.id,
      propertyTitle: randomProperty.title,
      city: randomProperty.city,
      price: newPrice,
      priceDelta,
      yield: Number(((randomProperty.annualRent / newPrice) * 100).toFixed(2)),
      areaM2: randomProperty.areaM2
    };

    setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);

    // Update property price & status if matched
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === randomProperty.id) {
          return {
            ...p,
            price: newPrice,
            pricePerM2: Math.round(newPrice / p.areaM2),
            barYield: Number(((p.annualRent / newPrice) * 100).toFixed(2)),
            status: randomType === 'TRANSACTION' ? 'Verkocht' : randomType === 'OFFER_ACCEPTED' ? 'Onder Bod' : p.status,
            lastUpdated: 'Zojuist'
          };
        }
        return p;
      })
    );
  }, [properties]);

  // Realtime ticker streaming timer
  useEffect(() => {
    if (!isStreaming) return;

    const intervalTime = Math.max(1500, Math.floor(6000 / streamSpeed));
    const timer = setInterval(() => {
      simulateLiveEvent();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isStreaming, streamSpeed, simulateLiveEvent]);

  // Global KPIs calculated from active dataset
  const activeProperties = selectedCity 
    ? properties.filter((p) => p.city.toLowerCase() === selectedCity.name.toLowerCase())
    : properties;

  const avgPriceM2 = activeProperties.length > 0 
    ? activeProperties.reduce((acc, p) => acc + p.pricePerM2, 0) / activeProperties.length 
    : 5240;

  const avgYield = activeProperties.length > 0 
    ? activeProperties.reduce((acc, p) => acc + p.barYield, 0) / activeProperties.length 
    : 5.75;

  const totalVolume24h = properties.reduce((acc, p) => acc + p.price, 0) * 0.42;

  // Selected properties for side-by-side comparison modal
  const comparedPropertiesList = properties.filter((p) => selectedPropertyIdsForComparison.includes(p.id));

  // Export properties CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Titel', 'Stad', 'Wijk', 'Adres', 'Type', 'Prijs', 'Oppervlakte', 'PrijsPerM2', 'BAR', 'NAR', 'Label', 'Kamers', 'Bouwjaar', 'Status'];
    const rows = properties.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.city,
      `"${p.district}"`,
      `"${p.address}"`,
      p.type,
      p.price,
      p.areaM2,
      p.pricePerM2,
      p.barYield,
      p.narYield,
      p.energyLabel,
      p.rooms,
      p.constructionYear,
      p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VastgoedPulse_Portefeuille_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Clean Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        streamSpeed={streamSpeed}
        setStreamSpeed={setStreamSpeed}
        onSimulateTransaction={simulateLiveEvent}
        onExportCsv={handleExportCsv}
        onOpenCalculator={() => {
          setCalculatorProperty(null);
          setIsCalculatorModalOpen(true);
        }}
        onOpenAlerts={() => {
          setUnreadAlertsCount(0);
          setIsAlertsModalOpen(true);
        }}
        unreadAlertsCount={unreadAlertsCount}
        selectedCityName={selectedCity?.name}
        onResetCityFilter={() => setSelectedCity(null)}
        comparisonCount={selectedPropertyIdsForComparison.length}
        onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
        onOpenFundaModal={() => setIsFundaModalOpen(true)}
        onOpenGitModal={() => setIsGitModalOpen(true)}
      />

      {/* Realtime Live Ticker */}
      <LiveTicker
        events={events}
        isStreaming={isStreaming}
        onSelectEvent={(propertyId) => {
          const prop = properties.find((p) => p.id === propertyId);
          if (prop) setSelectedPropertyForDetails(prop);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* VIEW 1: Marktoverzicht (Default) */}
        {activeTab === 'overzicht' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* KPI Metrics Ribbon */}
            <KpiMetrics
              avgPriceM2={avgPriceM2}
              avgYield={avgYield}
              totalVolume24h={totalVolume24h}
              totalDeals24h={34}
              avgDaysToSell={23}
              overbidPercent={6.7}
              greenLabelPercent={74}
              selectedCityName={selectedCity?.name}
            />

            {/* Interactive Vector Map with City Selection */}
            <NetherlandsMap
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              heatmapMode={heatmapMode}
              setHeatmapMode={setHeatmapMode}
            />

            {/* Yield vs Price Scatter Matrix & Paris Proof ESG */}
            <MarketAnalytics
              properties={properties}
              onSelectProperty={setSelectedPropertyForDetails}
            />

            {/* Filterable Property Table */}
            <PropertyTable
              properties={properties}
              selectedPropertyIdsForComparison={selectedPropertyIdsForComparison}
              onToggleCompare={handleToggleCompare}
              onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
              onSelectPropertyForDetails={setSelectedPropertyForDetails}
              onOpenKadasterReport={handleOpenKadasterReport}
              selectedCityName={selectedCity?.name}
            />
          </div>
        )}

        {/* VIEW 2: Trendanalyse & Historische Verkoopdata Module */}
        {activeTab === 'trends' && (
          <div className="animate-in fade-in duration-150">
            <TrendAnalysisModule />
          </div>
        )}

        {/* VIEW 3: Dedicated Interactive Kaart & Heatmap */}
        {activeTab === 'kaart' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Nationale Vastgoed Heatmap & Regio-Intelligentie
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verken regionale verschillen in vierkante meter prijzen, bruto aanvangsrendementen en energielabels.
              </p>
            </div>

            <NetherlandsMap
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              heatmapMode={heatmapMode}
              setHeatmapMode={setHeatmapMode}
            />

            {/* Properties filtered by the map selection */}
            <PropertyTable
              properties={properties}
              selectedPropertyIdsForComparison={selectedPropertyIdsForComparison}
              onToggleCompare={handleToggleCompare}
              onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
              onSelectPropertyForDetails={setSelectedPropertyForDetails}
              onOpenKadasterReport={handleOpenKadasterReport}
              selectedCityName={selectedCity?.name}
            />
          </div>
        )}

        {/* VIEW 4: Dedicated Objecten & Aanbod Grid */}
        {activeTab === 'objecten' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <PropertyTable
              properties={properties}
              selectedPropertyIdsForComparison={selectedPropertyIdsForComparison}
              onToggleCompare={handleToggleCompare}
              onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
              onSelectPropertyForDetails={setSelectedPropertyForDetails}
              onOpenKadasterReport={handleOpenKadasterReport}
              selectedCityName={selectedCity?.name}
            />
          </div>
        )}

      </main>

      {/* Side-by-Side Property Comparison Modal */}
      <PropertyComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedProperties={comparedPropertiesList}
        allProperties={properties}
        onRemoveProperty={handleRemoveCompare}
        onAddProperty={handleAddCompare}
        onSelectPropertyForDetails={setSelectedPropertyForDetails}
      />

      {/* Property Details Drawer */}
      <PropertyDrawer
        property={selectedPropertyForDetails}
        onClose={() => setSelectedPropertyForDetails(null)}
        isCompared={selectedPropertyForDetails ? selectedPropertyIdsForComparison.includes(selectedPropertyForDetails.id) : false}
        onToggleCompare={handleToggleCompare}
        onOpenKadasterReport={handleOpenKadasterReport}
        onOpenCalculatorWithProperty={(p) => {
          setSelectedPropertyForDetails(null);
          setCalculatorProperty(p);
          setIsCalculatorModalOpen(true);
        }}
      />

      {/* ROI & Cashflow Calculator Modal */}
      <RoiCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => {
          setIsCalculatorModalOpen(false);
          setCalculatorProperty(null);
        }}
        selectedProperty={calculatorProperty}
      />

      {/* Realtime Market Alerts Modal */}
      <MarketAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        onSelectPropertyForDetails={setSelectedPropertyForDetails}
        allProperties={properties}
      />

      {/* Funda Scraper REST API & Ingestion Modal */}
      <FundaIntegrationModal
        isOpen={isFundaModalOpen}
        onClose={() => setIsFundaModalOpen(false)}
        onImportProperties={handleImportFundaProperties}
      />

      {/* Kadaster Eigendoms- & Koopsommen Rapport Modal */}
      <KadasterReportModal
        isOpen={isKadasterModalOpen}
        onClose={() => {
          setIsKadasterModalOpen(false);
          setKadasterProperty(null);
        }}
        property={kadasterProperty}
      />

      {/* GitHub & Code Export Modal */}
      <GitExportModal
        isOpen={isGitModalOpen}
        onClose={() => setIsGitModalOpen(false)}
      />

      {/* Quiet, unpretentious footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>VastgoedPulse NL © {new Date().getFullYear()} · Realtime Vastgoed Intelligence & Portfolio Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>NVM · Kadaster · CBS Datakoppeling</span>
            <span>·</span>
            <span>RICS Taxatiestandaard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
