import React, { useState, useMemo, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, FileText } from 'lucide-react';
import gsap from 'gsap';
import { AppShell } from '../components/app/AppShell';
import { SafetyHistoryStats } from '../components/safety-history/SafetyHistoryStats';
import { SafetyHistoryFilter } from '../components/safety-history/SafetyHistoryFilter';
import { SafetyHistoryCard } from '../components/safety-history/SafetyHistoryCard';
import { SafetyHistoryDetailModal } from '../components/safety-history/SafetyHistoryDetailModal';
import { SafetyInsightsCard } from '../components/safety-history/SafetyInsightsCard';
import { safetyHistoryService } from '../services/safetyHistoryService';
import type { SafetyHistoryRecord, SafetyHistoryFilterState } from '../types/safetyHistory';
import '../components/safety-history/SafetyHistory.css';

export const SafetyHistoryPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [records, setRecords] = useState<SafetyHistoryRecord[]>(() =>
    safetyHistoryService.getAllRecords()
  );

  const [selectedRecord, setSelectedRecord] = useState<SafetyHistoryRecord | null>(null);

  const [filters, setFilters] = useState<SafetyHistoryFilterState>({
    category: 'ALL',
    searchQuery: '',
    dateRange: 'ALL',
    status: 'ALL',
  });

  // Silky GSAP staggered entrance on mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sh-stagger-item',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const filteredRecords = useMemo(() => {
    return safetyHistoryService.filterRecords(records, filters);
  }, [records, filters]);

  const counts = useMemo(() => {
    return {
      all: records.length,
      walkWithMe: records.filter((r) => r.category === 'WALK_WITH_ME').length,
      checkIn: records.filter((r) => r.category === 'CHECK_IN').length,
      alerts: records.filter(
        (r) => r.category === 'SOS_ESCALATION' || r.category === 'CORRIDOR_ALERT'
      ).length,
    };
  }, [records]);

  const handleRefresh = () => {
    setRecords(safetyHistoryService.getAllRecords());
  };

  const handleExportAll = () => {
    const toExport = filteredRecords.length > 0 ? filteredRecords : records;
    if (toExport.length === 0) return;
    safetyHistoryService.exportAllDossierReports(toExport);
  };

  return (
    <AppShell
      title="Safety History & Audit"
      subtitle="Cryptographically verified telemetry, past safe corridors, check-in milestones, and emergency logs"
    >
      <div ref={containerRef} className="sh-container space-y-6 sm:space-y-8 select-none">
        {/* Top Breadcrumb & Action Row */}
        <div className="sh-stagger-item flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1C1917]/[0.08]">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO SAFETY OVERVIEW</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-xl border border-[#1C1917]/[0.1] bg-white/70 text-xs font-mono font-semibold text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Refresh Telemetry Log"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">REFRESH</span>
            </button>

            <button
              type="button"
              onClick={handleExportAll}
              className="px-3.5 py-1.5 rounded-xl bg-[#1C1917] text-[#FFFAF3] text-xs font-mono font-bold hover:bg-[#F62440] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3 h-3" />
              <span>EXPORT DOSSIER</span>
            </button>
          </div>
        </div>

        {/* Level 1: Executive KPI Metrics Strip */}
        <div className="sh-stagger-item">
          <SafetyHistoryStats records={records} />
        </div>

        {/* Level 2: Corridor Intelligence & Pattern Visualizer */}
        <div className="sh-stagger-item">
          <SafetyInsightsCard />
        </div>

        {/* Level 3: Interactive Filter & Search Bar */}
        <div className="sh-stagger-item">
          <SafetyHistoryFilter
            filters={filters}
            onFilterChange={setFilters}
            counts={counts}
          />
        </div>

        {/* Level 4: Journey Timeline & History Feed */}
        <div className="sh-stagger-item space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                AUDIT TRAIL LOGS
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#FFE5BF] text-[#1C1917] font-bold">
                {filteredRecords.length} {filteredRecords.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#78716C] hidden sm:inline">
              Sorted by Recency
            </span>
          </div>

          {filteredRecords.length > 0 ? (
            <div className="space-y-3.5">
              {filteredRecords.map((record) => (
                <SafetyHistoryCard
                  key={record.id}
                  record={record}
                  onSelect={(rec) => setSelectedRecord(rec)}
                />
              ))}
            </div>
          ) : (
            <div className="sh-glass-card p-8 sm:p-12 text-center rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE5BF]/60 text-[#1C1917] flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5 text-[#78716C]" />
              </div>
              <h4 className="font-sans font-bold text-base text-[#1C1917]">
                No Safety Records Match Your Filter
              </h4>
              <p className="font-sans text-xs text-[#78716C] max-w-md mx-auto">
                Try searching with different terms, selecting another category tab, or clearing your active date range filters.
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    category: 'ALL',
                    searchQuery: '',
                    dateRange: 'ALL',
                    status: 'ALL',
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#1C1917] text-[#FFFAF3] text-xs font-mono font-bold hover:bg-[#F62440] transition-colors inline-block mt-2 cursor-pointer shadow-xs"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Level 5: Forensic Detail Modal */}
      <SafetyHistoryDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </AppShell>
  );
};

export default SafetyHistoryPage;
