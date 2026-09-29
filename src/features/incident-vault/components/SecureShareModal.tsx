// SakhiShield — Secure Share Modal Component
// Allows creating time-limited, revocable share links with scope options.

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { INCIDENT_VAULT_DISCLAIMERS } from '../constants/incidentVault.constants';

interface SecureShareModalProps {
  isOpen: boolean;
  incidentTitle: string;
  onClose: () => void;
  onCreateShare: (
    scope: 'SUMMARY_ONLY' | 'SELECTED_EVIDENCE' | 'FULL_INCIDENT',
    durationHours: number
  ) => Promise<{ shareUrl: string; expiresAt: string }>;
}

export const SecureShareModal: React.FC<SecureShareModalProps> = ({
  isOpen,
  incidentTitle,
  onClose,
  onCreateShare,
}) => {
  const [scope, setScope] = useState<'SUMMARY_ONLY' | 'SELECTED_EVIDENCE' | 'FULL_INCIDENT'>('SUMMARY_ONLY');
  const [durationHours, setDurationHours] = useState<number>(24);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareResult, setShareResult] = useState<{ shareUrl: string; expiresAt: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await onCreateShare(scope, durationHours);
      setShareResult(res);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!shareResult?.shareUrl) return;
    navigator.clipboard.writeText(shareResult.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#FFFAF3] rounded-2xl border border-[#1C1917]/20 shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C1917]/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#F62440]" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Secure Expiring Share Link
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#78716C] hover:text-[#1C1917]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="font-sans text-xs text-[#57534E] leading-relaxed">
          Generate an encrypted, time-limited link to share details of <strong>"{incidentTitle}"</strong> with a guardian, counselor, or trusted contact.
        </p>

        {!shareResult ? (
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
                SHARING SCOPE
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#1C1917]/20 bg-white font-sans text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              >
                <option value="SUMMARY_ONLY">Summary & Timeline Only (No Media)</option>
                <option value="FULL_INCIDENT">Full Incident (Summary + All Verified Evidence)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
                LINK EXPIRATION
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 24, 72].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setDurationHours(hours)}
                    className={`py-2 px-3 rounded-lg border font-mono text-xs font-bold transition-colors cursor-pointer ${
                      durationHours === hours
                        ? 'bg-[#1C1917] text-[#FFFAF3] border-[#1C1917]'
                        : 'bg-white text-[#57534E] border-[#1C1917]/20 hover:border-[#1C1917]/50'
                    }`}
                  >
                    {hours === 1 ? '1 Hour' : hours === 24 ? '24 Hours' : '3 Days'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {INCIDENT_VAULT_DISCLAIMERS.STORAGE_PRIVACY}
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold hover:bg-[#333] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? 'GENERATING SECURE TOKEN...' : 'GENERATE EXPIRING LINK'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Share Link Active</span>
              </div>
              <p className="flex items-center gap-1 font-mono text-[11px] text-emerald-800">
                <Clock className="w-3.5 h-3.5" />
                Expires {new Date(shareResult.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#1C1917]/20 flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={shareResult.shareUrl}
                className="font-mono text-xs text-[#1C1917] bg-transparent outline-none w-full"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold hover:bg-[#333] flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl border border-[#1C1917]/20 font-mono text-xs font-bold text-[#1C1917] hover:bg-[#FAF6F0]"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
