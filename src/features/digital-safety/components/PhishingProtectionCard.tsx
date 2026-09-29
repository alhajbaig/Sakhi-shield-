// SakhiShield — Phishing & URL Protection Card
// Syntactic heuristic inspection tool. Does NOT execute or navigate to unknown links.

import React from 'react';
import type { UrlSecurityAssessment } from '../types';
import { Link2, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { DIGITAL_SAFETY_DISCLAIMERS } from '../constants/digitalSafety.constants';

interface PhishingProtectionCardProps {
  input: string;
  result: UrlSecurityAssessment | null;
  onChange: (val: string) => void;
}

export const PhishingProtectionCard: React.FC<PhishingProtectionCardProps> = ({
  input,
  result,
  onChange,
}) => {
  const getRiskBadge = () => {
    if (!result) return null;
    switch (result.riskLevel) {
      case 'DANGEROUS':
        return { bg: 'bg-red-100 text-red-800 border-red-300', icon: ShieldAlert, label: 'HIGH RISK' };
      case 'SUSPICIOUS':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: AlertTriangle, label: 'SUSPICIOUS' };
      case 'CAUTION':
        return { bg: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertTriangle, label: 'CAUTION' };
      case 'LOW_RISK':
      default:
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: ShieldCheck, label: 'LOW STRUCTURAL RISK' };
    }
  };

  const badge = getRiskBadge();

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-white shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#F62440]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
            PHISHING & LINK INSPECTOR
          </h3>
        </div>
        <span className="font-mono text-[10px] text-[#78716C] bg-[#F5F2EB] px-2 py-0.5 rounded">
          SYNTACTIC ANALYSIS
        </span>
      </div>

      <p className="font-sans text-xs text-[#57534E] mb-4 leading-relaxed">
        {DIGITAL_SAFETY_DISCLAIMERS.URL_ANALYSIS}
      </p>

      {/* Input Field */}
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste any link received via SMS, WhatsApp, or email (e.g. http://192.168.1.1:8080/login)..."
          className="w-full px-4 py-3 rounded-xl border border-[#1C1917]/20 bg-[#FFFAF3] font-mono text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
        />
      </div>

      {/* Results */}
      {result && input && (
        <div className="p-4 rounded-xl border border-[#1C1917]/10 bg-[#FFFAF3] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1C1917]/10">
            <div>
              <span className="font-mono text-[10px] text-[#78716C]">PARSED HOSTNAME:</span>
              <p className="font-mono text-sm font-bold text-[#1C1917] break-all">
                {result.parsedHost || 'Invalid Host'}
              </p>
            </div>
            {badge && (
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${badge.bg}`}>
                <badge.icon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </div>
            )}
          </div>

          {/* Observable Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
            <span className={result.isHttps ? 'text-emerald-700' : 'text-red-700 font-bold'}>
              {result.isHttps ? '✓ HTTPS' : '✗ Insecure HTTP'}
            </span>
            <span className={!result.isIpAddress ? 'text-emerald-700' : 'text-red-700 font-bold'}>
              {!result.isIpAddress ? '✓ Domain Name' : '✗ Raw IP Address'}
            </span>
            <span className={!result.hasSuspiciousPort ? 'text-emerald-700' : 'text-amber-700 font-bold'}>
              {!result.hasSuspiciousPort ? '✓ Standard Web Port' : '⚠ Non-standard Port'}
            </span>
            <span className={!result.isPunycodeOrIdn ? 'text-emerald-700' : 'text-amber-700 font-bold'}>
              {!result.isPunycodeOrIdn ? '✓ Standard Latin Charset' : '⚠ Punycode / IDN'}
            </span>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                Risk Indicators Detected:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {result.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Guidance Advice */}
          <div className="text-xs text-[#57534E] flex items-start gap-2 pt-1">
            <ExternalLink className="w-3.5 h-3.5 text-[#F62440] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#1C1917]">Guidance: </strong>
              {result.safeAdvice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
