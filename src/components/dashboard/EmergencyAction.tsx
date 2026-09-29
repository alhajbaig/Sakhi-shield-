import React from 'react';
import { AlertOctagon, PhoneCall } from 'lucide-react';
import { useApp } from '../../lib/AppContext';

export const EmergencyAction: React.FC = () => {
  const { triggerSOS, cancelSOS, sosActive } = useApp();

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden shadow-xs transition-all ${
        sosActive
          ? 'border-[#F62440] bg-gradient-to-r from-red-100/90 via-[#FFFAF3] to-red-100/50 animate-pulse'
          : 'border-[#F62440]/30 bg-gradient-to-r from-red-50/80 via-[#FFFAF3] to-red-50/40'
      }`}
    >
      <div className="flex items-start sm:items-center gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-[#F62440] text-white flex items-center justify-center shrink-0 shadow-sm relative">
          <AlertOctagon className="w-7 h-7 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-[#F62440] rounded-full animate-ping" />
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#F62440] font-bold">
              {sosActive ? '🚨 BEACON TRANSMITTING LIVE' : 'UNCONDITIONAL EMERGENCY OVERRIDE'}
            </span>
            <span className="font-mono text-[10px] text-[#78716C] bg-white/90 px-2 py-0.5 rounded-full border border-[#1C1917]/10">
              {sosActive ? 'GUARDIANS ENGAGED' : 'NO AI VERIFICATION REQUIRED'}
            </span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            {sosActive ? 'Active Emergency Dispatch' : 'Manual SOS Instant Broadcast'}
          </h4>
          <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-xl">
            {sosActive
              ? 'Emergency beacon active. Continuous telemetry streaming. Agar safe hain to cancel karein.'
              : 'Bina kisi algorithm ke intezaar ke — 1 tap me aapke live GPS coordinates aur emergency siren guardians ko broadcast ho jayenge.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
        {sosActive ? (
          <>
            <button
              type="button"
              onClick={cancelSOS}
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-mono text-xs sm:text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md"
            >
              STAND DOWN / CANCEL SOS
            </button>
            <a
              href="tel:112"
              className="px-5 py-3.5 bg-[#F62440] hover:bg-red-700 text-white rounded-2xl font-mono text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>CALL 112</span>
            </a>
          </>
        ) : (
          <button
            type="button"
            onClick={triggerSOS}
            className="px-7 py-4 bg-[#F62440] hover:bg-[#D91F38] text-white rounded-2xl font-mono text-xs sm:text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2.5"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span className="tracking-wide">SOS • 1-TAP EMERGENCY DISPATCH</span>
          </button>
        )}
      </div>
    </div>
  );
};
