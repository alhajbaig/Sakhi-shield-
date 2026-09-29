import React from 'react';
import { useApp } from '../../lib/AppContext';
import { ShieldCheck, Radio, Lock, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { Link } from 'react-router-dom';

export const SafetyStatus: React.FC = () => {
  const { user, sosActive, cancelSOS } = useApp();
  const isSos = sosActive || user.status === 'CRITICAL';
  const isSafe = !isSos && user.status === 'SAFE';

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border-2 transition-all relative overflow-hidden shadow-xs ${
        isSos
          ? 'border-[#F62440] bg-gradient-to-br from-red-100/90 via-[#FFFAF3] to-red-100/50 shadow-md animate-pulse'
          : isSafe
          ? 'border-emerald-800/20 bg-gradient-to-br from-emerald-50/60 via-[#FFFAF3] to-emerald-50/30'
          : 'border-amber-500/30 bg-gradient-to-br from-amber-50/70 via-[#FFFAF3] to-amber-50/40'
      }`}
    >
      {/* Decorative ambient radial glow */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isSos ? 'bg-red-300/40' : isSafe ? 'bg-emerald-200/30' : 'bg-amber-200/30'
        }`}
      />

      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#1C1917]/10 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSos ? 'bg-[#F62440] animate-ping' : 'bg-emerald-600 animate-ping'}`} />
            <span className={`font-mono text-[11px] uppercase tracking-[0.16em] font-bold ${isSos ? 'text-[#F62440]' : 'text-[#78716C]'}`}>
              {isSos ? '🚨 EMERGENCY SOS ACTIVE • GUARDIANS ALERTED' : 'AUTONOMOUS SENTINEL • LIVE TELEMETRY'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1C1917] font-bold tracking-tight">
              {isSos
                ? 'Emergency SOS Active — Dispatch Streaming'
                : isSafe
                ? 'Sab theek hai — All systems secure'
                : 'Attention Required • Review Status'}
            </h2>
            <StatusBadge status={isSos ? 'CRITICAL' : user.status} />
          </div>
        </div>

        {/* Live Privacy & Encryption Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#1C1917]/10 shadow-2xs self-start md:self-auto font-mono text-xs text-[#57534E]">
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-semibold text-[#1C1917]">ZERO CLOUD RETENTION</span>
          <span className="text-[10px] text-[#78716C]">• SHA-256 INTEGRITY</span>
        </div>
      </div>

      {/* Main explanation & Hinglish guidance */}
      <div className="my-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="max-w-2xl">
          <p className="font-sans text-sm sm:text-base text-[#44403C] leading-relaxed font-normal">
            {isSos
              ? 'Emergency beacon is actively transmitting live GPS coordinates to your trusted circle. Continuous acoustic monitoring active.'
              : user.statusDescription}
            <span className="block mt-1 text-xs text-[#78716C] italic font-serif">
              {isSos
                ? '"Agar galti se activate ho gaya hai, to niche Stand Down button dabayein."'
                : '"Late night ho ya sunsaan gali — SakhiShield background me silent sentry banke aapke saath hai."'}
            </span>
          </p>

          {isSos && (
            <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-1">
              <button
                type="button"
                onClick={cancelSOS}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>STAND DOWN / CANCEL SOS (I AM SAFE)</span>
              </button>
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F62440] hover:bg-red-700 text-white font-mono text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>CALL 112 POLICE</span>
              </a>
            </div>
          )}
        </div>

        {/* Active Journey quick CTA button */}
        {!isSos && !user.activeJourney && (
          <Link
            to="/walk-with-me"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1C1917] hover:bg-[#F62440] text-[#FFFAF3] text-xs font-mono font-bold rounded-xl transition-colors shadow-xs shrink-0 self-start md:self-auto"
          >
            <span>START CORRIDOR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Secondary metadata grid */}
      <div className="pt-4 border-t border-[#1C1917]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs relative z-10">
        <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#1C1917]/10 flex flex-col justify-between">
          <span className="text-[#78716C] uppercase text-[10px] tracking-wider block font-semibold">
            GPS Corridor Tracking
          </span>
          <span className="font-bold text-[#1C1917] flex items-center gap-1.5 mt-1">
            <Radio className={`w-3.5 h-3.5 ${user.locationMonitoring ? 'text-[#F62440] animate-pulse' : 'text-[#78716C]'}`} />
            <span>{user.locationMonitoring ? 'ACTIVE (±3m PRECISION)' : 'STANDBY (DISCREET)'}</span>
          </span>
        </div>

        <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#1C1917]/10 flex flex-col justify-between">
          <span className="text-[#78716C] uppercase text-[10px] tracking-wider block font-semibold">
            Active Journey Route
          </span>
          <span className="font-bold text-[#1C1917] mt-1 flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{user.activeJourney ? `${user.activeJourney.destination} (${user.activeJourney.eta})` : 'NO ACTIVE TRANSIT'}</span>
          </span>
        </div>

        <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#1C1917]/10 flex flex-col justify-between">
          <span className="text-[#78716C] uppercase text-[10px] tracking-wider block font-semibold">
            Trusted Guardians Sync
          </span>
          <span className="font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user.trustedContacts.length} GUARDIANS VERIFIED</span>
          </span>
        </div>
      </div>
    </div>
  );
};
