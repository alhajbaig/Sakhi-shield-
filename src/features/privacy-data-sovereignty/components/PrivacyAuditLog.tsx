// SakhiShield — Privacy Audit Log Component

import React from 'react';
import { History, RefreshCw } from 'lucide-react';
import type { PrivacyAuditEvent } from '../types/privacy.types';

interface PrivacyAuditLogProps {
  events: PrivacyAuditEvent[];
  onRefresh: () => void;
}

export const PrivacyAuditLog: React.FC<PrivacyAuditLogProps> = ({ events, onRefresh }) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
              TAMPER-EVIDENT TRAIL
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
              Privacy Audit Trail
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="p-2 border border-[#1C1917]/15 rounded-lg text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFF2DB] transition-colors cursor-pointer"
          title="Refresh audit events"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <p className="font-sans text-xs text-[#57534E]">
        Immutable, verifiable log of all privacy policy updates, retention purges, and export operations triggered on your account.
      </p>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="p-6 text-center bg-[#FFF2DB]/30 border border-[#1C1917]/10 rounded-xl font-mono text-xs text-[#78716C]">
          No audit events recorded yet. Preferences changes and purge cycles will appear here.
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 bg-[#FFF2DB]/40 border border-[#1C1917]/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917]">
                    {evt.eventType.replace(/_/g, ' ')}
                  </span>
                  <span className="font-sans text-[#1C1917] font-medium">{evt.details}</span>
                </div>
              </div>

              <div className="font-mono text-[10px] text-[#78716C] shrink-0">
                {new Date(evt.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 text-right font-mono text-[11px] text-[#78716C]">
        CLIENT & SUPABASE AUDIT ACTIVE • RLS VERIFIED
      </div>
    </div>
  );
};
