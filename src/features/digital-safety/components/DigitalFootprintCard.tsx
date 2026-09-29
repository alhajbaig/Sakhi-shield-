// SakhiShield — Digital Footprint & Account Playbook Card
// Guided self-audit checklist and compromised account recovery playbook.

import React, { useState } from 'react';
import { Fingerprint, LifeBuoy, CheckSquare, Square } from 'lucide-react';
import {
  DIGITAL_FOOTPRINT_CHECKLIST_ITEMS,
  COMPROMISED_ACCOUNT_PLAYBOOK,
} from '../constants/digitalSafety.constants';

export const DigitalFootprintCard: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'FOOTPRINT' | 'PLAYBOOK'>('FOOTPRINT');

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-white shadow-xs">
      {/* Tabs */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('FOOTPRINT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'FOOTPRINT'
                ? 'bg-[#1C1917] text-[#FFFAF3]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>DIGITAL FOOTPRINT AUDIT</span>
          </button>
          <button
            onClick={() => setActiveTab('PLAYBOOK')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'PLAYBOOK'
                ? 'bg-[#1C1917] text-[#FFFAF3]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>COMPROMISED ACCOUNT PLAYBOOK</span>
          </button>
        </div>
      </div>

      {activeTab === 'FOOTPRINT' ? (
        <div className="space-y-4">
          <p className="font-sans text-xs text-[#57534E] leading-relaxed">
            Protect your real-world identity by minimizing publicly searchable data across social networks, directories, and third-party apps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {DIGITAL_FOOTPRINT_CHECKLIST_ITEMS.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                      : 'bg-[#FFFAF3] border-[#1C1917]/10 hover:border-[#1C1917]/30'
                  }`}
                >
                  <button className="mt-0.5 text-[#1C1917]">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-[#78716C]" />
                    )}
                  </button>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#78716C] block">
                      {item.category}
                    </span>
                    <h4 className="font-mono text-xs font-bold text-[#1C1917] mt-0.5">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[11px] text-[#57534E] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="font-sans text-xs text-[#57534E] leading-relaxed">
            If you suspect unauthorized access or compromise of an online account, execute these steps in order immediately:
          </p>

          <div className="space-y-3 pt-2">
            {COMPROMISED_ACCOUNT_PLAYBOOK.map((item) => (
              <div
                key={item.step}
                className="p-3.5 rounded-xl border border-[#1C1917]/10 bg-[#FFFAF3] flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-[#1C1917]">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-[#57534E] mt-0.5 leading-relaxed">
                    {item.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
