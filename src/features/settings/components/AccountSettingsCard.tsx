// SakhiShield — Account Settings Card Component

import React, { useState } from 'react';
import { User, Check } from 'lucide-react';
import type { UserSettings } from '../types/settings.types';

interface AccountSettingsCardProps {
  settings: UserSettings;
  email: string;
  onUpdate: (updates: Partial<UserSettings>) => void;
  disabled?: boolean;
}

export const AccountSettingsCard: React.FC<AccountSettingsCardProps> = ({
  settings,
  email,
  onUpdate,
  disabled,
}) => {
  const [fullName, setFullName] = useState(settings.fullName);
  const [phone, setPhone] = useState(settings.phone);
  const [emergencyNotes, setEmergencyNotes] = useState(settings.emergencyNotes || '');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    onUpdate({
      fullName: fullName.trim(),
      phone: phone.trim(),
      emergencyNotes: emergencyNotes.trim(),
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <User className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            IDENTITY & PROFILE
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Account Information
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
            Display Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={disabled}
              className="w-full px-3.5 py-2.5 bg-[#FFF2DB]/40 border border-[#1C1917]/20 rounded-xl font-sans text-sm text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* Email Address (read only) */}
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
            Registered Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-3.5 py-2.5 bg-[#1C1917]/5 border border-[#1C1917]/10 rounded-xl font-mono text-xs text-[#78716C] cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
            Phone Number (SMS Escalations)
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={disabled}
              className="w-full px-3.5 py-2.5 bg-[#FFF2DB]/40 border border-[#1C1917]/20 rounded-xl font-mono text-sm text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Emergency Medical / Travel Note */}
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
            Emergency Health / Medical Note
          </label>
          <input
            type="text"
            value={emergencyNotes}
            onChange={(e) => setEmergencyNotes(e.target.value)}
            disabled={disabled}
            className="w-full px-3.5 py-2.5 bg-[#FFF2DB]/40 border border-[#1C1917]/20 rounded-xl font-sans text-xs text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
            placeholder="e.g. Blood Type O+, Asthma inhaler in bag"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-[#1C1917]/10">
        <span className="font-mono text-[11px] text-[#78716C]">
          {savedToast ? 'Changes saved.' : 'Encrypted with user session identity'}
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-xl font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
        >
          {savedToast && <Check className="w-4 h-4 text-emerald-400" />}
          <span>SAVE ACCOUNT DETAILS</span>
        </button>
      </div>
    </div>
  );
};
