// SakhiShield — Session Management Card Component

import React, { useState } from 'react';
import { Shield, LogOut, Laptop, CheckCircle2 } from 'lucide-react';
import type { SessionInfo } from '../types/settings.types';
import { useAuth } from '../../../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SessionManagerCardProps {
  sessionInfo: SessionInfo | null;
}

export const SessionManagerCard: React.FC<SessionManagerCardProps> = ({ sessionInfo }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            DEVICE ACCESS & SESSIONS
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Active Browser Session
          </h3>
        </div>
      </div>

      {sessionInfo && (
        <div className="p-4 bg-[#FFF2DB]/40 border border-[#1C1917]/15 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFE5BF] border border-[#1C1917]/15 rounded-xl text-[#1C1917]">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1C1917]">
                  {sessionInfo.browser} on {sessionInfo.os}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>THIS DEVICE</span>
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#78716C] mt-0.5">
                Session verified • Last active: {new Date(sessionInfo.lastActive).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-300 rounded-lg font-mono text-xs font-bold text-[#F62440] hover:bg-red-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isSigningOut ? 'SIGNING OUT...' : 'SIGN OUT OF SAKHISHIELD'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
