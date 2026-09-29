// Walk With Me - Nearby Safe Places Drawer
// Lists verified commercial havens, police stations, and 24/7 pharmacies

import React from 'react';
import type { SafePlace } from '../../types/safety';
import { Building2, Phone, Navigation, X, Shield, PlusCircle, Coffee } from 'lucide-react';

interface SafePlacesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  places: SafePlace[];
  onNavigateToPlace?: (place: SafePlace) => void;
}

export const SafePlacesDrawer: React.FC<SafePlacesDrawerProps> = ({
  isOpen,
  onClose,
  places,
  onNavigateToPlace,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (category: SafePlace['category']) => {
    switch (category) {
      case 'POLICE':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'HOSPITAL':
      case 'PHARMACY':
        return <PlusCircle className="w-4 h-4 text-emerald-600" />;
      case 'CAFE':
      case 'PUBLIC_HAVEN':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      default:
        return <Building2 className="w-4 h-4 text-[#171515]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#171515]/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#FFFAF3] h-full shadow-2xl flex flex-col justify-between border-l border-[#171515]/15">
        {/* Header */}
        <div className="p-6 border-b border-[#171515]/10 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider block">
              SAFETY COPILOT
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#171515]">
              Nearby Safe Places
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#78716C] hover:text-[#171515] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Places List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="font-sans text-xs text-[#78716C] leading-relaxed">
            These verified public spaces, pharmacies, and emergency services are within immediate walking distance.
          </p>

          <div className="space-y-3">
            {places.map((place) => (
              <div
                key={place.id}
                className="p-4 rounded-2xl bg-white border border-[#171515]/10 hover:border-[#171515]/30 shadow-xs transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF2DB] flex items-center justify-center">
                      {getCategoryIcon(place.category)}
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-[#171515]">
                        {place.name}
                      </h4>
                      <span className="font-mono text-[10px] text-[#78716C] uppercase">
                        {place.category} • {place.distanceMeters ? `~${place.distanceMeters}m away` : 'Nearby'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold">
                    OPEN NOW
                  </span>
                </div>

                <p className="font-sans text-xs text-[#625B55]">
                  {place.address}
                </p>

                <div className="pt-2 border-t border-[#171515]/5 flex items-center gap-2">
                  {onNavigateToPlace && (
                    <button
                      type="button"
                      onClick={() => onNavigateToPlace(place)}
                      className="flex-1 py-2 px-3 bg-[#171515] text-[#FFFAF3] rounded-lg font-mono text-[10px] font-bold uppercase hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Walk Here</span>
                    </button>
                  )}

                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="py-2 px-3 border border-[#171515]/20 rounded-lg text-[#171515] hover:bg-[#FFF2DB] font-mono text-[10px] font-bold flex items-center gap-1.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-[#171515]/10 bg-[#FFF2DB]/40 text-center font-mono text-[10px] text-[#78716C]">
          VERIFIED SAKHISHIELD HAVEN NETWORK
        </div>
      </div>
    </div>
  );
};
