// Walk With Me - Subtle Monitoring Health & System Capability Badge
// Renders calm, non-alarmist status showing GPS, Network, and Background capability

import React from 'react';
import type { MonitoringHealthStatus } from '../../types/safety';
import { ShieldCheck, AlertCircle, WifiOff, EyeOff } from 'lucide-react';

interface MonitoringHealthBadgeProps {
  health: MonitoringHealthStatus;
  isPassiveTab?: boolean;
}

export const MonitoringHealthBadge: React.FC<MonitoringHealthBadgeProps> = ({
  health,
  isPassiveTab = false,
}) => {
  if (isPassiveTab) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 font-mono text-[10px] text-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        <span>VIEWING MODE (PRIMARY TAB IS MONITORING)</span>
      </div>
    );
  }

  const { overall, userMessage } = health;

  let badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-900';
  let dotColor = 'bg-emerald-500 animate-pulse';
  let Icon = ShieldCheck;

  if (overall === 'DEGRADED') {
    badgeColor = 'bg-amber-50 border-amber-200 text-amber-900';
    dotColor = 'bg-amber-500';
    Icon = AlertCircle;
  } else if (overall === 'LIMITED' || overall === 'OFFLINE') {
    badgeColor = 'bg-stone-100 border-stone-300 text-stone-800';
    dotColor = 'bg-stone-500';
    Icon = health.network === 'OFFLINE' ? WifiOff : EyeOff;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-[10px] font-medium transition-colors shadow-2xs ${badgeColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <Icon className="w-3 h-3 shrink-0 opacity-75" />
      <span className="truncate max-w-xs sm:max-w-md">{userMessage}</span>
    </div>
  );
};
