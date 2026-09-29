// SakhiShield — Emergency Quick Dial & Direct SOS Component

import React from 'react';
import { PhoneCall, AlertOctagon, ShieldAlert } from 'lucide-react';
import { useApp } from '../../../lib/AppContext';

export const EmergencyQuickDialCard: React.FC = () => {
  const { triggerSOS, sosActive } = useApp();

  return (
    <div className="p-6 rounded-2xl border-2 border-red-200 bg-red-50/60 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#F62440] text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#F62440] font-bold block">
              IMMEDIATE HIGH-PRIORITY ACTION
            </span>
            <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
              Emergency SOS & National Dispatch
            </h3>
          </div>
        </div>

        {/* Quick Action Dial Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="tel:112"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F62440] text-white rounded-xl font-mono text-xs font-bold hover:bg-[#d91d35] transition-colors shadow-xs"
            title="Dial 112 National Police / Fire / Ambulance"
          >
            <PhoneCall className="w-4 h-4" />
            <span>DIAL 112 POLICE</span>
          </a>

          <a
            href="tel:1091"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFFAF3] border border-red-300 text-[#F62440] rounded-xl font-mono text-xs font-bold hover:bg-red-50 transition-colors"
            title="Dial 1091 Women Helpline"
          >
            <PhoneCall className="w-4 h-4" />
            <span>1091 WOMEN</span>
          </a>

          {!sosActive && (
            <button
              type="button"
              onClick={triggerSOS}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-xl font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer"
              title="Activate SakhiShield SOS Broadcast to Guardians"
            >
              <ShieldAlert className="w-4 h-4 text-[#F62440]" />
              <span>BROADCAST SOS</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3.5 bg-[#FFFAF3] border border-red-200/80 rounded-xl text-xs font-sans text-[#57534E] leading-relaxed flex items-center justify-between flex-wrap gap-2">
        <span>
          <strong className="text-[#1C1917]">Immediate Danger Protocol:</strong> If you are in physical danger, place an emergency call immediately. The 112 National ERSS operates 24/7 across all states in India with computerized police vehicle dispatch.
        </span>
        <span className="font-mono text-[11px] text-[#F62440] font-bold shrink-0">
          ALL-INDIA • TOLL-FREE
        </span>
      </div>
    </div>
  );
};
