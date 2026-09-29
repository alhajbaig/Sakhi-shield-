// SakhiShield — Resource Search & Category Filter Component

import React from 'react';
import { Search, X } from 'lucide-react';
import type { ResourceCategory } from '../types/resources.types';
import { RESOURCE_CATEGORIES } from '../constants/resources.constants';

interface ResourceSearchFilterProps {
  category: ResourceCategory;
  onSelectCategory: (cat: ResourceCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
}

export const ResourceSearchFilter: React.FC<ResourceSearchFilterProps> = ({
  category,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by emergency name, keyword (e.g. cyber, women, legal), or number..."
          className="w-full pl-10 pr-10 py-3 bg-[#FFFAF3] border border-[#1C1917]/20 rounded-xl font-sans text-xs sm:text-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-hidden focus:border-[#1C1917] shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#78716C] hover:text-[#1C1917] rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {RESOURCE_CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[#1C1917] bg-[#1C1917] text-[#FFFAF3] font-bold shadow-xs'
                  : 'border-[#1C1917]/15 bg-[#FFF2DB]/50 text-[#57534E] hover:bg-[#FFF2DB] hover:text-[#1C1917]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] pt-1">
        <span>Showing {totalCount} verified safety resources</span>
        <span>GOVERNMENT & INSTITUTIONAL SOURCES ONLY</span>
      </div>
    </div>
  );
};
