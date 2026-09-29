// SakhiShield — Resource Card Component

import React, { useState } from 'react';
import { Phone, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import type { SafetyResource } from '../types/resources.types';

interface ResourceCardProps {
  resource: SafetyResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (resource.phone && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(resource.phone).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs hover:border-[#1C1917]/30 transition-colors flex flex-col justify-between gap-4">
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917] font-bold">
            {resource.category.replace('_', ' ')}
          </span>

          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>OFFICIAL SOURCE</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-serif text-lg font-bold text-[#1C1917] leading-snug">
          {resource.title}
        </h4>

        {/* Description */}
        <p className="font-sans text-xs text-[#57534E] leading-relaxed">
          {resource.description}
        </p>

        {/* Source citation */}
        <div className="font-mono text-[10px] text-[#78716C] pt-1 border-t border-[#1C1917]/10 flex items-center justify-between">
          <span>Source: {resource.source}</span>
          <span>{resource.availability}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between gap-2 flex-wrap">
        {resource.phone ? (
          <div className="flex items-center gap-2">
            <a
              href={`tel:${resource.phone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>CALL {resource.phone}</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 border border-[#1C1917]/20 rounded-lg text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFF2DB] transition-colors cursor-pointer"
              title="Copy number to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="text-xs font-mono text-[#78716C]">Online Portal Only</div>
        )}

        {resource.website && (
          <a
            href={resource.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <span>VISIT PORTAL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
