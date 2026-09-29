// SakhiShield — Help & Safety Resources Master Dashboard
// Centralizes verified national helplines, interactive safety guides, emergency dialing, and architectural FAQs.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, BookOpen, HelpCircle, WifiOff, ShieldCheck } from 'lucide-react';
import { useSafetyResources } from '../hooks/useSafetyResources';
import { EmergencyQuickDialCard } from './EmergencyQuickDialCard';
import { ResourceSearchFilter } from './ResourceSearchFilter';
import { ResourceCard } from './ResourceCard';
import { SafetyGuidesSection } from './SafetyGuidesSection';
import { FAQSection } from './FAQSection';

type ActiveViewTab = 'helplines' | 'guides' | 'faqs';

export const HelpDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('helplines');
  const {
    resources,
    filteredResources,
    guides,
    faqs,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useSafetyResources();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Navigation Breadcrumb + Pipeline Status Badge */}
      <div className="flex items-center justify-between pb-1">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#57534E] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DASHBOARD</span>
        </Link>
        <span className="font-mono text-xs px-2.5 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917] font-bold">
          HELP CENTER PIPELINE
        </span>
      </div>

      {/* 2. Top Emergency Immediate Quick-Dial Banner */}
      <EmergencyQuickDialCard />

      {/* 3. Navigation View Switcher (Tabs) */}
      <div className="flex items-center gap-2 border-b border-[#1C1917]/15 pb-2">
        {[
          { id: 'helplines', label: '24/7 Helplines & Portals', icon: Phone, count: resources.length },
          { id: 'guides', label: 'Interactive Safety Guides', icon: BookOpen, count: guides.length },
          { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle, count: faqs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveViewTab)}
              className={`px-4 py-2.5 rounded-xl border font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold shadow-2xs'
                  : 'border-transparent text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFF2DB]/60'
              }`}
            >
              <Icon className="w-4 h-4 text-[#1C1917]" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#1C1917]/10 font-bold">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab 1: 24/7 Helplines & Portals Directory */}
      {activeTab === 'helplines' && (
        <div className="space-y-6">
          <ResourceSearchFilter
            category={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredResources.length}
          />

          {isLoading ? (
            <div className="p-8 text-center font-mono text-xs text-[#78716C]">
              Loading verified emergency directories...
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-8 text-center bg-[#FFF2DB]/30 border border-[#1C1917]/10 rounded-2xl font-mono text-xs text-[#78716C]">
              No verified resources match your query. Try a different keyword or category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Interactive Safety Guides */}
      {activeTab === 'guides' && (
        <SafetyGuidesSection guides={guides} />
      )}

      {/* 6. Tab 3: FAQs */}
      {activeTab === 'faqs' && (
        <FAQSection faqs={faqs} />
      )}

      {/* 7. Offline Availability Assurance Footer */}
      <div className="p-4 bg-[#FFF2DB]/50 border border-[#1C1917]/10 rounded-xl text-xs font-mono text-[#57534E] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>All national emergency phone numbers and guides are cached locally on this device.</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#78716C]">
          <WifiOff className="w-3.5 h-3.5" />
          <span>OFFLINE READY • ZERO INTERNET REQUIRED FOR 112/1091</span>
        </div>
      </div>
    </div>
  );
};
