// Walk With Me - Intentional Detour & Rerouting Confirmation Modal
// Allows the user to accept a deliberate detour and recompute corridor baseline without restarting the journey

import React from 'react';
import { Route, CheckCircle2, MapPin, AlertOctagon, X } from 'lucide-react';

interface RerouteConfirmModalProps {
  deviationMeters: number;
  isRecalculating: boolean;
  onUpdateRoute: () => void;
  onConfirmSafe: () => void;
  onOpenSafePlaces: () => void;
  onTriggerSOS: () => void;
  onClose: () => void;
}

export const RerouteConfirmModal: React.FC<RerouteConfirmModalProps> = ({
  deviationMeters,
  isRecalculating,
  onUpdateRoute,
  onConfirmSafe,
  onOpenSafePlaces,
  onTriggerSOS,
  onClose,
}) => {
  return (
    <div
      role="dialog"
      aria-labelledby="reroute-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/70 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-[#FFFAF3] border border-[#171515]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#171515]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FFE5BF] flex items-center justify-center text-[#171515]">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider block">
                CORRIDOR ADAPTATION
              </span>
              <h3 id="reroute-title" className="font-serif text-xl font-bold text-[#171515]">
                Route Changed?
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#78716C] hover:text-[#171515] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Body */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-amber-800 font-bold block">
            OBSERVED SIGNAL: +{deviationMeters}M DEVIATION
          </span>
          <p className="font-sans text-xs text-amber-950 leading-relaxed">
            We noticed you took a different path from the original planned walking corridor. If you intentionally changed
            streets, you can update your safety corridor baseline right now.
          </p>
        </div>

        {/* Primary Action Choices */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onUpdateRoute}
            disabled={isRecalculating}
            className="w-full py-3.5 px-4 bg-[#171515] text-[#FFFAF3] rounded-2xl font-mono text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Route className="w-4 h-4 text-[#FFE5BF]" />
            <span>{isRecalculating ? 'RECALCULATING CORRIDOR...' : 'UPDATE ROUTE FROM HERE'}</span>
          </button>

          <button
            type="button"
            onClick={onConfirmSafe}
            className="w-full py-3.5 px-4 bg-white border border-[#171515]/20 text-[#171515] rounded-2xl font-mono text-xs font-bold hover:bg-[#FFF2DB]/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>I'M SAFE — KEEP ORIGINAL ROUTE</span>
          </button>

          <button
            type="button"
            onClick={onOpenSafePlaces}
            className="w-full py-3 px-4 bg-white border border-[#171515]/15 text-[#171515] rounded-2xl font-mono text-xs font-bold hover:bg-[#FFF2DB]/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-700" />
            <span>FIND NEARBY SAFE HAVEN</span>
          </button>

          <button
            type="button"
            onClick={onTriggerSOS}
            className="w-full py-2.5 px-4 bg-[#F62440]/10 border border-[#F62440]/30 text-[#F62440] rounded-2xl font-mono text-xs font-bold hover:bg-[#F62440]/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-[#F62440]" />
            <span>I NEED HELP (SOS)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
