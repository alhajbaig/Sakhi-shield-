// SakhiShield — Digital Safety Header Component
// Displays title, subtitle, live status indicator, and truthful capability disclaimer.

import React from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { DIGITAL_SAFETY_DISCLAIMERS } from '../constants/digitalSafety.constants';

interface DigitalSafetyHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  lastAssessedAt: string;
}

export const DigitalSafetyHeader: React.FC<DigitalSafetyHeaderProps> = ({
  isLoading,
  onRefresh,
  lastAssessedAt,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-[#1C1917]/10 pb-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F62440]/10 border border-[#F62440]/20 flex items-center justify-center text-[#F62440]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#F62440]">
                ZERO-KNOWLEDGE PRIVACY & SECURITY
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-bold">
              Digital Safety Posture
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#1C1917]/15 bg-white text-[#1C1917] font-mono text-xs font-bold hover:bg-[#FAF6F0] transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>RE-AUDIT ENVIRONMENT</span>
          </button>
          <span className="font-mono text-[9px] text-[#78716C]">
            Audited: {new Date(lastAssessedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Truthful Browser Boundary Banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F2EB] border border-[#1C1917]/10 text-xs text-[#57534E]">
        <AlertCircle className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#1C1917] font-mono">BROWSER SCOPE TRANSPARENCY: </strong>
          {DIGITAL_SAFETY_DISCLAIMERS.BROWSER_LIMITATION} All evaluations here represent genuine browser, session, and cryptographic checks.
        </p>
      </div>
    </div>
  );
};
