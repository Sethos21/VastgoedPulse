import React from 'react';
import { TrendingUp, TrendingDown, Clock, Percent, ShieldCheck, Euro } from 'lucide-react';

interface KpiMetricsProps {
  avgPriceM2: number;
  avgYield: number;
  totalVolume24h: number;
  totalDeals24h: number;
  avgDaysToSell: number;
  overbidPercent: number;
  greenLabelPercent: number;
  selectedCityName?: string;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({
  avgPriceM2,
  avgYield,
  totalVolume24h,
  totalDeals24h,
  avgDaysToSell,
  overbidPercent,
  greenLabelPercent,
  selectedCityName,
}) => {
  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  const metrics = [
    {
      label: selectedCityName ? `Gem. m² Prijs (${selectedCityName})` : 'Gem. m² Koopprijs (NL)',
      value: `€${Math.round(avgPriceM2).toLocaleString('nl-NL')}`,
      unit: '/ m²',
      delta: '+6.1% YoY',
      isPositive: true,
      subtext: 'Op basis van notariële aktes'
    },
    {
      label: 'Bruto Rendement (BAR)',
      value: `${avgYield.toFixed(2)}%`,
      unit: '',
      delta: '+0.3% vs Q2',
      isPositive: true,
      subtext: 'Jaarhuur / aankoopsom'
    },
    {
      label: '24u Transactievolume',
      value: formatEuro(totalVolume24h),
      unit: '',
      delta: `${totalDeals24h} transacties`,
      isPositive: true,
      subtext: 'Actief handelsvolume'
    },
    {
      label: 'Gem. Doorlooptijd',
      value: `${avgDaysToSell}`,
      unit: 'dagen',
      delta: '-4 dagen vs 2025',
      isPositive: true,
      subtext: 'Van aanmelding tot akte'
    },
    {
      label: 'Overbiedingspercentage',
      value: `+${overbidPercent.toFixed(1)}%`,
      unit: '',
      delta: 'Marktkrapte indicator',
      isPositive: true,
      subtext: 'Verschil t.o.v. vraagprijs'
    },
    {
      label: 'ESG / Energielabel A+',
      value: `${Math.round(greenLabelPercent)}%`,
      unit: '',
      delta: 'Paris Proof transitie',
      isPositive: true,
      subtext: 'Aandeel verduurzaamd'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m, idx) => (
        <div 
          key={idx} 
          className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
        >
          <div>
            <span className="text-[11px] font-medium text-slate-400 block truncate">
              {m.label}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums tracking-tight">
                {m.value}
              </span>
              {m.unit && (
                <span className="text-xs font-mono text-slate-400">
                  {m.unit}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="font-mono text-cyan-400">
              {m.delta}
            </span>
            <span className="text-slate-500 text-[10px] hidden sm:inline truncate max-w-[80px]">
              {m.subtext}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
