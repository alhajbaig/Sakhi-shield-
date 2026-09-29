import React from 'react';
import { useApp } from '../../lib/AppContext';
import { Route, CheckCircle, FileWarning } from 'lucide-react';

export const SafetySnapshot: React.FC = () => {
  const { snapshot } = useApp();

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[#1C1917]/15 bg-[#FFF2DB]/50">
      <div className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold mb-3">
        SAFETY SNAPSHOT
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-[#FFFAF3] rounded-xl border border-[#1C1917]/10">
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#1C1917]">
            {snapshot.journeysCompleted}
          </div>
          <div className="font-sans text-xs text-[#57534E] mt-1 flex items-center justify-center gap-1">
            <Route className="w-3.5 h-3.5 text-[#1C1917]" />
            <span>Journeys</span>
          </div>
        </div>

        <div className="p-3 bg-[#FFFAF3] rounded-xl border border-[#1C1917]/10">
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#1C1917]">
            {snapshot.safetyCheckIns}
          </div>
          <div className="font-sans text-xs text-[#57534E] mt-1 flex items-center justify-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Check-ins</span>
          </div>
        </div>

        <div className="p-3 bg-[#FFFAF3] rounded-xl border border-[#1C1917]/10">
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#1C1917]">
            {snapshot.incidents}
          </div>
          <div className="font-sans text-xs text-[#57534E] mt-1 flex items-center justify-center gap-1">
            <FileWarning className="w-3.5 h-3.5 text-[#F62440]" />
            <span>Incidents</span>
          </div>
        </div>
      </div>
    </div>
  );
};
