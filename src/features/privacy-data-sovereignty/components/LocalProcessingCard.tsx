// SakhiShield — Local Processing & Zero Cloud Parsing Component

import React from 'react';
import { Cpu, Info } from 'lucide-react';
import type { PrivacyPreferences } from '../types/privacy.types';

interface LocalProcessingCardProps {
  preferences: PrivacyPreferences;
  onUpdate: (updates: Partial<PrivacyPreferences>) => void;
  disabled?: boolean;
}

export const LocalProcessingCard: React.FC<LocalProcessingCardProps> = ({
  preferences,
  onUpdate,
  disabled,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            CLIENT-SIDE COMPUTATION
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Local-Only Parsing & Sovereignty
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle 1: Local-only Parsing */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1C1917]">
                Local-Only Parsing Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="font-sans text-xs text-[#57534E] leading-relaxed max-w-xl">
              Strictly runs password entropy heuristics, malicious URL regex inspection, and cryptographic SHA-256 byte hashing inside your browser sandbox. Zero transmission to remote cloud scanners.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={preferences.localParsingEnforced}
              onChange={(e) => onUpdate({ localParsingEnforced: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1C1917]/20 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C1917]" />
          </label>
        </div>

        {/* Toggle 2: Telemetry & Diagnostic Opt-in */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1C1917]">
                Anonymized Reliability Telemetry
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-300">
                OPT-IN ONLY
              </span>
            </div>
            <p className="font-sans text-xs text-[#57534E] leading-relaxed max-w-xl">
              Allows transmission of non-sensitive performance errors (e.g. offline queue sync failures). Never includes coordinates, contacts, passwords, or incident descriptions.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={preferences.telemetryOptIn}
              onChange={(e) => onUpdate({ telemetryOptIn: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1C1917]/20 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C1917]" />
          </label>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-3.5 bg-[#FFF2DB]/60 border border-[#1C1917]/10 rounded-xl text-xs font-sans text-[#57534E] flex items-center gap-3">
        <Info className="w-4 h-4 text-[#1C1917] shrink-0" />
        <span>
          <strong className="text-[#1C1917]">Zero-Knowledge Principle:</strong> What stays on your device is mathematically unverifiable by unauthorized intermediaries. SakhiShield cannot decrypt files or inspect local tokens without your private session keys.
        </span>
      </div>
    </div>
  );
};
