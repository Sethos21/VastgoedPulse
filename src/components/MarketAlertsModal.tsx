import React from 'react';
import { X, Bell, Zap, TrendingUp, AlertTriangle, ArrowRight, Building, CheckCheck } from 'lucide-react';
import { Property } from '../types/property';

interface MarketAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPropertyForDetails: (property: Property) => void;
  allProperties: Property[];
}

export const MarketAlertsModal: React.FC<MarketAlertsModalProps> = ({
  isOpen,
  onClose,
  onSelectPropertyForDetails,
  allProperties,
}) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 'ALT-1',
      title: 'Top Yield Koper Opportuniteit',
      message: 'BAR rendement boven 7.6% gedetecteerd in Rotterdam havengebied.',
      type: 'yield',
      timestamp: '6 min geleden',
      propertyId: 'PROP-ROT-006'
    },
    {
      id: 'ALT-2',
      title: 'Brainport Expansie Signaal',
      message: 'Eindhoven Strijp-S kent 8.2% jaarlijkse waardegroei met sterke expat huurvraag.',
      type: 'momentum',
      timestamp: '18 min geleden',
      propertyId: 'PROP-EIN-004'
    },
    {
      id: 'ALT-3',
      title: 'Duurzaamheid Benchmark (A++++)',
      message: 'Volledig Paris Proof Timber Office in Utrecht Merwede onder bod.',
      type: 'esg',
      timestamp: '32 min geleden',
      propertyId: 'PROP-UTR-003'
    },
    {
      id: 'ALT-4',
      title: 'Rijksmonument Prijsaanpassing',
      message: 'Grachtenpand Keizersgracht Amsterdam biedt uitzonderlijke m² verhouding voor erfgoed.',
      type: 'price',
      timestamp: '48 min geleden',
      propertyId: 'PROP-AMS-001'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950/80 border border-cyan-800/60 rounded-lg text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Realtime Marktsignalen</h3>
              <p className="text-xs text-slate-400">Automatische triggers op basis van rendement en prijsontwikkeling</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {alerts.map((alt) => {
            const prop = allProperties.find(p => p.id === alt.propertyId);

            return (
              <div 
                key={alt.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-lg p-3.5 space-y-2 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {alt.type === 'yield' && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                    {alt.type === 'momentum' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                    {alt.type === 'esg' && <Building className="w-3.5 h-3.5 text-teal-400" />}
                    {alt.type === 'price' && <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{alt.title}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{alt.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {alt.message}
                </p>

                {prop && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-[200px]">
                      {prop.title}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPropertyForDetails(prop);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <span>Bekijk object</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center text-xs text-slate-400">
          <span>Notificaties worden live bijgewerkt</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>

      </div>
    </div>
  );
};
