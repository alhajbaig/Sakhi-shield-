// SakhiShield — Security Checks Overview Component
// Lists all observable and non-verifiable security checks clearly.

import React from 'react';
import type { SecurityCheck } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface SecurityOverviewProps {
  checks: SecurityCheck[];
}

export const SecurityOverview: React.FC<SecurityOverviewProps> = ({ checks }) => {
  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'secure':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'attention':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'risk':
        return <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />;
      case 'unknown':
      default:
        return <HelpCircle className="w-4 h-4 text-[#78716C] shrink-0" />;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-white shadow-xs">
      <div className="pb-3 mb-4 border-b border-[#1C1917]/10 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
            TELEMETRY MATRIX
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
            Observable Security Checks
          </h2>
        </div>
        <span className="font-mono text-xs text-[#78716C]">
          {checks.filter((c) => c.canVerify).length} Verified / {checks.length} Total
        </span>
      </div>

      <div className="divide-y divide-[#1C1917]/10">
        {checks.map((chk) => (
          <div key={chk.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getStatusIcon(chk.status)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-mono text-xs font-bold text-[#1C1917]">
                    {chk.title}
                  </h4>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    chk.canVerify ? 'bg-stone-100 text-stone-800' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {chk.canVerify ? 'VERIFIED' : 'BROWSER LIMITATION'}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#57534E] mt-0.5 leading-relaxed">
                  {chk.explanation}
                </p>
                {chk.recommendation && (
                  <p className="font-sans text-[11px] text-[#F62440] font-medium mt-1">
                    ↳ Action: {chk.recommendation}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto pl-7 sm:pl-0">
              <span className="font-mono text-[10px] text-[#78716C]">
                {chk.verificationSource.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
