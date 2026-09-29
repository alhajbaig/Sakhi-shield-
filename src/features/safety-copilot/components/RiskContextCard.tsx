// SakhiShield — Risk Context Card
// Explains deterministic risk engine scoring in calm, clear language without modifying scores.

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import type { RiskContext } from '../types/safetyCopilot.types';

interface RiskContextCardProps {
  risk?: RiskContext;
}

export const RiskContextCard: React.FC<RiskContextCardProps> = ({ risk }) => {
  const score = risk?.score ?? 10;
  const level = risk?.level ?? 'SAFE';
  const signals = risk?.activeSignals ?? [];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[#1C1917]/12 bg-white/70 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1C1917]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
            Risk Explanation & Signals
          </h3>
        </div>
        <span className="font-mono text-xs font-bold text-[#57534E]">
          SCORE: {score}/100
        </span>
      </div>

      <div className="space-y-2 text-xs font-sans text-[#44403C] leading-relaxed">
        {level === 'SAFE' && (
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Your transit metrics are aligned with expected safe corridor parameters. No abnormal stops or route deviations are active.
            </span>
          </p>
        )}

        {level === 'ATTENTION' && (
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Elevated vigilance is recommended. Contributing signals indicate variance from planned patterns, but do not prove danger.
            </span>
          </p>
        )}

        {level === 'CRITICAL' && (
          <p className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F62440] shrink-0 mt-0.5" />
            <span>
              Critical risk threshold triggered. Check-in prompt or emergency broadcast options are immediately prioritized.
            </span>
          </p>
        )}
      </div>

      {signals.length > 0 && (
        <div className="pt-2 border-t border-[#1C1917]/8">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider mb-1.5">
            Active Contributing Telemetry Signals:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {signals.map((sig) => (
              <span
                key={sig}
                className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[#FFE5BF] text-[#1C1917] font-semibold"
              >
                {sig.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
