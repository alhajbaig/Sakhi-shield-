// SakhiShield — Passkey & WebAuthn Manager Component

import React, { useState } from 'react';
import { Fingerprint, Plus, Trash2, ShieldCheck, AlertCircle, Laptop } from 'lucide-react';
import type { PasskeyCredentialInfo } from '../types/settings.types';
import { webAuthnService } from '../services/webAuthnService';

interface PasskeyManagerCardProps {
  passkeys: PasskeyCredentialInfo[];
  onRegisterPasskey: (label: string) => Promise<{ success: boolean; error?: string }>;
  onRemovePasskey: (id: string) => void;
  disabled?: boolean;
}

export const PasskeyManagerCard: React.FC<PasskeyManagerCardProps> = ({
  passkeys,
  onRegisterPasskey,
  onRemovePasskey,
  disabled,
}) => {
  const isWebAuthnSupported = webAuthnService.isSupported();
  const [newLabel, setNewLabel] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const res = await onRegisterPasskey(newLabel || 'Personal Device Passkey');
      if (res.success) {
        setNewLabel('');
        setShowInput(false);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
              WEBAUTHN & FIDO2
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
              Passkey Authentication
            </h3>
          </div>
        </div>

        {isWebAuthnSupported && !showInput && (
          <button
            type="button"
            onClick={() => setShowInput(true)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg text-xs font-mono font-bold hover:bg-[#333] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>REGISTER PASSKEY</span>
          </button>
        )}
      </div>

      <p className="font-sans text-xs text-[#57534E] leading-relaxed">
        Passkeys replace passwords with cryptographic public/private key pairs secured by device biometrics (Touch ID, Windows Hello, Face ID) or hardware security keys.
      </p>

      {/* WebAuthn Support Status Banner */}
      {!isWebAuthnSupported ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs font-sans text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">WebAuthn Unavailable in Current Browser</div>
            <div className="text-[11px] text-amber-800 mt-0.5">
              Your browser or environment does not expose the W3C Web Authentication API. To register passkeys, please use a modern browser on an HTTPS origin or localhost.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/70 border border-emerald-300/80 rounded-xl text-xs font-mono text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>WebAuthn API active & ready on this platform</span>
          </div>
          <span className="font-bold">{passkeys.length} REGISTERED</span>
        </div>
      )}

      {/* Inline Registration Form */}
      {showInput && (
        <div className="p-4 bg-[#FFF2DB]/60 border border-[#1C1917]/15 rounded-xl space-y-3">
          <div className="font-mono text-xs font-bold text-[#1C1917] uppercase">
            Register New Biometric Passkey
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. MacBook Touch ID, Windows Laptop"
              className="w-full px-3 py-2 bg-[#FFFAF3] border border-[#1C1917]/20 rounded-lg font-sans text-xs text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full sm:w-auto px-4 py-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isRegistering ? 'WAITING FOR TOUCH...' : 'PROMPT BIOMETRIC'}
              </button>
              <button
                type="button"
                onClick={() => setShowInput(false)}
                className="px-3 py-2 border border-[#1C1917]/20 rounded-lg font-mono text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passkeys List */}
      <div className="space-y-2">
        {passkeys.length === 0 ? (
          <div className="p-6 text-center bg-[#FFF2DB]/30 border border-[#1C1917]/10 rounded-xl font-mono text-xs text-[#78716C]">
            No passkeys registered yet on this device.
          </div>
        ) : (
          passkeys.map((pk) => (
            <div
              key={pk.id}
              className="p-3.5 bg-[#FFF2DB]/40 border border-[#1C1917]/15 rounded-xl flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFE5BF] border border-[#1C1917]/15 rounded-lg text-[#1C1917]">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono font-bold text-[#1C1917]">{pk.name}</div>
                  <div className="font-mono text-[10px] text-[#78716C]">
                    Created: {new Date(pk.createdAt).toLocaleDateString()} • {pk.authenticatorType || 'FIDO2'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemovePasskey(pk.id)}
                className="p-2 text-[#78716C] hover:text-[#F62440] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remove passkey"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
