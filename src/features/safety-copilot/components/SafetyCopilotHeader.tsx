// SakhiShield — Safety Copilot Header
// Matches standard SakhiShield header layout and styling tokens

import React from 'react';
import { Sparkles, RefreshCw, Trash2, Wifi, WifiOff } from 'lucide-react';
import type { SafetyContext } from '../types/safetyCopilot.types';

interface SafetyCopilotHeaderProps {
  context: SafetyContext;
  onRefresh: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const SafetyCopilotHeader: React.FC<SafetyCopilotHeaderProps> = ({
  context,
  onRefresh,
  onClear,
  isLoading,
}) => {
  const isOnline = context.monitoring?.networkOnline !== false;
  const isJourneyLive = Boolean(context.journey && context.journey.isLive);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1C1917]/10">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#FFE5BF] text-[#1C1917] flex items-center justify-center border border-[#1C1917]/10 shadow-2xs">
          <Sparkles className="w-5 h-5 text-[#1C1917]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sans font-bold text-base sm:text-lg text-[#1C1917] leading-tight">
              Safety Copilot
            </h2>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#FFE5BF] text-[#1C1917] font-bold">
              {isJourneyLive ? 'TRANSIT MONITORING' : 'STATIONARY GUARD'}
            </span>
          </div>
          <p className="font-sans text-xs text-[#78716C] leading-normal mt-0.5">
            Grounded safety intelligence • Telemetry verified
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Network indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
          title={isOnline ? 'Network Online' : 'Network Offline (Offline Rule Engine Active)'}
        >
          {isOnline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
          <span className="text-[11px] hidden sm:inline">{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
        </div>

        {/* Refresh context */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="px-2.5 py-1.5 rounded-xl border border-[#1C1917]/10 bg-white/70 text-xs font-mono font-semibold text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Refresh Safety Context"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">REFRESH</span>
        </button>

        {/* Clear chat */}
        <button
          type="button"
          onClick={onClear}
          className="px-2.5 py-1.5 rounded-xl border border-[#1C1917]/10 bg-white/70 text-xs font-mono font-semibold text-[#57534E] hover:text-[#F62440] hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CLEAR</span>
        </button>
      </div>
    </div>
  );
};
