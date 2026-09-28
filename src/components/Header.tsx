import React from 'react';
import { Activity, Play, Pause, FastForward, PlusCircle, Download, Calculator, Bell, Layers, TrendingUp, Database, Github } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  streamSpeed: number;
  setStreamSpeed: (speed: number) => void;
  onSimulateTransaction: () => void;
  onExportCsv: () => void;
  onOpenCalculator: () => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  selectedCityName?: string;
  onResetCityFilter: () => void;
  comparisonCount: number;
  onOpenComparisonModal: () => void;
  onOpenFundaModal: () => void;
  onOpenGitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  setIsStreaming,
  streamSpeed,
  setStreamSpeed,
  onSimulateTransaction,
  onExportCsv,
  onOpenCalculator,
  onOpenAlerts,
  unreadAlertsCount,
  selectedCityName,
  onResetCityFilter,
  comparisonCount,
  onOpenComparisonModal,
  onOpenFundaModal,
  onOpenGitModal,
}) => {
  const navTabs = [
    { id: 'overzicht', label: 'Marktoverzicht' },
    { id: 'trends', label: 'Trendanalyse & Historie' },
    { id: 'kaart', label: 'Interactieve Kaart' },
    { id: 'objecten', label: 'Objecten & Aanbod' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('overzicht'); }}
              className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors"
            >
              VastgoedPulse NL
            </a>
            
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 border border-amber-800/60 text-amber-300" title="Firebase Cloud Firestore Actief">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Firebase Firestore Sync</span>
            </span>

            {selectedCityName && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 pl-2 border-l border-slate-700">
                <span>Filter: <strong className="text-cyan-400">{selectedCityName}</strong></span>
                <button
                  onClick={onResetCityFilter}
                  className="text-slate-400 hover:text-white underline ml-1 cursor-pointer"
                  title="Stad filter wissen"
                >
                  wissen
                </button>
              </div>
            )}
          </div>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions & Realtime Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Compare trigger button in top bar if items selected */}
            {comparisonCount > 0 && (
              <button
                onClick={onOpenComparisonModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/80 rounded-md transition-colors cursor-pointer whitespace-nowrap animate-in fade-in"
                title="Open vastgoed vergelijker"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vergelijk ({comparisonCount})</span>
              </button>
            )}

            {/* Stream Speed & Ticker control */}
            <div className="hidden sm:flex items-center bg-slate-950/80 border border-slate-800 rounded-md p-0.5 text-xs text-slate-300">
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                  isStreaming ? 'text-emerald-400 bg-slate-800/80 font-medium' : 'text-slate-400 hover:text-white'
                }`}
                title={isStreaming ? 'Pauzeer realtime feed' : 'Start realtime feed'}
              >
                {isStreaming ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <Pause className="w-3 h-3" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Pauze</span>
                  </>
                )}
              </button>

              {isStreaming && (
                <div className="flex items-center border-l border-slate-800 pl-1 ml-1 gap-0.5">
                  <button
                    onClick={() => setStreamSpeed(streamSpeed === 1 ? 2 : streamSpeed === 2 ? 5 : 1)}
                    className="px-1.5 py-1 rounded hover:bg-slate-800 text-slate-300 font-mono text-[11px] cursor-pointer"
                    title="Wijzig simulatiesnelheid"
                  >
                    {streamSpeed}x
                  </button>
                </div>
              )}
            </div>

            {/* Simuleer transactie knop */}
            <button
              onClick={onSimulateTransaction}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              title="Simuleer direct een nieuwe markttransactie"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simuleer Transactie</span>
            </button>

            {/* ROI Calculator Trigger */}
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              title="Open vastgoed rendementscalculator"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Rendementscalculator</span>
            </button>

            {/* Funda Scraper Koppeling */}
            <button
              onClick={onOpenFundaModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-orange-300 bg-orange-950/80 hover:bg-orange-900/80 border border-orange-800/80 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              title="Funda Scraper Data Integratie & Schema bekijken"
            >
              <Database className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden lg:inline">Funda Koppeling</span>
            </button>

            {/* GitHub & Code Export */}
            <button
              onClick={onOpenGitModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              title="Download project ZIP of push direct naar GitHub"
            >
              <Github className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">GitHub / Code</span>
            </button>

            {/* Alerts Drawer Trigger */}
            <button
              onClick={onOpenAlerts}
              className="relative p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
              title="Bekijk marktsignalen en notificaties"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center font-mono">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Export CSV button */}
            <button
              onClick={onExportCsv}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
              title="Exporteer dataset als CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800 gap-2 bg-slate-950/70">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};

