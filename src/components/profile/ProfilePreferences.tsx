import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { LogOut, KeyRound, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePreferences: React.FC = () => {
  const { user, updateUser } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [locationSharing, setLocationSharing] = useState(user.emergencyPreferences.locationSharing);
  const [retention, setRetention] = useState(user.emergencyPreferences.evidenceRetention);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = () => {
    updateUser({
      emergencyPreferences: {
        ...user.emergencyPreferences,
        locationSharing,
        evidenceRetention: retention,
      },
    });
    setToast('Privacy settings saved.');
    setTimeout(() => setToast(null), 3500);
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Privacy by Design */}
      <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
        <div className="pb-4 mb-5 border-b border-[#1C1917]/10">
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold">
            DATA SOVEREIGNTY
          </span>
          <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
            Privacy & Vault Settings
          </h3>
        </div>

        <div className="space-y-5">
          {/* Location Sharing */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
              Location Sharing Broadcast
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: 'Session Only', label: 'Active Session Only' },
                { id: 'Emergency Only', label: 'Confirmed SOS Only' },
                { id: 'Always Off', label: 'Strictly Local Offline' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLocationSharing(opt.id as any)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    locationSharing === opt.id
                      ? 'border-[#1C1917] bg-[#FFE5BF] font-bold text-[#1C1917]'
                      : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {locationSharing === opt.id && <Check className="w-4 h-4 text-[#F62440]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Evidence Retention */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
              Vault Evidence Retention Horizon
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: '7 Days', label: '7 Days Auto-Purge' },
                { id: '30 Days', label: '30 Days Standard' },
                { id: 'Until Deleted', label: 'Manual Deletion with PIN' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRetention(opt.id as any)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    retention === opt.id
                      ? 'border-[#1C1917] bg-[#FFE5BF] font-bold text-[#1C1917]'
                      : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {retention === opt.id && <Check className="w-4 h-4 text-[#F62440]" />}
                </button>
              ))}
            </div>
          </div>

          {toast && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-mono text-emerald-900 font-bold">
              {toast}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer"
            >
              SAVE PRIVACY RULES
            </button>
          </div>
        </div>
      </div>

      {/* Account Security & Sign Out */}
      <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
        <div className="pb-4 mb-4 border-b border-[#1C1917]/10">
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold">
            SECURITY & CREDENTIALS
          </span>
          <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
            Account Access
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => alert('PIN reset requested. Link sent to registered email.')}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#1C1917]/25 rounded-lg text-xs font-mono font-bold text-[#1C1917] hover:bg-[#FFF2DB] cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>CHANGE SECURITY PIN</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-300 text-[#F62440] rounded-lg text-xs font-mono font-bold hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT OF SAKHISHIELD</span>
          </button>
        </div>
      </div>

    </div>
  );
};
