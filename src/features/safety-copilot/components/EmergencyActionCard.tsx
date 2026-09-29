// SakhiShield — Emergency Action Card / Confirmation Modal
// Enforces mandatory explicit authorization before executing sensitive actions

import React from 'react';
import { AlertOctagon, X, Check, ShieldAlert } from 'lucide-react';
import type { CopilotActionOffer } from '../types/safetyCopilot.types';

interface EmergencyActionCardProps {
  action: CopilotActionOffer | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmergencyActionCard: React.FC<EmergencyActionCardProps> = ({
  action,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!action) return null;

  const isCritical = action.severity === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md rounded-3xl bg-[#FFFAF3] border border-[#1C1917]/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isCritical
                  ? 'bg-[#FEE2E2] text-[#F62440] border border-[#F62440]/30'
                  : 'bg-[#FFE5BF] text-[#1C1917] border border-[#1C1917]/15'
              }`}
            >
              {isCritical ? <AlertOctagon className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
                EXPLICIT ACTION CONFIRMATION
              </span>
              <h3 id="confirm-action-title" className="font-sans font-bold text-base text-[#1C1917]">
                {action.label}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-white/80 border border-[#1C1917]/10 text-xs font-sans text-[#44403C] leading-relaxed">
          {action.description}
          {isCritical && (
            <p className="mt-2 text-[#F62440] font-semibold text-[11px] font-mono">
              ⚠️ This will immediately broadcast high-priority alerts with your live location link to all Trusted Circle contacts.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-[#1C1917]/15 bg-white/70 text-xs font-mono font-semibold text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-xl text-xs font-mono font-bold text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isCritical
                ? 'bg-[#F62440] hover:bg-[#d81e35]'
                : 'bg-[#1C1917] hover:bg-[#F62440]'
            }`}
          >
            {isLoading ? (
              <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Confirm & Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};
