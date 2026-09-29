import React from 'react';
import {
  Navigation,
  Train,
  Car,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Users,
  SunMedium,
  Download,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import type { SafetyHistoryRecord, TransitMode, HistoryStatus } from '../../types/safetyHistory';
import { safetyHistoryService } from '../../services/safetyHistoryService';

interface SafetyHistoryCardProps {
  record: SafetyHistoryRecord;
  onSelect: (record: SafetyHistoryRecord) => void;
}

export const SafetyHistoryCard: React.FC<SafetyHistoryCardProps> = ({ record, onSelect }) => {
  const getModeIcon = (mode: TransitMode) => {
    switch (mode) {
      case 'Walking':
        return Navigation;
      case 'Metro / Transit':
        return Train;
      case 'Cab / Ride':
        return Car;
      case 'Automated Check-in':
        return Clock;
      case 'Emergency Drill':
        return AlertTriangle;
      default:
        return Navigation;
    }
  };

  const getStatusBadge = (status: HistoryStatus) => {
    switch (status) {
      case 'SAFE_ARRIVAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 sh-beacon-pulse" />
            <span>SAFE ARRIVAL</span>
          </span>
        );
      case 'RESOLVED_STAND_DOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <ShieldCheck className="w-3 h-3 text-stone-600" />
            <span>STAND-DOWN CLEARED</span>
          </span>
        );
      case 'CHECK_IN_CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 sh-beacon-pulse" />
            <span>CHECK-IN VERIFIED</span>
          </span>
        );
      case 'ALERT_CLEARED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-50 text-amber-900 border border-amber-200/60">
            <ShieldAlert className="w-3 h-3 text-amber-700" />
            <span>ANOMALY CLEARED</span>
          </span>
        );
      default:
        return null;
    }
  };

  const ModeIcon = getModeIcon(record.transitMode);

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    safetyHistoryService.exportDossierReport(record);
  };

  return (
    <div
      onClick={() => onSelect(record)}
      className="sh-glass-card p-5 sm:p-6 rounded-2xl cursor-pointer group select-none"
    >
      {/* Top Metadata Row: Date, Time & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1C1917]/[0.06]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#1C1917]">
            {record.dateFormatted}
          </span>
          <span className="text-[#78716C]/40 text-xs">•</span>
          <span className="font-mono text-xs text-[#78716C]">
            {record.timeRange}
          </span>
          <span className="font-mono text-[10px] text-[#A8A29E] hidden sm:inline px-1.5 py-0.5 rounded bg-black/[0.03]">
            {record.id}
          </span>
        </div>

        <div>
          {getStatusBadge(record.status)}
        </div>
      </div>

      {/* Main Content: Title, Route & Transit Mode */}
      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE5BF]/60 text-[#1C1917] flex items-center justify-center shrink-0 sh-icon-spring border border-[#1C1917]/[0.06]">
              <ModeIcon className="w-4 h-4 text-[#1C1917]" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-[#1C1917] group-hover:text-[#F62440] transition-colors leading-tight">
                {record.title}
              </h3>
              <span className="font-mono text-[11px] text-[#78716C]">
                {record.transitMode}
              </span>
            </div>
          </div>

          {/* Route Breadcrumb Pins */}
          <div className="pl-12 space-y-1.5">
            <div className="flex items-center gap-2.5 text-xs font-sans text-[#57534E]">
              <span className="w-2 h-2 rounded-full border border-[#78716C] bg-white shrink-0" />
              <span className="truncate">{record.origin}</span>
            </div>
            <div className="w-0.5 h-2 bg-[#78716C]/20 ml-0.75" />
            <div className="flex items-center gap-2.5 text-xs font-sans font-semibold text-[#1C1917]">
              <span className="w-2 h-2 rounded-full bg-[#F62440] shrink-0 sh-track-node-dest" />
              <span className="truncate">{record.destination}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Snapshot Grid */}
        <div className="grid grid-cols-3 gap-3 shrink-0 p-3.5 bg-white/70 rounded-xl border border-[#1C1917]/[0.07] backdrop-blur-xs">
          <div className="text-center px-2">
            <div className="font-mono text-[10px] text-[#78716C] uppercase">Duration</div>
            <div className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] mt-0.5">
              {record.durationMin}m
            </div>
          </div>
          <div className="text-center px-2 border-x border-[#1C1917]/[0.07]">
            <div className="font-mono text-[10px] text-[#78716C] uppercase">Distance</div>
            <div className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] mt-0.5">
              {record.distanceKm}k
            </div>
          </div>
          <div className="text-center px-2">
            <div className="font-mono text-[10px] text-[#78716C] uppercase">Corridor</div>
            <div className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-0.5 flex items-center justify-center gap-0.5">
              <span>{record.corridorScore}</span>
              <span className="text-[10px] text-[#78716C]/80">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corridor & Guardian Footprint */}
      <div className="mt-4 pt-3 border-t border-[#1C1917]/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-[#78716C]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <SunMedium className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-sans text-[11px]">
              {record.corridorDetails.illuminationPct}% Lit Corridor
            </span>
          </div>
          <span className="text-[#A8A29E]/40">•</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#57534E]" />
            <span className="font-sans text-[11px]">
              {record.guardiansNotified.length} Guardians Synced
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            title="Download verified cryptographic dossier"
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <div className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#57534E] group-hover:text-[#F62440] transition-colors">
            <span>VIEW DOSSIER</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
