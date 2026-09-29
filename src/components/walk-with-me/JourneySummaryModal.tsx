// Walk With Me - Journey Completion Summary Modal
// Shows comprehensive metrics, final risk score, and audit logs upon journey conclusion

import React from 'react';
import type { Journey } from '../../types/journey';
import type { RiskEngineResult } from '../../types/safety';
import { CheckCircle2, MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface JourneySummaryModalProps {
  journey: Journey;
  riskResult: RiskEngineResult;
  onDismiss: () => void;
}

export const JourneySummaryModal: React.FC<JourneySummaryModalProps> = ({
  journey,
  riskResult,
  onDismiss,
}) => {
  const distanceKm = (journey.distance_meters / 1000).toFixed(1);
  const startedTime = new Date(journey.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endedTime = journey.ended_at
    ? new Date(journey.ended_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Now';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFFAF3] border border-[#171515]/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
        {/* Success Icon & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-widest block">
            SESSION TERMINATED SAFELY
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#171515]">
            Journey Completed.
          </h3>
          <p className="font-sans text-xs text-[#78716C]">
            GPS monitoring has ended and your location corridor is closed.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-[#FFF2DB]/60 rounded-2xl border border-[#171515]/10">
          <div>
            <span className="font-mono text-[9px] text-[#78716C] uppercase block mb-1">DESTINATION</span>
            <div className="font-sans text-sm font-bold text-[#171515] flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#F62440] shrink-0" />
              <span className="truncate">{journey.destination_name}</span>
            </div>
          </div>

          <div>
            <span className="font-mono text-[9px] text-[#78716C] uppercase block mb-1">DISTANCE TRAVELLED</span>
            <div className="font-mono text-sm font-bold text-[#171515]">
              {distanceKm} km
            </div>
          </div>

          <div className="pt-2 border-t border-[#171515]/10">
            <span className="font-mono text-[9px] text-[#78716C] uppercase block mb-1">ACTIVE TIMEFRAME</span>
            <div className="font-mono text-xs text-[#171515] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#78716C]" />
              <span>{startedTime} – {endedTime}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#171515]/10">
            <span className="font-mono text-[9px] text-[#78716C] uppercase block mb-1">FINAL SAFETY STATUS</span>
            <div className="font-mono text-xs font-bold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{riskResult.level === 'SAFE' ? 'ALL CLEAR' : riskResult.level}</span>
            </div>
          </div>
        </div>

        {/* Reassurance */}
        <div className="p-3 bg-white rounded-xl border border-[#171515]/10 text-center font-mono text-[10px] text-[#78716C]">
          ZERO PERSISTENT LOCATION RETENTION • SESSION SEALED
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#171515] hover:bg-black text-[#FFFAF3] font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>RETURN TO DASHBOARD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
