import React, { useState, useMemo } from 'react';
import { Property, FilterState, PropertyType, EnergyLabel, PropertyStatus } from '../types/property';
import { Search, Filter, Layers, ArrowUpDown, ChevronRight, CheckSquare, Square, Building, Sparkles, Landmark, Flame, TrendingDown } from 'lucide-react';

interface PropertyTableProps {
  properties: Property[];
  selectedPropertyIdsForComparison: string[];
  onToggleCompare: (property: Property) => void;
  onOpenComparisonModal: () => void;
  onSelectPropertyForDetails: (property: Property) => void;
  onOpenKadasterReport?: (property: Property) => void;
  selectedCityName?: string;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  selectedPropertyIdsForComparison,
  onToggleCompare,
  onOpenComparisonModal,
  onSelectPropertyForDetails,
  onOpenKadasterReport,
  selectedCityName,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedEnergy, setSelectedEnergy] = useState('ALL');
  const [quickFilter, setQuickFilter] = useState<'all' | 'forSale' | 'priceDrop'>('all');
  const [sortField, setSortField] = useState<keyof Property>('price');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Available filter options
  const propertyTypes: PropertyType[] = ['Woning', 'Appartement', 'Kantoor', 'Logistiek', 'Winkelruimte'];
  const energyLabels: EnergyLabel[] = ['A++++', 'A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'];

  // Filtered & Sorted Properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        const matchesSearch = 
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.address.toLowerCase().includes(search.toLowerCase()) ||
          p.city.toLowerCase().includes(search.toLowerCase()) ||
          p.district.toLowerCase().includes(search.toLowerCase()) ||
          p.cadastralCode.toLowerCase().includes(search.toLowerCase());

        const matchesCity = !selectedCityName || p.city.toLowerCase() === selectedCityName.toLowerCase();
        const matchesType = selectedType === 'ALL' || p.type === selectedType;
        const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
        const matchesEnergy = selectedEnergy === 'ALL' || p.energyLabel === selectedEnergy;

        // Quick filters
        let matchesQuick = true;
        if (quickFilter === 'forSale') {
          matchesQuick = p.status === 'Te Koop' || p.status === 'Nieuw in Aanbod';
        } else if (quickFilter === 'priceDrop') {
          matchesQuick = p.priceDrop !== undefined;
        }

        return matchesSearch && matchesCity && matchesType && matchesStatus && matchesEnergy && matchesQuick;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc 
            ? (valA as string).localeCompare(valB as string) 
            : (valB as string).localeCompare(valA as string);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [properties, search, selectedCityName, selectedType, selectedStatus, selectedEnergy, quickFilter, sortField, sortAsc]);

  const handleSort = (field: keyof Property) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending for prices/yields
    }
  };

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      
      {/* Table Toolbar: Search, Filters, and Compare Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Vastgoedobjecten & Actueel Aanbod</span>
            <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {filteredProperties.length} objecten
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Selecteer objecten via het selectievakje om direct zij-aan-zij te vergelijken
          </p>
        </div>

        {/* Floating / Inline Compare Action Banner */}
        {selectedPropertyIdsForComparison.length > 0 && (
          <div className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-800/80 px-3 py-1.5 rounded-lg text-xs animate-in fade-in">
            <span className="text-cyan-300 font-medium">
              <strong className="font-mono text-cyan-200">{selectedPropertyIdsForComparison.length}</strong> objecten geselecteerd
            </span>
            <button
              onClick={onOpenComparisonModal}
              className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vergelijk Nu</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Row */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Zoek op adres, stad, wijk of kadaster..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Alle Vastgoedtypen</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Alle Statussen</option>
              <option value="Te Koop">Te Koop</option>
              <option value="Nieuw in Aanbod">Nieuw in Aanbod</option>
              <option value="Onder Bod">Onder Bod</option>
              <option value="Verkocht">Verkocht</option>
              <option value="Verhuurd">Verhuurd</option>
            </select>
          </div>

          {/* Energy Label Filter */}
          <div>
            <select
              value={selectedEnergy}
              onChange={(e) => setSelectedEnergy(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Alle Energielabels</option>
              {energyLabels.map((l) => (
                <option key={l} value={l}>Energielabel {l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Chips for Actief Te Koop & Prijscorrecties */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-500 font-medium">Snel filter:</span>
          
          <button
            onClick={() => setQuickFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              quickFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Alle Objecten ({properties.length})
          </button>

          <button
            onClick={() => setQuickFilter('forSale')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              quickFilter === 'forSale'
                ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-950'
                : 'bg-slate-950 text-orange-400 hover:text-orange-300 border border-orange-900/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Alleen Te Koop & Nieuw</span>
          </button>

          <button
            onClick={() => setQuickFilter('priceDrop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              quickFilter === 'priceDrop'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                : 'bg-slate-950 text-rose-400 hover:text-rose-300 border border-rose-900/60'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Prijscorrecties / Prijsdaling</span>
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">Vergelijk</th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-1">
                  <span>Object / Locatie</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('areaM2')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Oppervlakte</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Koopprijs</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('pricePerM2')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Prijs / m²</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('barYield')}>
                <div className="flex items-center justify-end gap-1">
                  <span>BAR Rendement</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Kamers</th>
              <th className="py-2.5 px-3 text-center">Label</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredProperties.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500">
                  Geen objecten gevonden die voldoen aan de zoekcriteria.
                </td>
              </tr>
            ) : (
              filteredProperties.map((p) => {
                const isCompared = selectedPropertyIdsForComparison.includes(p.id);

                return (
                  <tr 
                    key={p.id}
                    className={`hover:bg-slate-800/60 transition-colors ${isCompared ? 'bg-cyan-950/20' : ''}`}
                  >
                    {/* Checkbox column */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onToggleCompare(p)}
                        className="text-slate-400 hover:text-cyan-400 cursor-pointer p-0.5"
                        title={isCompared ? 'Verwijder uit vergelijker' : 'Voeg toe aan vergelijker'}
                      >
                        {isCompared ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Title & Location (Zero-pill metadata) */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div 
                          onClick={() => onSelectPropertyForDetails(p)}
                          className="font-bold text-white hover:text-cyan-400 cursor-pointer truncate max-w-[220px]"
                        >
                          {p.title}
                        </div>
                        {p.source === 'funda' && (
                          <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-950/80 border border-orange-800/80 px-1 py-0.2 rounded shrink-0">
                            Funda
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{p.city}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.district}</span>
                        {p.brokerName && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-400 truncate max-w-[130px]">{p.brokerName}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                      {p.type}
                    </td>

                    {/* Area */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-200">
                      {p.areaM2} m²
                    </td>

                    {/* Price */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <div className="font-bold text-white">
                        {formatEuro(p.price)}
                      </div>
                      {p.priceDrop && (
                        <div className="text-[10px] text-rose-400 font-semibold flex items-center justify-end gap-1 mt-0.5" title={`Oorspronkelijke vraagprijs: ${formatEuro(p.priceDrop.originalPrice)}`}>
                          <span>-€{(p.priceDrop.dropAmount / 1000).toFixed(0)}k</span>
                          <span>(-{p.priceDrop.percentage}%)</span>
                        </div>
                      )}
                    </td>

                    {/* Price per m2 */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-cyan-300 font-medium">
                      {formatEuro(p.pricePerM2)}
                    </td>

                    {/* BAR */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-emerald-400">
                      {p.barYield.toFixed(2)}%
                    </td>

                    {/* Rooms */}
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-300">
                      {p.rooms} ({p.bedrooms} slp)
                    </td>

                    {/* Energy Label */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono text-[11px] font-bold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {p.energyLabel}
                      </span>
                    </td>

                    {/* Status & Days on Market */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className={`text-[11px] font-medium block ${
                        p.status === 'Te Koop' ? 'text-cyan-400' :
                        p.status === 'Nieuw in Aanbod' ? 'text-emerald-400' :
                        p.status === 'Onder Bod' ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                      {p.daysOnMarket !== undefined && (
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {p.daysOnMarket}d op markt
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenKadasterReport && (
                          <button
                            onClick={() => onOpenKadasterReport(p)}
                            className="px-2 py-1 bg-blue-950/80 hover:bg-blue-900 text-blue-300 hover:text-blue-100 border border-blue-800/80 rounded transition-colors text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                            title="Open officieel Kadaster & Koopsommen uittreksel"
                          >
                            <Landmark className="w-3 h-3 text-blue-400" />
                            <span className="hidden sm:inline">Kadaster</span>
                          </button>
                        )}
                        <button
                          onClick={() => onSelectPropertyForDetails(p)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded transition-colors text-[11px] cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
