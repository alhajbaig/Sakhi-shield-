// SakhiShield — Safety Context Card
// Displays authoritative ground-truth context: active journey, risk metrics, and circle status

import React from 'react';
import { Navigation, ShieldAlert, ShieldCheck, Users, Clock, AlertTriangle } from 'lucide-react';
import type { SafetyContext } from '../types/safetyCopilot.types';

interface SafetyContextCardProps {
  context: SafetyContext;
  onActionClick?: (actionType: string) => void;
}

export const SafetyContextCard: React.FC<SafetyContextCardProps> = ({ context }) => {
  const journey = context.journey;
  const risk = context.risk;
  const checkIn = context.checkIn;
  const trustedCircle = context.trustedCircle;

  const isLive = Boolean(journey && journey.isLive);
  const riskScore = risk?.score ?? 10;
  const riskLevel = risk?.level ?? 'SAFE';

  const riskBadgeStyles: Record<string, string> = {
    SAFE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    ATTENTION: 'bg-amber-100 text-amber-800 border-amber-200',
    HIGH_RISK: 'bg-orange-100 text-orange-800 border-orange-200',
    CRITICAL: 'bg-[#FEE2E2] text-[#F62440] border-[#F62440]/30',
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[#1C1917]/12 bg-[#FFFAF3] shadow-xs space-y-4">
      {/* Top Status Strip */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1917]">
            LIVE SAFETY TELEMETRY
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${riskBadgeStyles[riskLevel] || 'bg-stone-100 text-stone-800 border-stone-200'}`}>
          {riskLevel} • {riskScore}/100
        </div>
      </div>

      {/* Grid of Key Context Signals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Transit Status */}
        <div className="p-3 rounded-xl bg-white/70 border border-[#1C1917]/8 space-y-1">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-[#1C1917]" />
            <span>Transit Mode</span>
          </div>
          <div className="font-sans font-bold text-[#1C1917] truncate">
            {isLive ? `Walking to ${journey?.destination}` : 'Stationary Monitoring'}
          </div>
          {isLive && journey?.etaMinutes && (
            <div className="font-mono text-[11px] text-[#57534E]">
              ETA: ~{journey.etaMinutes} mins remaining
            </div>
          )}
        </div>

        {/* Check-In / Anomaly Milestone */}
        <div className="p-3 rounded-xl bg-white/70 border border-[#1C1917]/8 space-y-1">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#1C1917]" />
            <span>Check-in State</span>
          </div>
          <div className="font-sans font-bold text-[#1C1917]">
            {checkIn?.isPending ? (
              <span className="text-[#F62440] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Pending ({checkIn.timeRemainingSeconds ?? 30}s)
              </span>
            ) : isLive ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified & On Schedule
              </span>
            ) : (
              'Standby (Inactive)'
            )}
          </div>
          <div className="font-mono text-[11px] text-[#78716C]">
            {checkIn?.isPending ? 'Confirmation requested' : 'Periodic timer running'}
          </div>
        </div>

        {/* Trusted Circle */}
        <div className="p-3 rounded-xl bg-white/70 border border-[#1C1917]/8 space-y-1">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3 h-3 text-[#1C1917]" />
            <span>Trusted Circle</span>
          </div>
          <div className="font-sans font-bold text-[#1C1917]">
            {trustedCircle?.configured
              ? `${trustedCircle.memberCount} Guardian(s) Linked`
              : 'Not Configured'}
          </div>
          <div className="font-mono text-[11px] text-[#78716C] truncate">
            {trustedCircle?.activeGuardianNames && trustedCircle.activeGuardianNames.length > 0
              ? trustedCircle.activeGuardianNames.join(', ')
              : 'Ready for emergency relay'}
          </div>
        </div>

        {/* Active Signals Breakdown */}
        <div className="p-3 rounded-xl bg-white/70 border border-[#1C1917]/8 space-y-1">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-[#1C1917]" />
            <span>Active Signals</span>
          </div>
          <div className="font-sans font-bold text-[#1C1917]">
            {risk?.activeSignals && risk.activeSignals.length > 0
              ? `${risk.activeSignals.length} Anomaly Signal(s)`
              : 'Zero Anomalies'}
          </div>
          <div className="font-mono text-[11px] text-[#78716C] truncate">
            {risk?.activeSignals && risk.activeSignals.length > 0
              ? risk.activeSignals.join(', ')
              : 'Baseline telemetry normal'}
          </div>
        </div>
      </div>
    </div>
  );
};
