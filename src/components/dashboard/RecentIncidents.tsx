import React from 'react';
import { useApp } from '../../lib/AppContext';
import { LockKeyhole, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentIncidents: React.FC = () => {
  const { incidents } = useApp();

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
          <div className="flex items-center gap-2">
            <LockKeyhole className="w-4 h-4 text-[#1C1917]" />
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
              RECENT INCIDENTS
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#78716C]">
            VAULT ARCHIVE
          </span>
        </div>

        <div className="space-y-2.5">
          {incidents.length === 0 ? (
            <div className="py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                <LockKeyhole className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="font-sans text-xs text-[#57534E]">
                No incidents recorded yet.
                <br />
                <span className="text-emerald-700 font-medium">Your safety record is clean.</span>
              </p>
            </div>
          ) : (
          incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-3 bg-[#FFF2DB]/60 border border-[#1C1917]/10 rounded-xl flex items-center justify-between hover:bg-[#FFF2DB] transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-bold text-[#1C1917]">
                    #{inc.id}
                  </span>
                  <span className="font-sans text-xs font-semibold text-[#1C1917]">
                    {inc.type}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-[#57534E] leading-normal">
                  {inc.summary}
                </p>
                <div className="font-mono text-[10px] text-[#78716C] mt-1">
                  {inc.date}
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {inc.status}
                </span>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1C1917]/10 mt-4 flex items-center justify-between">
        <Link
          to="/incident-vault"
          className="font-mono text-xs font-bold text-[#1C1917] hover:text-[#F62440] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>VIEW ALL INCIDENTS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        <span className="font-mono text-[10px] text-[#78716C]">ZERO-KNOWLEDGE DOSSIER</span>
      </div>
    </div>
  );
};
