// SakhiShield — Security & Credentials Settings Card

import React, { useState } from 'react';
import { KeyRound, Check, Mail } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';

interface SecuritySettingsCardProps {
  onUpdatePin: (pin: string) => Promise<boolean>;
  disabled?: boolean;
}

export const SecuritySettingsCard: React.FC<SecuritySettingsCardProps> = ({
  onUpdatePin,
  disabled,
}) => {
  const { user, forgotPassword } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetNotice, setPasswordResetNotice] = useState<string | null>(null);

  const handleSavePin = async () => {
    setPinError(null);
    if (!/^\d{4,6}$/.test(pin)) {
      setPinError('PIN must be 4 to 6 numeric digits.');
      return;
    }
    if (pin !== confirmPin) {
      setPinError('PINs do not match.');
      return;
    }

    const ok = await onUpdatePin(pin);
    if (ok) {
      setPinSuccess(true);
      setPin('');
      setConfirmPin('');
      setTimeout(() => setPinSuccess(false), 3500);
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!user?.email) return;
    setIsResettingPassword(true);
    setPasswordResetNotice(null);
    try {
      const res = await forgotPassword(user.email);
      if (res.success) {
        setPasswordResetNotice(`Password reset instructions dispatched to ${user.email}.`);
      } else {
        setPasswordResetNotice(res.error || 'Failed to dispatch password reset.');
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            CREDENTIALS & ACCESS
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Security & Authentication
          </h3>
        </div>
      </div>

      {/* Section 1: Security PIN */}
      <div className="space-y-3">
        <div>
          <div className="font-mono text-xs font-bold text-[#1C1917] uppercase tracking-wider">
            Quick-Action Security PIN
          </div>
          <p className="font-sans text-xs text-[#57534E]">
            Used to authorize sensitive vault actions, decrypt local records, and stand down false-alarm emergency SOS alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          <div>
            <label className="font-mono text-[11px] text-[#78716C] block mb-1">
              New 4-6 Digit PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              disabled={disabled}
              className="w-full px-3.5 py-2.5 bg-[#FFF2DB]/40 border border-[#1C1917]/20 rounded-xl font-mono text-center tracking-widest text-base text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] text-[#78716C] block mb-1">
              Confirm PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              disabled={disabled}
              className="w-full px-3.5 py-2.5 bg-[#FFF2DB]/40 border border-[#1C1917]/20 rounded-xl font-mono text-center tracking-widest text-base text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
            />
          </div>
        </div>

        {pinError && (
          <div className="font-mono text-xs text-red-600 font-bold">{pinError}</div>
        )}

        {pinSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-mono text-emerald-900 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Security PIN successfully updated.</span>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleSavePin}
            disabled={disabled || !pin}
            className="px-4 py-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-40"
          >
            UPDATE SECURITY PIN
          </button>
        </div>
      </div>

      {/* Section 2: Password Management */}
      <div className="pt-4 border-t border-[#1C1917]/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-bold text-[#1C1917] uppercase tracking-wider">
              Account Password
            </div>
            <p className="font-sans text-xs text-[#57534E]">
              Registered to <span className="font-mono font-bold text-[#1C1917]">{user?.email}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequestPasswordReset}
            disabled={disabled || isResettingPassword}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#1C1917]/20 rounded-lg text-xs font-mono font-bold text-[#1C1917] hover:bg-[#FFF2DB] transition-colors cursor-pointer shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>{isResettingPassword ? 'SENDING LINK...' : 'SEND PASSWORD RESET LINK'}</span>
          </button>
        </div>

        {passwordResetNotice && (
          <div className="p-3 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-xl text-xs font-mono text-[#1C1917]">
            {passwordResetNotice}
          </div>
        )}
      </div>
    </div>
  );
};
