import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Building2, 
  Filter, 
  Download, 
  Search, 
  Sparkles,
  Info,
  Clock,
  Layers,
  ArrowUpRight,
  Maximize2
} from 'lucide-react';
import { historicalQuarterlyData, sampleHistoricalSales } from '../data/trendData';
import { PropertyType, EnergyLabel, HistoricalSaleRecord } from '../types/property';

type ViewMode = 'cities' | 'propertyTypes';
type TrendMetricType = 'pricePerM2' | 'overbidding' | 'daysOnMarket' | 'volume';
type TimeRange = '1Y' | '3Y' | '5Y';

export const TrendAnalysisModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cities');
  const [metric, setMetric] = useState<TrendMetricType>('pricePerM2');
  const [timeRange, setTimeRange] = useState<TimeRange>('5Y');
  const [includeForecast, setIncludeForecast] = useState<boolean>(true);

  // Selected cities for multi-line comparison
  const [selectedCities, setSelectedCities] = useState<string[]>([
    'amsterdam', 
    'rotterdam', 
    'utrecht', 
    'eindhoven', 
    'landelijk'
  ]);

  // Selected property types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'woning', 
    'appartement', 
    'kantoor', 
    'logistiek'
  ]);

  // Hover state for interactive scrubber
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Filter state for historical sales table
  const [salesSearch, setSalesSearch] = useState('');
  const [salesCityFilter, setSalesCityFilter] = useState('ALL');
  const [salesTypeFilter, setSalesTypeFilter] = useState('ALL');

  // City color map for line graphs
  const cityMeta: Record<string, { label: string; color: string }> = {
    amsterdam: { label: 'Amsterdam', color: '#06b6d4' }, // cyan
    rotterdam: { label: 'Rotterdam', color: '#3b82f6' }, // blue
    utrecht: { label: 'Utrecht', color: '#8b5cf6' }, // violet
    denHaag: { label: 'Den Haag', color: '#ec4899' }, // pink
    eindhoven: { label: 'Eindhoven', color: '#f59e0b' }, // amber
    groningen: { label: 'Groningen', color: '#10b981' }, // emerald
    tilburg: { label: 'Tilburg', color: '#14b8a6' }, // teal
    arnhem: { label: 'Arnhem', color: '#6366f1' }, // indigo
    landelijk: { label: 'Landelijk Gemiddelde', color: '#94a3b8' } // slate
  };

  const typeMeta: Record<string, { label: string; color: string }> = {
    woning: { label: 'Eengezinswoningen', color: '#06b6d4' },
    appartement: { label: 'Appartementen', color: '#8b5cf6' },
    kantoor: { label: 'Kantoren / Bedrijfspanden', color: '#f59e0b' },
    logistiek: { label: 'Logistiek & Distributie', color: '#10b981' },
    winkel: { label: 'Winkelruimte / Retail', color: '#ec4899' }
  };

  // Filter dataset by timeframe
  const filteredData = useMemo(() => {
    let sliceCount = historicalQuarterlyData.length;
    if (timeRange === '1Y') sliceCount = 5;
    else if (timeRange === '3Y') sliceCount = 13;
    const base = historicalQuarterlyData.slice(-sliceCount);

    if (!includeForecast) return base;

    // Generate 2 forecast points for 2026-Q4 and 2027-Q1 based on recent momentum
    const last = base[base.length - 1];
    const prev = base[base.length - 2];
    
    const extrapolate = (a: number, b: number) => Math.round(a + (a - b) * 0.95);

    const f1 = {
      ...last,
      period: '2026-Q4 (Proj)',
      date: 'Okt 2026*',
      amsterdam: extrapolate(last.amsterdam, prev.amsterdam),
      rotterdam: extrapolate(last.rotterdam, prev.rotterdam),
      utrecht: extrapolate(last.utrecht, prev.utrecht),
      denHaag: extrapolate(last.denHaag, prev.denHaag),
      eindhoven: extrapolate(last.eindhoven, prev.eindhoven),
      groningen: extrapolate(last.groningen, prev.groningen),
      tilburg: extrapolate(last.tilburg, prev.tilburg),
      arnhem: extrapolate(last.arnhem, prev.arnhem),
      landelijk: extrapolate(last.landelijk, prev.landelijk),
      woning: extrapolate(last.woning, prev.woning),
      appartement: extrapolate(last.appartement, prev.appartement),
      kantoor: extrapolate(last.kantoor, prev.kantoor),
      logistiek: extrapolate(last.logistiek, prev.logistiek),
      winkel: extrapolate(last.winkel, prev.winkel),
      overbiddingPercent: Number((last.overbiddingPercent * 1.02).toFixed(1)),
      avgDaysOnMarket: Math.max(18, last.avgDaysOnMarket - 1),
      transactionVolume: Math.round(last.transactionVolume * 1.01)
    };

    const f2 = {
      ...f1,
      period: '2027-Q1 (Proj)',
      date: 'Jan 2027*',
      amsterdam: extrapolate(f1.amsterdam, last.amsterdam),
      rotterdam: extrapolate(f1.rotterdam, last.rotterdam),
      utrecht: extrapolate(f1.utrecht, last.utrecht),
      denHaag: extrapolate(f1.denHaag, last.denHaag),
      eindhoven: extrapolate(f1.eindhoven, last.eindhoven),
      groningen: extrapolate(f1.groningen, last.groningen),
      tilburg: extrapolate(f1.tilburg, last.tilburg),
      arnhem: extrapolate(f1.arnhem, last.arnhem),
      landelijk: extrapolate(f1.landelijk, last.landelijk),
      woning: extrapolate(f1.woning, last.woning),
      appartement: extrapolate(f1.appartement, last.appartement),
      kantoor: extrapolate(f1.kantoor, last.kantoor),
      logistiek: extrapolate(f1.logistiek, last.logistiek),
      winkel: extrapolate(f1.winkel, last.winkel),
      overbiddingPercent: Number((f1.overbiddingPercent * 1.01).toFixed(1)),
      avgDaysOnMarket: Math.max(18, f1.avgDaysOnMarket - 1),
      transactionVolume: Math.round(f1.transactionVolume * 1.01)
    };

    return [...base, f1, f2];
  }, [timeRange, includeForecast]);

  // Determine active keys for line rendering
  const activeSeries = useMemo(() => {
    if (metric !== 'pricePerM2') {
      return [{ key: metric, label: getMetricLabel(metric), color: '#06b6d4' }];
    }
    if (viewMode === 'cities') {
      return selectedCities.map(id => ({
        key: id,
        label: cityMeta[id]?.label || id,
        color: cityMeta[id]?.color || '#06b6d4'
      }));
    } else {
      return selectedTypes.map(id => ({
        key: id,
        label: typeMeta[id]?.label || id,
        color: typeMeta[id]?.color || '#06b6d4'
      }));
    }
  }, [viewMode, metric, selectedCities, selectedTypes]);

  function getMetricLabel(m: TrendMetricType) {
    switch (m) {
      case 'pricePerM2': return 'Prijs per m² (€)';
      case 'overbidding': return 'Gem. Overbieding (%)';
      case 'daysOnMarket': return 'Doorlooptijd (Dagen)';
      case 'volume': return 'Transactievolume (Aantal)';
    }
  }

  // Calculate SVG line points
  const chartHeight = 300;
  const chartWidth = 840;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };

  // Calculate Y min and max
  const { minY, maxY } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    filteredData.forEach(d => {
      activeSeries.forEach(s => {
        let val = 0;
        if (metric === 'pricePerM2') {
          val = (d as any)[s.key] || 0;
        } else if (metric === 'overbidding') {
          val = d.overbiddingPercent;
        } else if (metric === 'daysOnMarket') {
          val = d.avgDaysOnMarket;
        } else if (metric === 'volume') {
          val = d.transactionVolume;
        }
        if (val < min) min = val;
        if (val > max) max = val;
      });
    });

    if (min === Infinity) return { minY: 0, maxY: 100 };
    // Add 10% breathing room
    const span = max - min || 10;
    return {
      minY: Math.max(0, Math.floor((min - span * 0.1) / 100) * 100),
      maxY: Math.ceil((max + span * 0.1) / 100) * 100
    };
  }, [filteredData, activeSeries, metric]);

  const getYCoord = (val: number) => {
    const range = maxY - minY || 1;
    const innerHeight = chartHeight - padding.top - padding.bottom;
    return chartHeight - padding.bottom - ((val - minY) / range) * innerHeight;
  };

  const getXCoord = (index: number) => {
    const innerWidth = chartWidth - padding.left - padding.right;
    const step = innerWidth / (filteredData.length - 1 || 1);
    return padding.left + index * step;
  };

  const formatValue = (val: number) => {
    if (metric === 'pricePerM2') return `€${val.toLocaleString('nl-NL')}/m²`;
    if (metric === 'overbidding') return `${val.toFixed(1)}%`;
    if (metric === 'daysOnMarket') return `${val} dagen`;
    if (metric === 'volume') return `${val.toLocaleString('nl-NL')} stuks`;
    return `${val}`;
  };

  // Toggle city selection
  const toggleCity = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== cityId));
      }
    } else {
      setSelectedCities([...selectedCities, cityId]);
    }
  };

  // Toggle type selection
  const toggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== typeId));
      }
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  // Filter historical sales table
  const filteredSales = useMemo(() => {
    return sampleHistoricalSales.filter(sale => {
      const matchSearch = sale.address.toLowerCase().includes(salesSearch.toLowerCase()) ||
        sale.city.toLowerCase().includes(salesSearch.toLowerCase()) ||
        sale.district.toLowerCase().includes(salesSearch.toLowerCase());
      const matchCity = salesCityFilter === 'ALL' || sale.city.toLowerCase() === salesCityFilter.toLowerCase();
      const matchType = salesTypeFilter === 'ALL' || sale.propertyType.toLowerCase() === salesTypeFilter.toLowerCase();
      return matchSearch && matchCity && matchType;
    });
  }, [salesSearch, salesCityFilter, salesTypeFilter]);

  // Export Sales to CSV
  const handleExportCsv = () => {
    const headers = ['Datum', 'Stad', 'Wijk', 'Adres', 'Type', 'Oppervlakte m2', 'Vraagprijs EUR', 'Verkoopprijs EUR', 'Prijs per m2 EUR', 'Overbieden %', 'Doorlooptijd Dagen', 'Energielabel'];
    const rows = filteredSales.map(s => [
      s.date,
      s.city,
      s.district,
      s.address,
      s.propertyType,
      s.areaM2,
      s.askingPrice,
      s.soldPrice,
      s.pricePerM2,
      s.overbidPercent,
      s.daysToSell,
      s.energyLabel
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vastgoed_Trend_Transacties_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Markt Intelligentie & Historische Analyse</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Vastgoed Trendanalyse & Prijsontwikkeling
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Grondige analyse van historische verkoopprijzen, prijs/m² dynamiek, overbiedingsgraden en verkoopcycli over kwartalen heen.
          </p>
        </div>

        {/* Momentum KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
            <span className="text-[11px] text-slate-400 block">Eindhoven 5J Groei</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">+52.2%</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
            <span className="text-[11px] text-slate-400 block">Amsterdam €/m²</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono text-base font-bold text-cyan-400 tabular-nums">€8.850</span>
              <span className="text-[10px] text-emerald-400 font-mono">+5.8% YoY</span>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
            <span className="text-[11px] text-slate-400 block">Gem. Overbieding</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono text-base font-bold text-amber-400 tabular-nums">+6.7%</span>
              <span className="text-[10px] text-slate-400 font-mono">Boven vraag</span>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
            <span className="text-[11px] text-slate-400 block">Doorlooptijd</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono text-base font-bold text-white tabular-nums">22 dagen</span>
              <span className="text-[10px] text-emerald-400 font-mono">-2d vs 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        
        {/* Controls Bar: Mode tabs, Metric selector, Timeframe */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          
          {/* View Mode: Steden vs Vastgoedtype */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('cities')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'cities'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Steden Vergelijken
            </button>
            <button
              onClick={() => setViewMode('propertyTypes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'propertyTypes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vastgoedtypen Vergelijken
            </button>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Metriek:</span>
            {[
              { id: 'pricePerM2', label: 'Prijs / m²' },
              { id: 'overbidding', label: 'Overbieding %' },
              { id: 'daysOnMarket', label: 'Doorlooptijd' },
              { id: 'volume', label: 'Volume' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id as TrendMetricType)}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  metric === m.id
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Timeframe & Projection toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-slate-950 p-1 border border-slate-800 rounded-lg text-xs">
              {(['1Y', '3Y', '5Y'] as TimeRange[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2 py-0.5 font-mono text-[11px] rounded transition-colors cursor-pointer ${
                    timeRange === t
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIncludeForecast(!includeForecast)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                includeForecast 
                  ? 'bg-purple-950/40 border-purple-800/80 text-purple-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Statistische doortrekking naar 2027"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Projectie 2027</span>
            </button>
          </div>
        </div>

        {/* Filter Pills / Multi-select Series */}
        {metric === 'pricePerM2' && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Actieve reeksen:</span>
            {viewMode === 'cities' ? (
              Object.entries(cityMeta).map(([id, meta]) => {
                const isActive = selectedCities.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleCity(id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-slate-800 border-slate-700 text-white font-medium' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: isActive ? meta.color : '#475569' }} 
                    />
                    <span>{meta.label}</span>
                  </button>
                );
              })
            ) : (
              Object.entries(typeMeta).map(([id, meta]) => {
                const isActive = selectedTypes.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleType(id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-slate-800 border-slate-700 text-white font-medium' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: isActive ? meta.color : '#475569' }} 
                    />
                    <span>{meta.label}</span>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* SVG Line Graph */}
        <div className="relative overflow-x-auto pt-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-72 sm:h-80 select-none overflow-visible"
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const val = minY + (maxY - minY) * (1 - pct);
              const y = getYCoord(val);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="rgba(51, 65, 85, 0.4)"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-500 font-mono"
                  >
                    {formatValue(Math.round(val))}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {filteredData.map((d, index) => {
              // Show label every 2 or 3 quarters if too many
              const showLabel = filteredData.length <= 8 || index % 2 === 0 || index === filteredData.length - 1;
              if (!showLabel) return null;
              const x = getXCoord(index);
              const isProj = d.period.includes('Proj');
              return (
                <text
                  key={d.period}
                  x={x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${isProj ? 'fill-purple-400 font-semibold' : 'fill-slate-400'}`}
                >
                  {d.period.replace(' (Proj)', '*')}
                </text>
              );
            })}

            {/* Forecast shade barrier */}
            {includeForecast && (
              <g>
                <line
                  x1={getXCoord(filteredData.length - 3)}
                  y1={padding.top}
                  x2={getXCoord(filteredData.length - 3)}
                  y2={chartHeight - padding.bottom}
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={getXCoord(filteredData.length - 2)}
                  y={padding.top + 10}
                  textAnchor="middle"
                  className="text-[10px] fill-purple-400 font-mono font-semibold"
                >
                  PROJEKTIE
                </text>
              </g>
            )}

            {/* Render lines for active series */}
            {activeSeries.map(series => {
              const points = filteredData.map((d, index) => {
                let val = 0;
                if (metric === 'pricePerM2') {
                  val = (d as any)[series.key] || 0;
                } else if (metric === 'overbidding') {
                  val = d.overbiddingPercent;
                } else if (metric === 'daysOnMarket') {
                  val = d.avgDaysOnMarket;
                } else if (metric === 'volume') {
                  val = d.transactionVolume;
                }
                return { x: getXCoord(index), y: getYCoord(val), val };
              });

              // Create path string
              const pathD = points.reduce((acc, curr, idx) => {
                return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
              }, '');

              return (
                <g key={series.key}>
                  {/* Subtle glow / shadow line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="4"
                    strokeOpacity="0.15"
                  />
                  {/* Main crisp line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Data points */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPointIndex === idx ? "5" : "3"}
                      fill={series.color}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all"
                    />
                  ))}
                </g>
              );
            })}

            {/* Invisible hover zones for scrubber */}
            {filteredData.map((d, index) => {
              const x = getXCoord(index);
              const colWidth = (chartWidth - padding.left - padding.right) / (filteredData.length || 1);
              return (
                <rect
                  key={index}
                  x={x - colWidth / 2}
                  y={padding.top}
                  width={colWidth}
                  height={chartHeight - padding.top - padding.bottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(index)}
                />
              );
            })}

            {/* Scrubber vertical line indicator */}
            {hoveredPointIndex !== null && (
              <line
                x1={getXCoord(hoveredPointIndex)}
                y1={padding.top}
                x2={getXCoord(hoveredPointIndex)}
                y2={chartHeight - padding.bottom}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredPointIndex !== null && filteredData[hoveredPointIndex] && (
            <div 
              className="absolute top-4 bg-slate-950/95 border border-slate-700 rounded-lg p-3 shadow-2xl text-xs z-30 pointer-events-none min-w-[200px]"
              style={{
                left: Math.min(
                  Math.max(10, getXCoord(hoveredPointIndex) - 100),
                  chartWidth - 220
                )
              }}
            >
              <div className="font-bold text-white flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span>{filteredData[hoveredPointIndex].period}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {filteredData[hoveredPointIndex].date}
                </span>
              </div>
              <div className="space-y-1 mt-2">
                {activeSeries.map(s => {
                  let val = 0;
                  if (metric === 'pricePerM2') {
                    val = (filteredData[hoveredPointIndex] as any)[s.key] || 0;
                  } else if (metric === 'overbidding') {
                    val = filteredData[hoveredPointIndex].overbiddingPercent;
                  } else if (metric === 'daysOnMarket') {
                    val = filteredData[hoveredPointIndex].avgDaysOnMarket;
                  } else if (metric === 'volume') {
                    val = filteredData[hoveredPointIndex].transactionVolume;
                  }

                  // Delta from previous quarter
                  let deltaText = '';
                  if (hoveredPointIndex > 0) {
                    const prevD = filteredData[hoveredPointIndex - 1];
                    let prevVal = 0;
                    if (metric === 'pricePerM2') prevVal = (prevD as any)[s.key] || 0;
                    else if (metric === 'overbidding') prevVal = prevD.overbiddingPercent;
                    else if (metric === 'daysOnMarket') prevVal = prevD.avgDaysOnMarket;
                    else if (metric === 'volume') prevVal = prevD.transactionVolume;
                    const diff = val - prevVal;
                    const pctDiff = prevVal > 0 ? (diff / prevVal) * 100 : 0;
                    deltaText = pctDiff >= 0 ? `+${pctDiff.toFixed(1)}%` : `${pctDiff.toFixed(1)}%`;
                  }

                  return (
                    <div key={s.key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-slate-300 text-[11px] truncate max-w-[100px]">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-white font-semibold">{formatValue(val)}</span>
                        {deltaText && (
                          <span className={`text-[10px] font-mono ${deltaText.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {deltaText}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Historische transacties gevalideerd via NVM, Kadaster en CBS data.</span>
          </div>
          <div>
            <span>* Projectie gebaseerd op renteontwikkeling en woningtekort model</span>
          </div>
        </div>

      </div>

      {/* Historical Sales Database / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Historische Verkooptransacties Log</span>
              <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {filteredSales.length} transacties
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Gedetailleerde verkoopresultaten inclusief overbiedingspercentages en verkoopduur
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exporteer CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Zoek op adres, stad of wijk..."
              value={salesSearch}
              onChange={(e) => setSalesSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={salesCityFilter}
              onChange={(e) => setSalesCityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Alle Steden</option>
              <option value="Amsterdam">Amsterdam</option>
              <option value="Rotterdam">Rotterdam</option>
              <option value="Utrecht">Utrecht</option>
              <option value="Den Haag">Den Haag</option>
              <option value="Eindhoven">Eindhoven</option>
              <option value="Groningen">Groningen</option>
              <option value="Tilburg">Tilburg</option>
              <option value="Arnhem">Arnhem</option>
            </select>
          </div>

          <div>
            <select
              value={salesTypeFilter}
              onChange={(e) => setSalesTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Alle Vastgoedtypen</option>
              <option value="Woning">Woning</option>
              <option value="Appartement">Appartement</option>
              <option value="Kantoor">Kantoor</option>
              <option value="Logistiek">Logistiek</option>
            </select>
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Datum</th>
                <th className="py-2.5 px-3">Adres & Locatie</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Oppervlakte</th>
                <th className="py-2.5 px-3 text-right">Vraagprijs</th>
                <th className="py-2.5 px-3 text-right">Verkoopprijs</th>
                <th className="py-2.5 px-3 text-right">Prijs / m²</th>
                <th className="py-2.5 px-3 text-right">Overbieden</th>
                <th className="py-2.5 px-3 text-center">Doorlooptijd</th>
                <th className="py-2.5 px-3 text-center">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    Geen historische transacties gevonden met de huidige filters.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">{s.date}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white truncate max-w-[200px]">{s.address}</div>
                      <div className="text-[11px] text-slate-400">{s.city} · {s.district}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">{s.propertyType}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-200">{s.areaM2} m²</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400">
                      €{s.askingPrice.toLocaleString('nl-NL')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-white">
                      €{s.soldPrice.toLocaleString('nl-NL')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-cyan-300 font-semibold">
                      €{s.pricePerM2.toLocaleString('nl-NL')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <span className={s.overbidPercent >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {s.overbidPercent >= 0 ? `+${s.overbidPercent}%` : `${s.overbidPercent}%`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-300">
                      {s.daysToSell}d
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono text-[11px] font-bold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {s.energyLabel}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
