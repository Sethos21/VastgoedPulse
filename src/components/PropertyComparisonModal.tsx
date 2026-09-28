import React, { useState } from 'react';
import { X, Plus, Trash2, Check, ArrowRight, Building, Award, Sparkles, Download, Layers } from 'lucide-react';
import { Property } from '../types/property';

interface PropertyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperties: Property[];
  allProperties: Property[];
  onRemoveProperty: (id: string) => void;
  onAddProperty: (property: Property) => void;
  onSelectPropertyForDetails: (property: Property) => void;
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedProperties,
  allProperties,
  onRemoveProperty,
  onAddProperty,
  onSelectPropertyForDetails,
}) => {
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [searchAdd, setSearchAdd] = useState('');

  if (!isOpen) return null;

  // Filter available properties that can still be added
  const availableToAdd = allProperties.filter(
    (p) => !selectedProperties.some((sp) => sp.id === p.id) &&
      (p.title.toLowerCase().includes(searchAdd.toLowerCase()) || 
       p.city.toLowerCase().includes(searchAdd.toLowerCase()) ||
       p.address.toLowerCase().includes(searchAdd.toLowerCase()))
  );

  // Helper formatting
  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  // Find min/max values for highlights
  const minPricePerM2 = selectedProperties.length > 1 ? Math.min(...selectedProperties.map(p => p.pricePerM2)) : null;
  const maxYield = selectedProperties.length > 1 ? Math.max(...selectedProperties.map(p => p.barYield)) : null;
  const minPrice = selectedProperties.length > 1 ? Math.min(...selectedProperties.map(p => p.price)) : null;
  const maxArea = selectedProperties.length > 1 ? Math.max(...selectedProperties.map(p => p.areaM2)) : null;

  const getEnergyColor = (label: string) => {
    if (label.includes('A')) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
    if (label === 'B') return 'text-teal-400 bg-teal-950/60 border-teal-800/80';
    if (label === 'C') return 'text-yellow-400 bg-yellow-950/60 border-yellow-800/80';
    if (label === 'D') return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
    return 'text-rose-400 bg-rose-950/60 border-rose-800/80';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-800/60 rounded-lg text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Vastgoed Vergelijker
              </h2>
              <p className="text-xs text-slate-400">
                Vergelijk specificaties, rendementen en prijzen van {selectedProperties.length} geselecteerde objecten zij-aan-zij
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Add Property Button */}
            {selectedProperties.length < 4 && (
              <div className="relative">
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Object toevoegen ({selectedProperties.length}/4)</span>
                </button>

                {showAddDropdown && (
                  <div className="absolute right-0 mt-2 w-80 max-h-72 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-2 z-30 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Zoek op titel, adres of stad..."
                      value={searchAdd}
                      onChange={(e) => setSearchAdd(e.target.value)}
                      className="w-full px-2.5 py-1.5 mb-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                    {availableToAdd.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">Geen objecten gevonden</p>
                    ) : (
                      availableToAdd.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onAddProperty(p);
                            setShowAddDropdown(false);
                            setSearchAdd('');
                          }}
                          className="p-2 hover:bg-slate-800 rounded cursor-pointer transition-colors border-b border-slate-800/50 last:border-0"
                        >
                          <div className="text-xs font-semibold text-slate-200 truncate">{p.title}</div>
                          <div className="text-[11px] text-slate-400 flex items-center justify-between mt-0.5">
                            <span>{p.city} · {p.areaM2} m²</span>
                            <span className="font-mono text-cyan-400">{formatEuro(p.price)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          {selectedProperties.length === 0 ? (
            <div className="text-center py-16">
              <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-200">Geen objecten geselecteerd</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Selecteer minimaal 2 objecten in het overzicht of de tabel om specificaties zij-aan-zij te vergelijken.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer"
              >
                Sluiten & Naar Aanbod
              </button>
            </div>
          ) : (
            <div className="min-w-[640px]">
              {/* Grid Layout Table */}
              <div 
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `200px repeat(${selectedProperties.length}, minmax(220px, 1fr))`
                }}
              >
                {/* Header row: Property cards / photos */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Object</span>
                </div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="relative bg-slate-950/60 border border-slate-800 rounded-lg p-3 group">
                    <button
                      onClick={() => onRemoveProperty(p.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-slate-800 rounded-md transition-colors cursor-pointer z-10"
                      title="Verwijder uit vergelijking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-28 object-cover rounded-md mb-2 border border-slate-800"
                      />
                    ) : (
                      <div className="w-full h-28 bg-slate-900 rounded-md mb-2 flex items-center justify-center border border-slate-800 text-slate-600">
                        <Building className="w-8 h-8" />
                      </div>
                    )}
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{p.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.address}, {p.city}</p>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPropertyForDetails(p);
                      }}
                      className="mt-2 w-full py-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Details bekijken</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Section: Financieel */}
                <div className="col-span-full border-t border-slate-800/80 pt-3 pb-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Financiële Kerngegevens</span>
                </div>

                {/* Koopprijs */}
                <div className="text-xs text-slate-400 py-1.5">Koopprijs</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-white tabular-nums">
                      {formatEuro(p.price)}
                    </span>
                    {p.price === minPrice && (
                      <span className="text-[10px] text-emerald-400 font-mono" title="Laagste absolute koopprijs">
                        (Laagste)
                      </span>
                    )}
                  </div>
                ))}

                {/* Prijs per m² */}
                <div className="text-xs text-slate-400 py-1.5">Prijs / m²</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-slate-200 tabular-nums">
                      {formatEuro(p.pricePerM2)}/m²
                    </span>
                    {p.pricePerM2 === minPricePerM2 && (
                      <span className="text-[10px] text-emerald-400 font-mono" title="Beste prijs per vierkante meter">
                        (Beste m²)
                      </span>
                    )}
                  </div>
                ))}

                {/* Bruto Aanvangsrendement (BAR) */}
                <div className="text-xs text-slate-400 py-1.5">BAR Rendement</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 flex items-center gap-1.5">
                    <span className={`font-mono text-xs font-bold tabular-nums ${p.barYield === maxYield ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {p.barYield.toFixed(2)}%
                    </span>
                    {p.barYield === maxYield && (
                      <span className="text-[10px] text-emerald-400 font-mono" title="Hoogste bruto rendement">
                        (Top Yield)
                      </span>
                    )}
                  </div>
                ))}

                {/* Netto Aanvangsrendement (NAR) */}
                <div className="text-xs text-slate-400 py-1.5">NAR Rendement</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 font-mono text-xs text-slate-300 tabular-nums">
                    {p.narYield.toFixed(2)}%
                  </div>
                ))}

                {/* Jaarlijkse Huurstroom */}
                <div className="text-xs text-slate-400 py-1.5">Jaarlijkse Huur</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 font-mono text-xs text-slate-300 tabular-nums">
                    {formatEuro(p.annualRent)} / jr
                  </div>
                ))}

                {/* WOZ Waarde */}
                <div className="text-xs text-slate-400 py-1.5">WOZ-Referentiewaarde</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 font-mono text-xs text-slate-400 tabular-nums">
                    {formatEuro(p.wozValue)}
                  </div>
                ))}

                {/* Section: Bouw & Fysiek */}
                <div className="col-span-full border-t border-slate-800/80 pt-3 pb-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Object & Bouwspecificaties</span>
                </div>

                {/* Oppervlakte */}
                <div className="text-xs text-slate-400 py-1.5">Oppervlakte (m²)</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-slate-200 tabular-nums">
                      {p.areaM2} m²
                    </span>
                    {p.areaM2 === maxArea && (
                      <span className="text-[10px] text-cyan-400 font-mono">(Grootste)</span>
                    )}
                  </div>
                ))}

                {/* Kamers & Slaapkamers */}
                <div className="text-xs text-slate-400 py-1.5">Kamers / Slaapkamers</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 text-xs text-slate-300">
                    <span className="font-mono tabular-nums">{p.rooms}</span> kamers · <span className="font-mono tabular-nums">{p.bedrooms}</span> slp
                  </div>
                ))}

                {/* Bouwjaar */}
                <div className="text-xs text-slate-400 py-1.5">Bouwjaar</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 font-mono text-xs text-slate-300 tabular-nums">
                    {p.constructionYear}
                  </div>
                ))}

                {/* Energielabel */}
                <div className="text-xs text-slate-400 py-1.5">Energielabel</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5">
                    <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded border ${getEnergyColor(p.energyLabel)}`}>
                      {p.energyLabel}
                    </span>
                  </div>
                ))}

                {/* Vastgoedtype */}
                <div className="text-xs text-slate-400 py-1.5">Type & Segment</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 text-xs text-slate-300">
                    {p.type}
                  </div>
                ))}

                {/* Maandelijkse VvE */}
                <div className="text-xs text-slate-400 py-1.5">VvE Bijdrage</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 font-mono text-xs text-slate-400 tabular-nums">
                    {p.monthlyHoaFee > 0 ? `${formatEuro(p.monthlyHoaFee)} / mnd` : 'Geen / N.v.t.'}
                  </div>
                ))}

                {/* Kadaster Code */}
                <div className="text-xs text-slate-400 py-1.5">Kadaster Referentie</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 font-mono text-[11px] text-slate-400">
                    {p.cadastralCode}
                  </div>
                ))}

                {/* Bijzondere kenmerken */}
                <div className="text-xs text-slate-400 py-1.5">Kenmerken & Highlights</div>
                {selectedProperties.map((p) => (
                  <div key={p.id} className="py-1.5 space-y-1">
                    {p.features.slice(0, 4).map((f, idx) => (
                      <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1">
                        <span className="text-cyan-400 shrink-0">·</span>
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Vergelijkingsdata gebaseerd op realtime marktinformatie en kadasterregistraties</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                window.print();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Afdrukken / Opslaan</span>
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
