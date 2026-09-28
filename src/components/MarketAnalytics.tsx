import React, { useState } from 'react';
import { Property, PropertyType } from '../types/property';
import { energyLabelPremiums } from '../data/initialData';
import { TrendingUp, BarChart3, PieChart, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface MarketAnalyticsProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  // Scatter plot geometry
  const width = 560;
  const height = 260;
  const pad = { top: 20, right: 20, bottom: 35, left: 45 };

  // Scatter ranges: Price/m² (X: 2000 to 11000), Yield % (Y: 3.5 to 8.5)
  const minX = 2000;
  const maxX = 11000;
  const minY = 3.5;
  const maxY = 8.5;

  const getX = (priceM2: number) => {
    return pad.left + ((priceM2 - minX) / (maxX - minX)) * (width - pad.left - pad.right);
  };

  const getY = (yieldPct: number) => {
    return height - pad.bottom - ((yieldPct - minY) / (maxY - minY)) * (height - pad.top - pad.bottom);
  };

  const getTypeColor = (type: PropertyType) => {
    switch (type) {
      case 'Woning': return '#06b6d4'; // cyan
      case 'Appartement': return '#8b5cf6'; // violet
      case 'Kantoor': return '#f59e0b'; // amber
      case 'Logistiek': return '#10b981'; // emerald
      case 'Winkelruimte': return '#ec4899'; // pink
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Scatter Plot: Koopprijs/m² vs. BAR Rendement */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Scatter Matrix: Prijs / m² vs. BAR Rendement</span>
            </h4>
            <p className="text-xs text-slate-400">
              Identificeer ondergewaardeerde objecten met hoge yield en gunstige m² prijs
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Woning</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> App</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Kantoor</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Logistiek</span>
          </div>
        </div>

        {/* SVG Scatter Chart */}
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-60 select-none overflow-visible">
            {/* Grid lines */}
            {[4, 5, 6, 7, 8].map((yVal) => (
              <g key={yVal}>
                <line
                  x1={pad.left}
                  y1={getY(yVal)}
                  x2={width - pad.right}
                  y2={getY(yVal)}
                  stroke="rgba(51, 65, 85, 0.4)"
                  strokeDasharray="2 2"
                />
                <text
                  x={pad.left - 6}
                  y={getY(yVal) + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {yVal}%
                </text>
              </g>
            ))}

            {[3000, 5000, 7000, 9000].map((xVal) => (
              <g key={xVal}>
                <line
                  x1={getX(xVal)}
                  y1={pad.top}
                  x2={getX(xVal)}
                  y2={height - pad.bottom}
                  stroke="rgba(51, 65, 85, 0.3)"
                  strokeDasharray="2 2"
                />
                <text
                  x={getX(xVal)}
                  y={height - pad.bottom + 14}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  €{(xVal / 1000).toFixed(0)}k
                </text>
              </g>
            ))}

            {/* X-axis label */}
            <text
              x={(width + pad.left - pad.right) / 2}
              y={height - 2}
              textAnchor="middle"
              className="text-[10px] fill-slate-400 font-medium"
            >
              Koopprijs per m² (€)
            </text>

            {/* Y-axis label */}
            <text
              x={14}
              y={(height + pad.top - pad.bottom) / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${(height + pad.top - pad.bottom) / 2})`}
              className="text-[10px] fill-slate-400 font-medium"
            >
              BAR Yield (%)
            </text>

            {/* Scatter Dots */}
            {properties.map((p) => {
              const cx = getX(p.pricePerM2);
              const cy = getY(p.barYield);
              const isHovered = hoveredProperty?.id === p.id;
              const color = getTypeColor(p.type);

              return (
                <circle
                  key={p.id}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 4.5}
                  fill={color}
                  fillOpacity={isHovered ? 1 : 0.8}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredProperty(p)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  onClick={() => onSelectProperty(p)}
                />
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredProperty && (
            <div
              className="absolute pointer-events-none bg-slate-950/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs z-20 min-w-[180px]"
              style={{
                left: Math.min(Math.max(10, getX(hoveredProperty.pricePerM2) - 80), width - 190),
                top: Math.max(10, getY(hoveredProperty.barYield) - 60)
              }}
            >
              <div className="font-bold text-white truncate">{hoveredProperty.title}</div>
              <div className="text-[11px] text-slate-400">{hoveredProperty.city} · {hoveredProperty.type}</div>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800 font-mono text-[11px]">
                <span className="text-cyan-400">€{hoveredProperty.pricePerM2.toLocaleString('nl-NL')}/m²</span>
                <span className="text-emerald-400 font-bold">BAR {hoveredProperty.barYield.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Energielabel Prijskloof & Verduurzamings-ROI */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Energielabel Premie & Prijskloof (Paris Proof)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Verschil in transactiewaarde per m² ten opzichte van basislabel B
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
            +18.5% BENG Premie
          </span>
        </div>

        {/* Energy Label Breakdown Bars */}
        <div className="space-y-2 pt-1 text-xs">
          {energyLabelPremiums.map((item) => {
            const isPositive = item.premiumPercent >= 0;
            const barWidth = Math.min(100, Math.abs(item.premiumPercent) * 3);

            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-12 font-mono font-bold text-slate-200 shrink-0">
                  {item.label}
                </span>

                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.premiumPercent > 10 ? 'bg-emerald-400' :
                        item.premiumPercent > 0 ? 'bg-teal-400' :
                        item.premiumPercent === 0 ? 'bg-slate-500' : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.max(6, barWidth)}%` }}
                    />
                  </div>
                  <span className="w-24 text-right font-mono text-slate-300 tabular-nums text-[11px]">
                    €{item.avgM2.toLocaleString('nl-NL')}/m²
                  </span>
                </div>

                <span className={`w-16 text-right font-mono font-semibold tabular-nums text-[11px] ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isPositive ? `+${item.premiumPercent}%` : `${item.premiumPercent}%`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
