import React, { useState } from 'react';
import { Property } from '../types/property';
import { 
  X, 
  Building, 
  MapPin, 
  Euro, 
  Layers, 
  Check, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Calculator, 
  Download,
  ExternalLink,
  Landmark,
  Flame,
  TrendingDown
} from 'lucide-react';

interface PropertyDrawerProps {
  property: Property | null;
  onClose: () => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
  onOpenCalculatorWithProperty: (property: Property) => void;
  onOpenKadasterReport?: (property: Property) => void;
}

export const PropertyDrawer: React.FC<PropertyDrawerProps> = ({
  property,
  onClose,
  isCompared,
  onToggleCompare,
  onOpenCalculatorWithProperty,
  onOpenKadasterReport,
}) => {
  if (!property) return null;

  const [downpaymentPct, setDownpaymentPct] = useState(30);

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  // Quick live mortgage & cashflow calculation
  const loanAmount = property.price * ((100 - downpaymentPct) / 100);
  const monthlyInterest = (loanAmount * 0.042) / 12; // 4.2% rente
  const monthlyGrossRent = property.annualRent / 12;
  const monthlyExpenses = property.monthlyHoaFee + (property.price * 0.008) / 12; // VvE + onderhoud & belastingen
  const monthlyNetCashflow = monthlyGrossRent - monthlyInterest - monthlyExpenses;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm overflow-hidden">
      <div 
        className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-cyan-400 font-bold">{property.id}</span>
            <span>·</span>
            <span>{property.cadastralCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(property)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-cyan-950 border-cyan-800 text-cyan-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Geselecteerd' : 'Vergelijk'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Main Visual Photo Banner */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            {property.imageUrl ? (
              <img
                src={property.imageUrl}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-slate-950 text-slate-600">
                <Building className="w-12 h-12" />
              </div>
            )}
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-md text-xs font-bold text-white font-mono">
              Label {property.energyLabel}
            </div>
            <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Vraagprijs</span>
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                {formatEuro(property.price)}
              </span>
            </div>
          </div>

          {/* Title & Location */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{property.title}</h2>
              {property.source === 'funda' && (
                <span className="text-[10px] font-bold text-orange-400 bg-orange-950/80 border border-orange-800/80 px-2 py-0.5 rounded">
                  Funda Bron
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{property.address}, {property.postalCode} {property.city} ({property.district})</span>
              </div>

              {property.fundaUrl && (
                <a
                  href={property.fundaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 underline"
                >
                  <span>Bekijk op Funda</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {property.brokerName && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                <span className="text-slate-500">Makelaar:</span>
                <span className="text-slate-200 font-medium">{property.brokerName}</span>
              </div>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Prijs per m²</span>
              <span className="font-mono text-sm font-bold text-cyan-400 tabular-nums">
                {formatEuro(property.pricePerM2)}
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Bruto Rendement</span>
              <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                {property.barYield.toFixed(2)}% BAR
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Oppervlakte</span>
              <span className="font-mono text-sm font-bold text-white tabular-nums">
                {property.areaM2} m²
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Kamers / Bouwjaar</span>
              <span className="font-mono text-sm font-bold text-slate-200 tabular-nums">
                {property.rooms}k · {property.constructionYear}
              </span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
              Financiële & Kadastrale Specificaties
            </span>
            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Jaarlijkse Bruto Huurstroom</span>
                <span className="font-mono font-semibold text-white">{formatEuro(property.annualRent)} / jaar</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Netto Aanvangsrendement (NAR)</span>
                <span className="font-mono font-semibold text-emerald-400">{property.narYield.toFixed(2)}%</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">WOZ Referentiewaarde</span>
                <span className="font-mono text-slate-300">{formatEuro(property.wozValue)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Maandelijkse VvE Bijdrage</span>
                <span className="font-mono text-slate-300">{property.monthlyHoaFee > 0 ? `${formatEuro(property.monthlyHoaFee)}/mnd` : 'Geen'}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Geprojecteerde Jaargroei</span>
                <span className="font-mono text-cyan-400">+{property.projectedGrowth}% p.j.</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Kadastrale Aanduiding</span>
                <span className="font-mono text-slate-400">{property.cadastralCode}</span>
              </div>
            </div>
          </div>

          {/* Live Mini Cashflow Scenario */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulatie: Netto Maandelijkse Cashflow</span>
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {downpaymentPct}% Eigen Inbreng
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={downpaymentPct}
              onChange={(e) => setDownpaymentPct(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                <span className="text-[10px] text-slate-400 block">Eigen Vermogen</span>
                <span className="font-mono text-xs font-bold text-white">
                  {formatEuro(property.price * (downpaymentPct / 100))}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                <span className="text-[10px] text-slate-400 block">Bruto Huur/mnd</span>
                <span className="font-mono text-xs font-bold text-slate-200">
                  {formatEuro(monthlyGrossRent)}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                <span className="text-[10px] text-slate-400 block">Netto Cashflow/mnd</span>
                <span className={`font-mono text-xs font-bold ${monthlyNetCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatEuro(monthlyNetCashflow)}
                </span>
              </div>
            </div>
          </div>

          {/* Kadaster & Koopsommen Verificatie Card */}
          <div className="bg-gradient-to-r from-blue-950/60 to-slate-950 border border-blue-800/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Kadaster & Eigendomsverificatie
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-950 border border-blue-700/80 text-blue-300 px-2 py-0.5 rounded">
                BRK Gevalideerd
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Officiële kadastrale akten, historische notariële koopsom en ingeschreven hypotheeksom zijn beschikbaar.
            </p>

            {property.kadasterRecord && (
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Laatste Koopsom</span>
                  <span className="font-bold text-white">{formatEuro(property.kadasterRecord.lastPurchasePrice)}</span>
                  <span className="text-[10px] text-slate-500 block font-sans">({property.kadasterRecord.lastPurchaseDate})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Waardegroei</span>
                  <span className="font-bold text-emerald-400">
                    +{(((property.price - property.kadasterRecord.lastPurchasePrice) / property.kadasterRecord.lastPurchasePrice) * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans truncate">Hyp: {property.kadasterRecord.mortgageHolder}</span>
                </div>
              </div>
            )}

            {onOpenKadasterReport && (
              <button
                onClick={() => onOpenKadasterReport(property)}
                className="w-full py-2 px-3 text-xs font-bold text-blue-200 bg-blue-900/60 hover:bg-blue-800/80 border border-blue-700/80 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Landmark className="w-3.5 h-3.5 text-blue-400" />
                <span>Open Kadaster Uittreksel & Hypotheekakte</span>
              </button>
            )}
          </div>

          {/* Features & Highlights */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Bijzondere Eigenschappen & Voorzieningen
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {property.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2">
          {onOpenKadasterReport && (
            <button
              onClick={() => onOpenKadasterReport(property)}
              className="py-2 px-3 text-xs font-bold text-blue-200 bg-blue-950/90 hover:bg-blue-900 border border-blue-800 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Landmark className="w-4 h-4 text-blue-400" />
              <span>Kadaster Rapport</span>
            </button>
          )}

          <button
            onClick={() => onOpenCalculatorWithProperty(property)}
            className="flex-1 py-2 px-3 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Rendementsanalyse</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Druk fiche af"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
