import React, { useState } from 'react';
import { Lock, Check, CheckCircle2 } from 'lucide-react';

interface PrivacyPanelProps {
  className?: string;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({ className = '' }) => {
  const [locationSharing, setLocationSharing] = useState<'NOBODY' | 'TRUSTED' | 'EMERGENCY'>('TRUSTED');
  const [retention, setRetention] = useState<'7_DAYS' | '30_DAYS' | 'UNTIL_DELETED'>('30_DAYS');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleLocationChange = (val: 'NOBODY' | 'TRUSTED' | 'EMERGENCY') => {
    setLocationSharing(val);
    setSaveToast(`✓ Location policy updated to: ${val}`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleRetentionChange = (val: '7_DAYS' | '30_DAYS' | 'UNTIL_DELETED') => {
    setRetention(val);
    setSaveToast(`✓ Retention horizon set to: ${val.replace('_', ' ')}`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  return (
    <div className={`border-2 border-[#1C1917]/20 bg-[#FFFAF3] rounded-xl p-5 md:p-8 text-[#1C1917] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1C1917]/15 gap-2">
        <div>
          <span className="font-mono text-xs tracking-widest text-[#78716C] uppercase font-bold">
            USER SOVEREIGNTY CONSOLE
          </span>
          <h4 className="font-serif text-2xl text-[#1C1917]">Interactive Security Controls</h4>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#1C1917] text-[#FFFAF3] rounded-lg text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5 text-[#FFFAF3]" />
          <span>ZERO-KNOWLEDGE CORE</span>
        </div>
      </div>

      {/* Control 1: Location Sharing */}
      <div className="my-5">
        <div className="flex items-baseline justify-between mb-2.5">
          <label className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] uppercase tracking-wider">
            1. LOCATION SHARING BROADCAST
          </label>
          <span className="font-mono text-xs font-bold text-[#F62440]">
            ACTIVE: {locationSharing}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'NOBODY', label: 'Nobody', note: 'Strictly on-device only. Zero network broadcast.' },
            { id: 'TRUSTED', label: 'Trusted Contact', note: 'Temporary relay during active session only.' },
            { id: 'EMERGENCY', label: 'Emergency Only', note: 'Broadcasts only upon confirmed threat trigger.' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleLocationChange(opt.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                locationSharing === opt.id
                  ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold shadow-xs'
                  : 'border-[#1C1917]/20 bg-[#FFF2DB]/50 hover:bg-[#FFF2DB] text-[#44403C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans text-sm font-bold">{opt.label}</span>
                {locationSharing === opt.id && <Check className="w-4 h-4 text-[#F62440]" />}
              </div>
              <p className="text-xs text-[#57534E] leading-normal">{opt.note}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Control 2: Retention */}
      <div className="my-5 pt-4 border-t border-[#1C1917]/15">
        <div className="flex items-baseline justify-between mb-2.5">
          <label className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] uppercase tracking-wider">
            2. TELEMETRY AUTO-PURGE RETENTION
          </label>
          <span className="font-mono text-xs font-bold text-[#1C1917]">
            AUTO-PURGE: {retention.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: '7_DAYS', label: '7 Days', note: 'Rapid ephemeral auto-purge from device.' },
            { id: '30_DAYS', label: '30 Days', note: 'Standard reporting and audit window.' },
            { id: 'UNTIL_DELETED', label: 'Until Deleted', note: 'Retained until you delete it with your PIN.' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleRetentionChange(opt.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                retention === opt.id
                  ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold shadow-xs'
                  : 'border-[#1C1917]/20 bg-[#FFF2DB]/50 hover:bg-[#FFF2DB] text-[#44403C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans text-sm font-bold">{opt.label}</span>
                {retention === opt.id && <Check className="w-4 h-4 text-[#F62440]" />}
              </div>
              <p className="text-xs text-[#57534E] leading-normal">{opt.note}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="p-3 bg-[#FFE5BF] border border-[#1C1917]/20 rounded-lg flex items-center gap-2 font-mono text-xs text-[#1C1917] font-bold my-2">
          <CheckCircle2 className="w-4 h-4 text-[#F62440] shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 5 Guarantees micro-strip with comfortable text */}
      <div className="mt-5 pt-4 border-t border-[#1C1917]/15 grid grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
        <div className="p-2.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-lg">
          <div className="font-mono font-bold text-[#1C1917] uppercase">Location</div>
          <div className="text-xs text-[#57534E] mt-0.5">Session only</div>
        </div>
        <div className="p-2.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-lg">
          <div className="font-mono font-bold text-[#1C1917] uppercase">Sharing</div>
          <div className="text-xs text-[#57534E] mt-0.5">User-controlled</div>
        </div>
        <div className="p-2.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-lg">
          <div className="font-mono font-bold text-[#1C1917] uppercase">Evidence</div>
          <div className="text-xs text-[#57534E] mt-0.5">Encrypted local</div>
        </div>
        <div className="p-2.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-lg">
          <div className="font-mono font-bold text-[#1C1917] uppercase">Access</div>
          <div className="text-xs text-[#57534E] mt-0.5">Auditably logged</div>
        </div>
        <div className="p-2.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-lg col-span-2 md:col-span-1">
          <div className="font-mono font-bold text-[#1C1917] uppercase">Retention</div>
          <div className="text-xs text-[#57534E] mt-0.5">Configurable</div>
        </div>
      </div>
    </div>
  );
};
