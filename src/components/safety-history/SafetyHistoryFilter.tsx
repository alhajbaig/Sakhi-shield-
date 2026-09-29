import React from 'react';
import { Search, X, SlidersHorizontal, Navigation, Clock, AlertTriangle } from 'lucide-react';
import type { SafetyHistoryFilterState, HistoryCategory } from '../../types/safetyHistory';

interface SafetyHistoryFilterProps {
  filters: SafetyHistoryFilterState;
  onFilterChange: (filters: SafetyHistoryFilterState) => void;
  counts: {
    all: number;
    walkWithMe: number;
    checkIn: number;
    alerts: number;
  };
}

export const SafetyHistoryFilter: React.FC<SafetyHistoryFilterProps> = ({
  filters,
  onFilterChange,
  counts,
}) => {
  const categories: { id: HistoryCategory; label: string; count: number; icon: any }[] = [
    { id: 'ALL', label: 'All Records', count: counts.all, icon: SlidersHorizontal },
    { id: 'WALK_WITH_ME', label: 'Walk With Me', count: counts.walkWithMe, icon: Navigation },
    { id: 'CHECK_IN', label: 'Check-in Milestones', count: counts.checkIn, icon: Clock },
    { id: 'SOS_ESCALATION', label: 'SOS & Alerts', count: counts.alerts, icon: AlertTriangle },
  ];

  const handleCategoryChange = (category: HistoryCategory) => {
    onFilterChange({ ...filters, category });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleDateRangeChange = (dateRange: SafetyHistoryFilterState['dateRange']) => {
    onFilterChange({ ...filters, dateRange });
  };

  const handleStatusChange = (status: SafetyHistoryFilterState['status']) => {
    onFilterChange({ ...filters, status });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: 'ALL',
      searchQuery: '',
      dateRange: 'ALL',
      status: 'ALL',
    });
  };

  const hasActiveFilters =
    filters.category !== 'ALL' ||
    filters.searchQuery.trim() !== '' ||
    filters.dateRange !== 'ALL' ||
    filters.status !== 'ALL';

  return (
    <div className="space-y-3.5">
      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = filters.category === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`sh-pill-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-semibold cursor-pointer ${
                isSelected
                  ? 'bg-[#1C1917] text-[#FFFAF3] shadow-xs'
                  : 'bg-white/70 hover:bg-[#FFE5BF]/50 text-[#57534E] hover:text-[#1C1917] border border-[#1C1917]/[0.08]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FFFAF3]' : 'text-[#78716C]'}`} />
              <span>{cat.label}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-[#FFFAF3]' : 'bg-[#1C1917]/[0.06] text-[#78716C]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Controls */}
      <div className="sh-glass-card p-3 rounded-2xl flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by destination, corridor, or record ID..."
            className="w-full pl-9 pr-8 py-2 bg-white/70 border border-[#1C1917]/[0.08] hover:border-[#1C1917]/20 rounded-xl text-xs font-sans text-[#1C1917] placeholder-[#78716C]/70 focus:outline-none focus:border-[#1C1917] focus:bg-white transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group (Date Range & Status) */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filters.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value as any)}
            className="px-3 py-2 bg-white/70 border border-[#1C1917]/[0.08] hover:border-[#1C1917]/20 rounded-xl text-xs font-sans text-[#1C1917] focus:outline-none focus:border-[#1C1917] cursor-pointer transition-all"
          >
            <option value="ALL">All Time</option>
            <option value="7_DAYS">Last 7 Days</option>
            <option value="30_DAYS">Last 30 Days</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="px-3 py-2 bg-white/70 border border-[#1C1917]/[0.08] hover:border-[#1C1917]/20 rounded-xl text-xs font-sans text-[#1C1917] focus:outline-none focus:border-[#1C1917] cursor-pointer transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="SAFE_ARRIVAL">Safe Arrivals</option>
            <option value="RESOLVED_STAND_DOWN">Resolved Stand-downs</option>
            <option value="CHECK_IN_CONFIRMED">Check-ins Confirmed</option>
            <option value="ALERT_CLEARED">Alerts Cleared</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-[#F62440] hover:bg-red-50/80 border border-red-200/80 transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
