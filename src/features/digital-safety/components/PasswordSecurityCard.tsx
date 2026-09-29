// SakhiShield — Password Security Tool Component
// Completely zero-knowledge and client-side only. Features entropy calculation and optional k-anonymity check.

import React, { useState } from 'react';
import type { PasswordAssessment } from '../types';
import { KeyRound, Eye, EyeOff, ShieldAlert, CheckCircle2, RefreshCw, Trash2 } from 'lucide-react';
import { DIGITAL_SAFETY_DISCLAIMERS } from '../constants/digitalSafety.constants';

interface PasswordSecurityCardProps {
  input: string;
  result: PasswordAssessment | null;
  isCheckingBreach: boolean;
  onChange: (val: string) => void;
  onCheckBreach: () => void;
  onClear: () => void;
}

export const PasswordSecurityCard: React.FC<PasswordSecurityCardProps> = ({
  input,
  result,
  isCheckingBreach,
  onChange,
  onCheckBreach,
  onClear,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#F62440]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
            CLIENT-SIDE PASSWORD AUDITOR
          </h3>
        </div>
        <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
          ZERO-KNOWLEDGE
        </span>
      </div>

      <p className="font-sans text-xs text-[#57534E] mb-4 leading-relaxed">
        {DIGITAL_SAFETY_DISCLAIMERS.PASSWORD_PRIVACY}
      </p>

      {/* Input Field */}
      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Test a password or passphrase for entropy..."
          autoComplete="off"
          spellCheck={false}
          className="w-full px-4 py-3 pr-24 rounded-xl border border-[#1C1917]/20 bg-white font-mono text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {input && (
            <button
              onClick={onClear}
              title="Clear password memory"
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowPassword((p) => !p)}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Analysis Output */}
      {result && input && (
        <div className="space-y-4 pt-2">
          {/* Strength Bar */}
          <div className="p-4 rounded-xl bg-white border border-[#1C1917]/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] font-bold text-[#1C1917]">
                Complexity: <span className="text-[#F62440]">{result.label}</span>
              </span>
              <span className="font-mono text-[11px] text-[#78716C]">
                {result.entropyBits} bits entropy • ~{result.estimatedCrackTime} crack time
              </span>
            </div>

            <div className="h-2 w-full bg-[#E7E2DA] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  result.score >= 70 ? 'bg-emerald-600' : result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>

            {/* Diversity Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-mono">
              <span className={result.hasUppercase ? 'text-emerald-700' : 'text-[#A8A29E]'}>
                {result.hasUppercase ? '✓' : '✗'} Uppercase (A-Z)
              </span>
              <span className={result.hasLowercase ? 'text-emerald-700' : 'text-[#A8A29E]'}>
                {result.hasLowercase ? '✓' : '✗'} Lowercase (a-z)
              </span>
              <span className={result.hasNumbers ? 'text-emerald-700' : 'text-[#A8A29E]'}>
                {result.hasNumbers ? '✓' : '✗'} Numbers (0-9)
              </span>
              <span className={result.hasSpecialChars ? 'text-emerald-700' : 'text-[#A8A29E]'}>
                {result.hasSpecialChars ? '✓' : '✗'} Symbols (!@#)
              </span>
            </div>
          </div>

          {/* Issues and Recommendations */}
          {result.issues.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-900">
                Hygiene Observations:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {result.issues.map((iss, i) => (
                  <li key={i}>{iss}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Privacy-Preserving Breach Check (k-Anonymity) */}
          <div className="p-4 rounded-xl bg-white border border-[#1C1917]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-mono text-xs font-bold text-[#1C1917]">
                Known Breach Exposure (k-Anonymity)
              </h4>
              <p className="font-sans text-[11px] text-[#78716C] leading-relaxed">
                Queries SHA-1 hash prefixes (first 5 characters only). Your actual password is never sent.
              </p>
            </div>

            <div className="shrink-0">
              {result.breachStatus === 'NOT_CHECKED' && (
                <button
                  onClick={onCheckBreach}
                  disabled={isCheckingBreach}
                  className="px-3 py-1.5 rounded-lg border border-[#1C1917]/20 bg-[#1C1917] text-[#FFFAF3] font-mono text-[11px] font-bold hover:bg-[#333] transition-colors flex items-center gap-1.5"
                >
                  {isCheckingBreach && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>Check Breach Database</span>
                </button>
              )}

              {result.breachStatus === 'VERIFIED_CLEAR' && (
                <div className="inline-flex items-center gap-1 text-emerald-700 font-mono text-xs font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Not Found in Known Breaches</span>
                </div>
              )}

              {result.breachStatus === 'BREACHED' && (
                <div className="inline-flex items-center gap-1 text-red-700 font-mono text-xs font-bold bg-red-50 px-2 py-1 rounded border border-red-200">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Exposed in {result.breachOccurrences?.toLocaleString()} Breaches</span>
                </div>
              )}

              {result.breachStatus === 'SERVICE_UNAVAILABLE' && (
                <span className="font-mono text-[11px] text-[#78716C]">
                  Breach service offline / unreachable.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
