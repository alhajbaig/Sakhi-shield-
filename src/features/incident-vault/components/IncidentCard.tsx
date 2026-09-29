// SakhiShield — Incident Card Component
// Displays an incident record in the master list matching SakhiShield design tokens.

import React from 'react';
import type { IncidentRecord } from '../types';
import { INCIDENT_CATEGORIES_CONFIG, INCIDENT_SEVERITY_CONFIG } from '../constants/incidentVault.constants';
import { Calendar, MapPin, Paperclip, ChevronRight } from 'lucide-react';

interface IncidentCardProps {
  incident: IncidentRecord;
  isSelected: boolean;
  onSelect: (incident: IncidentRecord) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  isSelected,
  onSelect,
}) => {
  const catConfig = INCIDENT_CATEGORIES_CONFIG[incident.category] || INCIDENT_CATEGORIES_CONFIG.OTHER;
  const sevConfig = INCIDENT_SEVERITY_CONFIG[incident.severity] || INCIDENT_SEVERITY_CONFIG.LOW;

  return (
    <div
      onClick={() => onSelect(incident)}
      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
        isSelected
          ? 'bg-[#FFF2DB] border-[#1C1917] shadow-xs'
          : 'bg-white border-[#1C1917]/10 hover:border-[#1C1917]/30 hover:bg-[#FFFAF3]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${catConfig.badgeColor}`}>
            {catConfig.label}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${sevConfig.color}`}>
            {sevConfig.label}
          </span>
        </div>

        <h3 className="font-serif text-base font-bold text-[#1C1917] line-clamp-1 mb-1">
          {incident.title}
        </h3>

        <p className="font-sans text-xs text-[#57534E] line-clamp-2 leading-relaxed">
          {incident.description}
        </p>
      </div>

      <div className="pt-2.5 border-t border-[#1C1917]/10 flex items-center justify-between text-[11px] font-mono text-[#78716C]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#A8A29E]" />
            {new Date(incident.incidentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>

          {incident.location?.name && (
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <MapPin className="w-3 h-3 text-[#A8A29E]" />
              {incident.location.name}
            </span>
          )}

          <span className="flex items-center gap-1">
            <Paperclip className="w-3 h-3 text-[#A8A29E]" />
            {incident.evidenceCount}
          </span>
        </div>

        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-[#1C1917]' : 'text-[#A8A29E]'}`} />
      </div>
    </div>
  );
};
