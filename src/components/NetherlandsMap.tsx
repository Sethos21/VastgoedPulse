import React, { useState } from 'react';
import { CityBenchmark, HeatmapMode } from '../types/property';
import { MapPin, Layers, Info, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface NetherlandsMapProps {
  cities: CityBenchmark[];
  selectedCity: CityBenchmark | null;
  onSelectCity: (city: CityBenchmark | null) => void;
  heatmapMode: HeatmapMode;
  setHeatmapMode: (mode: HeatmapMode) => void;
}

export const NetherlandsMap: React.FC<NetherlandsMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  heatmapMode,
  setHeatmapMode,
}) => {
  const [hoveredCity, setHoveredCity] = useState<CityBenchmark | null>(null);

  const getHeatmapColor = (city: CityBenchmark) => {
    if (heatmapMode === 'pricePerM2') {
      if (city.avgPricePerM2 >= 8000) return '#06b6d4'; // cyan high
      if (city.avgPricePerM2 >= 6000) return '#3b82f6'; // blue
      if (city.avgPricePerM2 >= 4500) return '#8b5cf6'; // violet
      return '#64748b'; // slate
    }
    if (heatmapMode === 'barYield') {
      if (city.avgBarYield >= 6.5) return '#10b981'; // emerald high
      if (city.avgBarYield >= 5.5) return '#f59e0b'; // amber
      return '#64748b';
    }
    if (heatmapMode === 'transactions') {
      if (city.transactionCount24h >= 30) return '#ec4899'; // pink high
      if (city.transactionCount24h >= 20) return '#3b82f6';
      return '#64748b';
    }
    if (heatmapMode === 'energyLabel') {
      if (city.greenLabelPercent >= 75) return '#10b981'; // emerald high
      if (city.greenLabelPercent >= 68) return '#14b8a6'; // teal
      return '#f59e0b';
    }
    return '#06b6d4';
  };

  const getMetricDisplay = (city: CityBenchmark) => {
    if (heatmapMode === 'pricePerM2') return `€${city.avgPricePerM2.toLocaleString('nl-NL')}/m²`;
    if (heatmapMode === 'barYield') return `BAR ${city.avgBarYield.toFixed(1)}%`;
    if (heatmapMode === 'transactions') return `${city.transactionCount24h} deals/24u`;
    if (heatmapMode === 'energyLabel') return `${city.greenLabelPercent}% A+ label`;
    return '';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      
      {/* Header & Heatmap Layers Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Geografische Kaart & Vastgoed Heatmap</span>
          </h3>
          <p className="text-xs text-slate-400">
            Klik op een stad om wijken en lokale vastgoedgegevens te ontdekken
          </p>
        </div>

        {/* Heatmap Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg text-xs">
          {[
            { id: 'pricePerM2', label: '€ / m² Prijs' },
            { id: 'barYield', label: 'BAR Rendement' },
            { id: 'transactions', label: '24u Activiteit' },
            { id: 'energyLabel', label: 'ESG / Label A+' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setHeatmapMode(mode.id as HeatmapMode)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                heatmapMode === mode.id
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & District Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Interactive SVG Vector Map of NL */}
        <div className="lg:col-span-7 relative flex items-center justify-center bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 min-h-[380px]">
          
          <svg
            viewBox="100 60 340 450"
            className="w-full h-80 sm:h-96 max-h-[440px] drop-shadow-md select-none"
          >
            {/* Background Stylized Netherlands Provinces Outline */}
            <path
              d="M 170,120 
                 C 200,90 270,80 340,90 
                 C 380,100 410,130 400,180 
                 C 390,220 370,250 380,310 
                 C 390,360 360,410 330,460 
                 C 300,500 270,520 260,490 
                 C 250,470 230,460 200,450 
                 C 160,440 130,430 140,400 
                 C 150,370 170,360 170,340 
                 C 160,320 140,310 150,280 
                 C 160,260 190,250 200,220 
                 C 210,190 190,170 160,160 
                 Z"
              fill="rgba(30, 41, 59, 0.45)"
              stroke="rgba(71, 85, 105, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* IJsselmeer inland water styling */}
            <path
              d="M 230,170 C 250,160 270,170 270,200 C 270,230 240,240 230,220 Z"
              fill="rgba(15, 23, 42, 0.9)"
              stroke="rgba(51, 65, 85, 0.6)"
              strokeWidth="1"
            />

            {/* City Hub Nodes */}
            {cities.map((city) => {
              const isSelected = selectedCity?.id === city.id;
              const isHovered = hoveredCity?.id === city.id;
              const color = getHeatmapColor(city);

              return (
                <g
                  key={city.id}
                  onClick={() => onSelectCity(isSelected ? null : city)}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className="cursor-pointer group"
                >
                  {/* Pulse ring for active or selected node */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="16"
                      fill={color}
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer circle */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isSelected ? "10" : "8"}
                    fill={color}
                    fillOpacity={isSelected ? "0.9" : "0.75"}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />

                  {/* Inner dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isSelected ? "4" : "3"}
                    fill="#ffffff"
                  />

                  {/* City Label Tag */}
                  <text
                    x={city.x}
                    y={city.y - 12}
                    textAnchor="middle"
                    className={`text-[11px] font-semibold transition-all ${
                      isSelected ? 'fill-cyan-300 font-bold' : 'fill-slate-200'
                    }`}
                  >
                    {city.name}
                  </text>
                  <text
                    x={city.x}
                    y={city.y + 20}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400 font-mono"
                  >
                    {getMetricDisplay(city)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick instructions / legend overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-md px-2.5 py-1 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Selecteer stad voor wijkuitsplitsing</span>
          </div>

          {selectedCity && (
            <button
              onClick={() => onSelectCity(null)}
              className="absolute top-3 right-3 text-xs text-slate-300 hover:text-white bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-md cursor-pointer transition-colors"
            >
              Kaartfilter wissen
            </button>
          )}
        </div>

        {/* District Breakdown & City Details Card */}
        <div className="lg:col-span-5 space-y-3">
          {selectedCity ? (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">
                    Geselecteerde Regio
                  </span>
                  <h4 className="text-base font-bold text-white tracking-tight">{selectedCity.name}</h4>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-white tabular-nums">
                    €{selectedCity.avgPricePerM2.toLocaleString('nl-NL')}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-mono">gem. per m²</span>
                </div>
              </div>

              {/* City KPI snapshot */}
              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="bg-slate-900/80 border border-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">BAR Rendement</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">{selectedCity.avgBarYield}%</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Jaargroei</span>
                  <span className="font-mono text-xs font-bold text-cyan-400">+{selectedCity.deltaYearPercent}%</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Label A+ Aandeel</span>
                  <span className="font-mono text-xs font-bold text-teal-400">{selectedCity.greenLabelPercent}%</span>
                </div>
              </div>

              {/* District listing */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Top Wijken & Buurten ({selectedCity.districts.length})
                </span>
                {selectedCity.districts.map((d, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800/60 text-xs hover:border-slate-700 transition-colors"
                  >
                    <span className="font-medium text-slate-200">{d.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white font-semibold">€{d.avgPriceM2.toLocaleString('nl-NL')}/m²</span>
                      <span className="text-[11px] text-emerald-400">+{d.growthPercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 text-center space-y-3">
              <Layers className="w-8 h-8 text-cyan-400 mx-auto" />
              <div>
                <h4 className="text-sm font-semibold text-white">Geen Stad Geselecteerd</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Klik op een knooppunt in de kaart zoals Amsterdam, Rotterdam of Eindhoven om lokale wijkprijzen te bekijken.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-400 block mb-2">Snelle regio-selectie:</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {cities.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onSelectCity(c)}
                      className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-md transition-colors cursor-pointer"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
