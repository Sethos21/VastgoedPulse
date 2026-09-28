import React from 'react';
import { RealtimeEvent } from '../types/property';
import { ArrowUpRight, ArrowDownRight, Tag, Zap, Building } from 'lucide-react';

interface LiveTickerProps {
  events: RealtimeEvent[];
  isStreaming: boolean;
  onSelectEvent: (propertyId: string) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ events, isStreaming, onSelectEvent }) => {
  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 overflow-hidden text-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-10 gap-3">
        {/* Live indicator badge */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-800">
          <span className="relative flex h-2 w-2">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isStreaming ? 'bg-emerald-500' : 'bg-slate-500'}`} />
          </span>
          <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
            {isStreaming ? 'Live Marktfeed' : 'Feed Gepauzeerd'}
          </span>
        </div>

        {/* Scrolling Event Ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 py-1">
          {events.map((evt, index) => (
            <div
              key={`${evt.id}-${index}`}
              onClick={() => onSelectEvent(evt.propertyId)}
              className="flex items-center gap-2 shrink-0 cursor-pointer hover:bg-slate-900 px-2 py-0.5 rounded transition-colors group"
            >
              <span className="text-[10px] font-mono text-slate-500">{evt.timestamp}</span>
              
              {/* Event Type Icon & Label */}
              {evt.type === 'TRANSACTION' && (
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[11px]">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Verkocht</span>
                </span>
              )}
              {evt.type === 'PRICE_CHANGE' && (
                <span className="text-amber-400 font-semibold flex items-center gap-0.5 text-[11px]">
                  <Zap className="w-3 h-3" />
                  <span>Prijswijziging</span>
                </span>
              )}
              {evt.type === 'NEW_LISTING' && (
                <span className="text-cyan-400 font-semibold flex items-center gap-0.5 text-[11px]">
                  <Tag className="w-3 h-3" />
                  <span>Nieuw</span>
                </span>
              )}
              {evt.type === 'OFFER_ACCEPTED' && (
                <span className="text-purple-400 font-semibold flex items-center gap-0.5 text-[11px]">
                  <Building className="w-3 h-3" />
                  <span>Onder Bod</span>
                </span>
              )}

              <span className="text-slate-300 font-medium group-hover:text-cyan-300 truncate max-w-[160px]">
                {evt.propertyTitle} ({evt.city})
              </span>

              <span className="font-mono text-white font-bold tabular-nums">
                {formatEuro(evt.price)}
              </span>

              <span className="font-mono text-cyan-400/90 text-[11px] tabular-nums">
                BAR {evt.yield.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
