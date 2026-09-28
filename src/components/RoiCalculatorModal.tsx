import React, { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { X, Calculator, Euro, Percent, ArrowRight, ShieldCheck, Download, Sparkles } from 'lucide-react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
}) => {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(1000000);
  const [transferTaxRate, setTransferTaxRate] = useState<number>(10.4); // 10.4% beleggers
  const [notaryAppraisalFees, setNotaryAppraisalFees] = useState<number>(6500);
  const [renovationCost, setRenovationCost] = useState<number>(0);
  const [equityPercent, setEquityPercent] = useState<number>(30); // 30% eigen vermogen
  const [interestRate, setInterestRate] = useState<number>(4.2); // 4.2% rente
  const [monthlyRent, setMonthlyRent] = useState<number>(5500);
  const [vacancyRate, setVacancyRate] = useState<number>(3.0); // 3% leegstand
  const [operatingCostPercent, setOperatingCostPercent] = useState<number>(15.0); // 15% exploitatiekosten
  const [annualGrowthRate, setAnnualGrowthRate] = useState<number>(5.5); // 5.5% waardegroei

  // Update when a property is injected
  useEffect(() => {
    if (selectedProperty) {
      setPurchasePrice(selectedProperty.price);
      setMonthlyRent(Math.round(selectedProperty.annualRent / 12));
      setAnnualGrowthRate(selectedProperty.projectedGrowth);
    }
  }, [selectedProperty]);

  if (!isOpen) return null;

  // Calculations
  const transferTax = purchasePrice * (transferTaxRate / 100);
  const totalAcquisitionCost = purchasePrice + transferTax + notaryAppraisalFees + renovationCost;
  const equityInvested = totalAcquisitionCost * (equityPercent / 100);
  const mortgagePrincipal = totalAcquisitionCost - equityInvested;

  const annualGrossRent = monthlyRent * 12;
  const annualEffectiveRent = annualGrossRent * (1 - vacancyRate / 100);
  const annualOperatingExpenses = annualEffectiveRent * (operatingCostPercent / 100);
  const netOperatingIncome = annualEffectiveRent - annualOperatingExpenses;

  const annualMortgageInterest = mortgagePrincipal * (interestRate / 100);
  const annualNetCashflow = netOperatingIncome - annualMortgageInterest;
  const monthlyNetCashflow = annualNetCashflow / 12;

  // Key Ratios
  const bar = (annualGrossRent / purchasePrice) * 100;
  const nar = (netOperatingIncome / totalAcquisitionCost) * 100;
  const cashOnCash = equityInvested > 0 ? (annualNetCashflow / equityInvested) * 100 : 0;
  const dscr = annualMortgageInterest > 0 ? netOperatingIncome / annualMortgageInterest : 99;

  // 5 Year Projections
  const projectedValue5Y = purchasePrice * Math.pow(1 + annualGrowthRate / 100, 5);
  const totalCapitalGain5Y = projectedValue5Y - purchasePrice;
  const totalCashflow5Y = annualNetCashflow * 5;
  const totalNetReturn5Y = totalCapitalGain5Y + totalCashflow5Y;

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950/80 border border-amber-800/60 rounded-lg text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Vastgoed Rendementscalculator & Cashflow Simulator
              </h2>
              <p className="text-xs text-slate-400">
                {selectedProperty 
                  ? `Simulatie voor: ${selectedProperty.title} (${selectedProperty.city})`
                  : 'Bereken BAR, NAR, Cash-on-Cash rendement en 5-jaars kapitaalaanwas'}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Inputs */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                1. Aankoop & Financiering Parameters
              </span>

              {/* Purchase price */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Koopprijs (€)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Transfer tax rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Overdrachtsbelasting</label>
                  <select
                    value={transferTaxRate}
                    onChange={(e) => setTransferTaxRate(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value={10.4}>10.4% (Beleggers / B2B)</option>
                    <option value={2.0}>2.0% (Eigen Bewoning)</option>
                    <option value={0.0}>0.0% (V.O.N. / Vrijgesteld)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Notaris & Taxatie (€)</label>
                  <input
                    type="number"
                    value={notaryAppraisalFees}
                    onChange={(e) => setNotaryAppraisalFees(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Equity % and Interest rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Eigen Inbreng (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={equityPercent}
                    onChange={(e) => setEquityPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Hypotheekrente (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block pt-2">
                2. Exploitatie & Huurinkomsten
              </span>

              {/* Monthly rent and Vacancy rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Verwachte Maandhuur (€)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Leegstandscorrectie (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={vacancyRate}
                    onChange={(e) => setVacancyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Operating costs & Annual growth */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Exploitatiekosten (% van huur)</label>
                  <input
                    type="number"
                    step="1"
                    value={operatingCostPercent}
                    onChange={(e) => setOperatingCostPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Verwachte Waardegroei (% p.j.)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={annualGrowthRate}
                    onChange={(e) => setAnnualGrowthRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Results & KPIs */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                3. Berekende Rendementen & Cashflow
              </span>

              {/* Key Ratio Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Bruto Rendement (BAR)</span>
                  <div className="font-mono text-xl font-bold text-white tabular-nums mt-0.5">
                    {bar.toFixed(2)}%
                  </div>
                  <span className="text-[10px] text-slate-500">Jaarhuur / Koopsom</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Netto Rendement (NAR)</span>
                  <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
                    {nar.toFixed(2)}%
                  </div>
                  <span className="text-[10px] text-slate-500">Na alle lasten</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Cash-on-Cash Return</span>
                  <div className="font-mono text-xl font-bold text-cyan-400 tabular-nums mt-0.5">
                    {cashOnCash.toFixed(2)}%
                  </div>
                  <span className="text-[10px] text-slate-500">Rendement op eigen inbreng</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Netto Maandcashflow</span>
                  <div className={`font-mono text-xl font-bold tabular-nums mt-0.5 ${monthlyNetCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatEuro(monthlyNetCashflow)}
                  </div>
                  <span className="text-[10px] text-slate-500">Vrij besteedbaar per mnd</span>
                </div>
              </div>

              {/* Capital & Debt breakdown */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs divide-y divide-slate-800">
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400">Totale Verwervingskosten</span>
                  <span className="font-mono font-bold text-white">{formatEuro(totalAcquisitionCost)}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400">Benodigd Eigen Vermogen</span>
                  <span className="font-mono text-cyan-300 font-semibold">{formatEuro(equityInvested)}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400">Hypothecaire Lening (LTV {100 - equityPercent}%)</span>
                  <span className="font-mono text-slate-300">{formatEuro(mortgagePrincipal)}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400">Debt Service Coverage (DSCR)</span>
                  <span className={`font-mono font-bold ${dscr >= 1.25 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {dscr.toFixed(2)}x
                  </span>
                </div>
              </div>

              {/* 5 Year Capital Appreciation Card */}
              <div className="bg-slate-950/90 border border-purple-900/50 rounded-xl p-4 text-xs space-y-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>5-Jaars Vermogensprognose (Cumulatief)</span>
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Geprojecteerde Verkoopwaarde</span>
                    <span className="font-mono text-sm font-bold text-white">{formatEuro(projectedValue5Y)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Totale Waardestijging</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">+{formatEuro(totalCapitalGain5Y)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cumulatieve Netto Cashflow</span>
                    <span className="font-mono text-sm font-bold text-cyan-400">+{formatEuro(totalCashflow5Y)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Totale Vermogensgroei 5J</span>
                    <span className="font-mono text-sm font-bold text-purple-300">+{formatEuro(totalNetReturn5Y)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Berekeningen volgens NVM & RICS standaard vastgoedtaxatienormen</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporteer Berekening</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Sluiten
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
