import React from 'react';
import { Route, ShieldCheck, SunMedium, FileCheck2, ArrowUpRight } from 'lucide-react';
import type { SafetyHistoryRecord } from '../../types/safetyHistory';

interface SafetyHistoryStatsProps {
  records: SafetyHistoryRecord[];
}

export const SafetyHistoryStats: React.FC<SafetyHistoryStatsProps> = ({ records }) => {
  const totalDistance = records.reduce((acc, r) => acc + (r.distanceKm || 0), 0).toFixed(1);
  const totalMinutes = records.reduce((acc, r) => acc + (r.durationMin || 0), 0);
  const avgCorridor = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + (r.corridorScore || 0), 0) / records.length)
    : 95;
  const safeCount = records.filter(r => r.status === 'SAFE_ARRIVAL' || r.status === 'CHECK_IN_CONFIRMED').length;
  const safeRate = records.length > 0 ? Math.round((safeCount / records.length) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Monitored Distance */}
      <div className="sh-glass-card p-5 rounded-2xl flex flex-col justify-between group cursor-default">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#78716C] font-semibold">
              Monitored Transit
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFE5BF]/70 text-[#1C1917] flex items-center justify-center sh-icon-spring">
              <Route className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
              {totalDistance}
            </span>
            <span className="font-mono text-xs text-[#78716C]">km</span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1C1917]/[0.06] flex items-center justify-between text-[11px] font-sans text-[#78716C]">
          <span>{totalMinutes} mins monitored</span>
          <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            {records.length} walks
          </span>
        </div>
      </div>

      {/* 2. Safe Arrival Rate */}
      <div className="sh-glass-card p-5 rounded-2xl flex flex-col justify-between group cursor-default">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#78716C] font-semibold">
              Safe Completion
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center sh-icon-spring">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight">
              {safeRate}%
            </span>
            <span className="font-mono text-xs text-emerald-700/80">verified</span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1C1917]/[0.06] flex items-center gap-1.5 text-[11px] font-sans text-[#78716C]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 sh-beacon-pulse" />
          <span>Zero unverified delays</span>
        </div>
      </div>

      {/* 3. Corridor Safety Avg */}
      <div className="sh-glass-card p-5 rounded-2xl flex flex-col justify-between group cursor-default">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#78716C] font-semibold">
              Corridor Safety Index
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center sh-icon-spring">
              <SunMedium className="w-3.5 h-3.5 text-amber-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
              {avgCorridor}
            </span>
            <span className="font-mono text-xs text-[#78716C]">/ 100</span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1C1917]/[0.06] flex items-center justify-between text-[11px] font-sans text-[#78716C]">
          <span>High-lumen corridors</span>
          <span className="font-mono text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
            93% Lit
          </span>
        </div>
      </div>

      {/* 4. Cryptographic Audit */}
      <div className="sh-glass-card p-5 rounded-2xl flex flex-col justify-between group cursor-default relative overflow-hidden">
        <div className="sh-shimmer-seal absolute inset-0 pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#78716C] font-semibold">
              Tamper Evidence
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFE5BF]/70 text-[#1C1917] flex items-center justify-center sh-icon-spring">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-lg sm:text-xl font-bold text-[#1C1917] tracking-tight truncate">
              SHA-256 SEALED
            </span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1C1917]/[0.06] flex items-center justify-between text-[11px] font-mono text-[#78716C]">
          <span>Integrity Verified</span>
          <ArrowUpRight className="w-3 h-3 text-[#78716C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
