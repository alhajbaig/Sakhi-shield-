// SakhiShield — Evidence Retention & Auto-Purge Component

import React from 'react';
import { LockKeyhole, AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import type { PrivacyPreferences, EvidenceRetentionHorizon } from '../types/privacy.types';
import { EVIDENCE_RETENTION_OPTIONS } from '../constants/privacy.constants';

interface EvidenceRetentionCardProps {
  preferences: PrivacyPreferences;
  onUpdate: (updates: Partial<PrivacyPreferences>) => void;
  disabled?: boolean;
}

export const EvidenceRetentionCard: React.FC<EvidenceRetentionCardProps> = ({
  preferences,
  onUpdate,
  disabled,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <LockKeyhole className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            EVIDENCE VAULT LIFECYCLE
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Cryptographic Evidence Auto-Purge
          </h3>
        </div>
      </div>

      <p className="font-sans text-xs text-[#57534E] leading-relaxed">
        Configures the automatic lifecycle of private multimedia files, SHA-256 integrity digests, and witness records attached to your Incident Vault cases.
      </p>

      {/* Retention Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {EVIDENCE_RETENTION_OPTIONS.map((opt) => {
          const isSelected = preferences.evidenceRetention === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onUpdate({ evidenceRetention: opt.id as EvidenceRetentionHorizon })}
              disabled={disabled}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] shadow-2xs font-semibold'
                  : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E] hover:bg-[#FFF2DB]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#F62440]" />}
              </div>
              <span className="font-sans text-[11px] leading-tight text-[#78716C]">
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Warning Notice */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-300/80 rounded-xl text-xs font-sans text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Irreversible Action:</span> When an evidence auto-purge cycle runs, binary files in private storage are permanently deleted. The parent incident timeline preserves an immutable record noting that files were purged per your policy.
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-[#78716C]">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#1C1917]" />
          <span>Active policy: {preferences.evidenceRetention.replace('_', ' ')}</span>
        </div>
        <span>PIN REQUIRED FOR MANUAL PURGES</span>
      </div>
    </div>
  );
};
