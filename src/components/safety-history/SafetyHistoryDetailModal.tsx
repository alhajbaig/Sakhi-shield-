import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Route,
  Clock,
  Users,
  FileCheck2,
  Printer,
} from 'lucide-react';
import type { SafetyHistoryRecord } from '../../types/safetyHistory';
import { safetyHistoryService } from '../../services/safetyHistoryService';

interface SafetyHistoryDetailModalProps {
  record: SafetyHistoryRecord | null;
  onClose: () => void;
}

export const SafetyHistoryDetailModal: React.FC<SafetyHistoryDetailModalProps> = ({
  record,
  onClose,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!record) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(record.cryptographicHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownload = () => {
    safetyHistoryService.exportDossierReport(record);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1C1917]/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-[#FFFAF3] rounded-3xl border border-[#1C1917]/15 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-[#1C1917]/10 flex items-start justify-between bg-[#FFF2DB]/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#F62440] uppercase tracking-wider">
                CRYPTOGRAPHIC AUDIT DOSSIER
              </span>
              <span className="text-[#78716C] text-xs">•</span>
              <span className="font-mono text-xs text-[#78716C]">
                {record.id}
              </span>
            </div>
            <h2 className="font-sans font-bold text-lg sm:text-xl text-[#1C1917]">
              {record.title}
            </h2>
            <div className="font-mono text-xs text-[#78716C]">
              {record.dateFormatted} • {record.timeRange}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-[#FFE5BF]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Executive Summary Note */}
          <div className="p-4 rounded-2xl bg-[#FFF2DB]/50 border border-[#1C1917]/10 space-y-2">
            <div className="font-mono text-[10px] tracking-wider uppercase text-[#78716C] font-bold">
              VERIFIED SUMMARY
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#1C1917] leading-relaxed">
              {record.summary}
            </p>
          </div>

          {/* Route & Corridor Metrics */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] tracking-wider uppercase text-[#78716C] font-bold flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>TRANSIT CORRIDOR & TELEMETRY</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-[#1C1917]/10 bg-white/70">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">Mode</span>
                <div className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] mt-0.5">
                  {record.transitMode}
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-[#1C1917]/10 bg-white/70">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">Distance</span>
                <div className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] mt-0.5">
                  {record.distanceKm} km
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-[#1C1917]/10 bg-white/70">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">Duration</span>
                <div className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] mt-0.5">
                  {record.durationMin} mins
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-[#1C1917]/10 bg-white/70">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">Safety Score</span>
                <div className="font-mono text-xs sm:text-sm font-bold text-emerald-700 mt-0.5">
                  {record.corridorScore} / 100
                </div>
              </div>
            </div>

            {/* Waypoints */}
            <div className="p-3.5 rounded-xl border border-[#1C1917]/10 bg-white/60 space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full border-2 border-[#78716C] bg-white shrink-0 mt-1" />
                <div>
                  <span className="font-mono text-[10px] text-[#78716C] block">DEPARTURE</span>
                  <span className="font-sans font-medium text-[#1C1917]">{record.origin}</span>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#78716C]/25 ml-1" />
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F62440] shrink-0 mt-1" />
                <div>
                  <span className="font-mono text-[10px] text-[#78716C] block">DESTINATION</span>
                  <span className="font-sans font-bold text-[#1C1917]">{record.destination}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Check-in Timeline */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] tracking-wider uppercase text-[#78716C] font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>TIMELINE & CHECK-IN MILESTONES</span>
            </div>

            <div className="space-y-2">
              {record.checkIns.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/70 border border-[#1C1917]/10 flex items-start gap-3 text-xs"
                >
                  <span className="font-mono font-bold text-[#F62440] shrink-0">
                    {item.time}
                  </span>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans font-bold text-[#1C1917]">
                        {item.label}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="font-sans text-[11px] text-[#78716C]">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guardians Reached */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] tracking-wider uppercase text-[#78716C] font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>GUARDIAN DELIVERY RECEIPTS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {record.guardiansNotified.map((guardian, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/70 border border-[#1C1917]/10 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-sans font-bold text-[#1C1917]">{guardian.name}</div>
                    <div className="font-mono text-[10px] text-[#78716C]">
                      {guardian.relationship} • {guardian.timestamp}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#FFE5BF] text-[#1C1917] font-semibold">
                    {guardian.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Telemetry & Cryptographic Seal */}
          <div className="p-4 rounded-2xl bg-[#FFF2DB]/40 border border-[#1C1917]/12 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] tracking-wider uppercase text-[#78716C] font-bold flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[#1C1917]" />
                <span>SHA-256 TAMPER-EVIDENT INTEGRITY DIGEST</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED HASH
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#1C1917] text-[#FFFAF3] font-mono text-[11px] break-all flex items-center justify-between gap-3">
              <span className="select-all">{record.cryptographicHash}</span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
                title="Copy SHA-256 Hash"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#78716C] pt-1">
              <span>Battery: {record.telemetry.avgBatteryPct}%</span>
              <span>GPS: ±{record.telemetry.gpsPrecisionMeters}m</span>
              <span>Network: {record.telemetry.networkReliability}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-[#1C1917]/10 bg-[#FFF2DB]/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#78716C]">
            Legal evidence ready • Client-side signed
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-[#1C1917]/15 bg-white text-xs font-sans font-semibold text-[#1C1917] hover:bg-[#FFE5BF]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Record</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#1C1917] text-xs font-sans font-bold text-[#FFFAF3] hover:bg-[#F62440] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Dossier (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
