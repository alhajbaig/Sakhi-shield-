// Walk With Me - Check-In Verification Modal (Two-Stage Flow)
// Stage FIRST: Initial safety check — if missed → suspicion (popup to circle)
// Stage FINAL: Last warning — if missed → full emergency alert

import React, { useState, useEffect } from 'react';
import type { CheckInSession } from '../../types/journey';
import { triggerSafetyChime } from '../../services/safetyHaptics';
import { ShieldAlert, CheckCircle2, Eye, AlertOctagon, Clock, AlertTriangle } from 'lucide-react';

interface CheckInModalProps {
  session: CheckInSession;
  onRespond: (response: 'SAFE' | 'UNCOMFORTABLE' | 'NEED_HELP') => void;
  onTimeout?: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ session, onRespond, onTimeout }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (session.deadline) {
      return Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000));
    }
    return session.timeout_seconds;
  });

  const isFinalStage = session.stage === 'FINAL';

  useEffect(() => {
    // Play safety chime & vibration on mount
    triggerSafetyChime();

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = session.deadline
        ? Math.max(0, Math.ceil((session.deadline - now) / 1000))
        : Math.max(0, secondsLeft - 1);

      setSecondsLeft(remaining);

      if (remaining <= 0) {
        onTimeout?.();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [session.deadline, onTimeout]);

  // Progress percentage for the circular timer
  const progressPercent = session.timeout_seconds > 0
    ? Math.max(0, (secondsLeft / session.timeout_seconds) * 100)
    : 0;

  return (
    <div
      role="dialog"
      aria-labelledby="checkin-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
      style={{
        backgroundColor: isFinalStage ? 'rgba(246, 36, 64, 0.15)' : 'rgba(23, 21, 21, 0.75)',
      }}
    >
      <div
        className={`bg-[#FFFAF3] rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 ${
          isFinalStage ? 'border-2 border-[#F62440] ring-4 ring-[#F62440]/20' : 'border-2 border-amber-400'
        }`}
        style={{
          animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Top accent */}
        {isFinalStage && (
          <div className="h-1.5 w-full bg-gradient-to-r from-[#F62440] via-red-500 to-orange-500 rounded-full -mt-2 mb-4" />
        )}

        {/* Header with Circular Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${
              isFinalStage
                ? 'bg-[#F62440] text-white'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {isFinalStage ? (
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className={`font-mono text-[10px] uppercase tracking-[0.15em] block ${
                isFinalStage ? 'text-[#F62440] font-bold' : 'text-[#78716C]'
              }`}>
                {isFinalStage ? '⚠️ FINAL WARNING' : 'SAFETY CHECK-IN'}
              </span>
              <h3 id="checkin-title" className="font-serif text-lg font-bold text-[#171515]">
                {isFinalStage ? 'Are you okay?' : 'Everything alright?'}
              </h3>
            </div>
          </div>

          {/* Circular Countdown Timer */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28" cy="28" r="24"
                fill="none"
                stroke={isFinalStage ? '#FEE2E2' : '#FEF3C7'}
                strokeWidth="4"
              />
              <circle
                cx="28" cy="28" r="24"
                fill="none"
                stroke={secondsLeft <= 15 ? '#F62440' : isFinalStage ? '#F62440' : '#F59E0B'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercent / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-mono text-sm font-bold ${
                secondsLeft <= 15 ? 'text-[#F62440] animate-pulse' : 'text-[#171515]'
              }`}>
                {secondsLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Reason Explanation */}
        <div className={`p-3.5 rounded-2xl border ${
          isFinalStage
            ? 'bg-red-50 border-red-200'
            : 'bg-[#FFF2DB] border-[#171515]/10'
        }`}>
          <span className="font-mono text-[9px] text-[#78716C] uppercase block mb-1">
            {isFinalStage ? 'CRITICAL NOTICE' : 'SIGNAL TRIGGER'}
          </span>
          <p className="font-sans text-xs text-[#171515] font-medium leading-relaxed">
            {session.reason || 'We noticed a change in your journey pace or corridor.'}
          </p>
        </div>

        {/* Final stage urgent warning */}
        {isFinalStage && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-300 rounded-xl">
            <Clock className="w-4 h-4 text-[#F62440] shrink-0 animate-pulse" />
            <span className="font-sans text-[11px] text-red-800 font-medium leading-relaxed">
              If no response, your <strong>trusted circle will receive a full emergency alert</strong> with your exact Google Maps location.
            </span>
          </div>
        )}

        {/* Action Choice Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => onRespond('SAFE')}
            className="w-full py-3.5 px-4 bg-[#171515] text-[#FFFAF3] rounded-2xl font-mono text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            <span>I AM SAFE & OK</span>
          </button>

          <button
            type="button"
            onClick={() => onRespond('UNCOMFORTABLE')}
            className="w-full py-3.5 px-4 bg-white border border-[#171515]/20 text-[#171515] rounded-2xl font-mono text-xs font-bold hover:bg-[#FFF2DB]/60 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>FEEL UNCOMFORTABLE (ALERT CIRCLE)</span>
          </button>

          <button
            type="button"
            onClick={() => onRespond('NEED_HELP')}
            className="w-full py-3 px-4 bg-[#F62440]/10 border border-[#F62440]/30 text-[#F62440] rounded-2xl font-mono text-xs font-bold hover:bg-[#F62440]/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <AlertOctagon className="w-4 h-4 text-[#F62440]" />
            <span>I NEED HELP (SOS)</span>
          </button>
        </div>

        {/* Footer note */}
        <p className="font-mono text-[10px] text-[#78716C] text-center leading-relaxed">
          {isFinalStage
            ? `⚠️ ${secondsLeft}s remaining — full emergency alert will be dispatched if no response.`
            : `If no response within ${secondsLeft}s, your trusted circle will be notified.`
          }
        </p>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
