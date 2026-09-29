// SakhiShield — Frequently Asked Questions Component

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { FAQItem } from '../types/resources.types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-2">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            TRANSPARENCY & CLARIFICATIONS
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Frequently Asked Questions
          </h3>
        </div>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq) => {
          const isExpanded = expandedFaqId === faq.id;

          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FFF2DB]/30 transition-colors"
              >
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917]">
                    {faq.category}
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C1917]">
                    {faq.question}
                  </h4>
                </div>

                <div className="p-1 text-[#78716C] hover:text-[#1C1917] rounded-lg shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-[#1C1917]/10 bg-[#FFF2DB]/20">
                  <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
