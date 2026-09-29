// SakhiShield — Interactive Safety Guides Component

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SafetyGuide } from '../types/resources.types';

interface SafetyGuidesSectionProps {
  guides: SafetyGuide[];
}

export const SafetyGuidesSection: React.FC<SafetyGuidesSectionProps> = ({ guides }) => {
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(guides[0]?.id || null);

  const toggleGuide = (id: string) => {
    setExpandedGuideId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-2">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            STANDARD OPERATING PROCEDURES
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Interactive Safety & Evidence Guides
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        {guides.map((guide) => {
          const isExpanded = expandedGuideId === guide.id;

          return (
            <div
              key={guide.id}
              className="rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs overflow-hidden transition-all"
            >
              {/* Collapsible Accordion Header */}
              <button
                type="button"
                onClick={() => toggleGuide(guide.id)}
                className="w-full p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FFF2DB]/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917]">
                      {guide.category}
                    </span>
                    <span className="font-mono text-[10px] text-[#78716C] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{guide.readTimeMinutes} min read</span>
                    </span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C1917]">
                    {guide.title}
                  </h4>
                  <p className="font-sans text-xs text-[#57534E]">
                    {guide.summary}
                  </p>
                </div>

                <div className="p-2 text-[#78716C] hover:text-[#1C1917] rounded-lg shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Step-by-Step Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#1C1917]/10 bg-[#FFF2DB]/20 space-y-4">
                  <div className="space-y-3 pt-2">
                    {guide.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3.5 bg-[#FFFAF3] border border-[#1C1917]/10 rounded-xl flex items-start gap-3 text-xs"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#1C1917] text-[#FFFAF3] font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                          {step.stepNumber}
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-[#1C1917] font-mono">
                            {step.title}
                          </div>
                          <p className="font-sans text-[#57534E] leading-relaxed">
                            {step.instruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cross-Link To Real SakhiShield Feature */}
                  {guide.relatedFeatureUrl && (
                    <div className="pt-2 flex justify-end">
                      <Link
                        to={guide.relatedFeatureUrl}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors"
                      >
                        <span>{guide.relatedFeatureLabel || 'Open Feature'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
