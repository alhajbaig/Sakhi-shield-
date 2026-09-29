// SakhiShield — Data Sharing & Notification Privacy Component

import React from 'react';
import { EyeOff, Download, Trash2, Bell } from 'lucide-react';
import type { PrivacyPreferences, NotificationPrivacyLevel } from '../types/privacy.types';
import { NOTIFICATION_PRIVACY_OPTIONS } from '../constants/privacy.constants';

interface DataSharingCardProps {
  preferences: PrivacyPreferences;
  onUpdate: (updates: Partial<PrivacyPreferences>) => void;
  onOpenExportModal: () => void;
  onOpenDeletionModal: () => void;
  disabled?: boolean;
}

export const DataSharingCard: React.FC<DataSharingCardProps> = ({
  preferences,
  onUpdate,
  onOpenExportModal,
  onOpenDeletionModal,
  disabled,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <EyeOff className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            SHARING & SOVEREIGNTY
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Data Sharing & Notification Privacy
          </h3>
        </div>
      </div>

      {/* Lockscreen Privacy Level */}
      <div className="space-y-2">
        <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-[#1C1917]" />
          <span>Lock-Screen Notification Visibility</span>
        </label>
        <p className="font-sans text-xs text-[#57534E]">
          Controls how much contextual information is displayed when system notifications appear on an unlocked or locked device screen.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {NOTIFICATION_PRIVACY_OPTIONS.map((opt) => {
            const isSelected = preferences.notificationPrivacy === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdate({ notificationPrivacy: opt.id as NotificationPrivacyLevel })}
                disabled={disabled}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] shadow-2xs font-semibold'
                    : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E] hover:bg-[#FFF2DB]'
                }`}
              >
                <span className="font-mono text-xs font-bold mb-1">{opt.label}</span>
                <span className="font-sans text-[11px] leading-tight text-[#78716C]">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sovereign Controls: Export & Deletion */}
      <div className="pt-4 border-t border-[#1C1917]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs font-bold text-[#1C1917] uppercase tracking-wider">
            User Data Sovereignty Tools
          </div>
          <p className="font-sans text-xs text-[#57534E]">
            Export an authenticated copy of your complete safety dossier or execute targeted data deletion.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 border border-[#1C1917]/25 rounded-lg text-xs font-mono font-bold text-[#1C1917] hover:bg-[#FFF2DB] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT DOSSIER</span>
          </button>

          <button
            type="button"
            onClick={onOpenDeletionModal}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 border border-red-300 rounded-lg text-xs font-mono font-bold text-[#F62440] hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>PURGE DATA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
