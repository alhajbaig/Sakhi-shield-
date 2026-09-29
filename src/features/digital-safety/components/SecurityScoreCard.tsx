// SakhiShield — Security Score Card Component
// Displays deterministic score breakdown with category bars and truthful explanation.

import React from 'react';
import type { SecurityScore } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface SecurityScoreCardProps {
  score: SecurityScore;
}

export const SecurityScoreCard: React.FC<SecurityScoreCardProps> = ({ score }) => {
  const getStatusBadge = () => {
    switch (score.status) {
      case 'OPTIMAL':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          label: 'OPTIMAL POSTURE',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          label: 'ATTENTION RECOMMENDED',
        };
      case 'VULNERABLE':
      default:
        return {
          bg: 'bg-red-50 text-red-800 border-red-300',
          icon: AlertOctagon,
          label: 'ACTION REQUIRED',
        };
    }
  };

  const badge = getStatusBadge();
  const IconComponent = badge.icon;

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-[#1C1917]/10">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
            DETERMINISTIC EVALUATION
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
            Verifiable Security Index
          </h2>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${badge.bg}`}>
          <IconComponent className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Big Score Display */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white border border-[#1C1917]/10 text-center">
          <span className="font-serif text-5xl sm:text-6xl font-black text-[#1C1917]">
            {score.overall}
            <span className="text-xl text-[#78716C] font-sans font-normal">/100</span>
          </span>
          <p className="font-mono text-xs text-[#78716C] mt-2">
            Verified Observable Parameters
          </p>
          <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-mono bg-[#F5F2EB] text-[#57534E]">
            {score.isComplete ? 'All Parameters Verified' : 'Standard Web Scope'}
          </span>
        </div>

        {/* Narrative & Explanation */}
        <div className="md:col-span-2 flex flex-col justify-between h-full space-y-4">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#1C1917] font-bold mb-1">
              Assessment Rationale
            </h3>
            <p className="font-sans text-sm text-[#57534E] leading-relaxed">
              {score.explanation}
            </p>
          </div>

          {/* Category mini breakdown bars */}
          <div className="space-y-2 pt-3 border-t border-[#1C1917]/10">
            {Object.entries(score.categoryBreakdown)
              .filter(([_, cat]) => cat.max > 0)
              .map(([key, cat]) => {
                const pct = Math.round((cat.score / cat.max) * 100);
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-[#57534E] capitalize">
                      {key.replace(/_/g, ' ').toLowerCase()}
                    </span>
                    <div className="flex items-center gap-2 w-1/2">
                      <div className="h-1.5 flex-1 bg-[#E7E2DA] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1C1917] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-[#78716C] w-7 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
