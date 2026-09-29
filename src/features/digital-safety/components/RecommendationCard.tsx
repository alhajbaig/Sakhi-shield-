// SakhiShield — Security Recommendations Card
// Lists prioritized, actionable items with direct navigation triggers.

import React from 'react';
import type { SecurityRecommendation } from '../types';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendationCardProps {
  recommendations: SecurityRecommendation[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations }) => {
  const navigate = useNavigate();

  const handleAction = (rec: SecurityRecommendation) => {
    if (rec.actionType === 'NAVIGATE' && rec.target) {
      navigate(rec.target);
    } else if (rec.target === 'FOCUS_PASSWORD_TOOL') {
      const el = document.querySelector('input[type="password"]') as HTMLInputElement;
      el?.focus();
    } else if (rec.target === 'FOCUS_LINK_TOOL') {
      const el = document.querySelector('input[placeholder*="Paste any link"]') as HTMLInputElement;
      el?.focus();
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
            REMEDIATION ROADMAP
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
            Actionable Recommendations
          </h2>
        </div>
        <span className="font-mono text-xs text-[#78716C]">
          {recommendations.length} Action{recommendations.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border border-[#1C1917]/10 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                rec.priority === 'critical' ? 'text-red-600' : rec.priority === 'high' ? 'text-amber-600' : 'text-[#78716C]'
              }`} />
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#78716C] block">
                  PRIORITY: {rec.priority}
                </span>
                <h4 className="font-mono text-xs font-bold text-[#1C1917]">
                  {rec.title}
                </h4>
                <p className="font-sans text-xs text-[#57534E] mt-0.5 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAction(rec)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1C1917] text-[#FFFAF3] font-mono text-[11px] font-bold hover:bg-[#333] transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>{rec.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
