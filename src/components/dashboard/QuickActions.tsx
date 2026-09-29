import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Sparkles, ShieldCheck, LockKeyhole, ChevronRight } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Walk With Me',
      desc: 'Corridor journey & escort',
      href: '/walk-with-me',
      icon: Navigation,
      badge: 'ACTIVE LIVE',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      title: 'Safety Copilot',
      desc: 'AI Safe Havens & action advice',
      href: '/safety-copilot',
      icon: Sparkles,
      badge: 'DECISION AI',
      badgeColor: 'bg-[#FFE5BF] text-[#171515] border-[#1C1917]/20',
    },
    {
      title: 'Digital Safety',
      desc: 'Screenshot & threat OCR scan',
      href: '/digital-safety',
      icon: ShieldCheck,
      badge: 'ON-DEVICE OCR',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      title: 'Incident Vault',
      desc: 'SHA-256 tamper-proof logs',
      href: '/incident-vault',
      icon: LockKeyhole,
      badge: 'EVIDENCE SEAL',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="pb-3 mb-4 border-b border-[#1C1917]/10 flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
            SOVEREIGN SAFETY MODULES
          </h3>
          <span className="font-mono text-[10px] text-[#78716C] bg-white px-2 py-0.5 rounded border border-[#1C1917]/10">
            4 ESSENTIALS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.title}
                to={act.href}
                className="p-3.5 rounded-xl border border-[#1C1917]/15 bg-white/70 hover:bg-[#FFE5BF]/60 hover:border-[#1C1917]/30 transition-all flex flex-col justify-between group cursor-pointer shadow-2xs hover:shadow-xs relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1C1917] text-[#FFFAF3] flex items-center justify-center shrink-0 group-hover:bg-[#F62440] transition-colors shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] group-hover:text-[#F62440] transition-colors flex items-center justify-between">
                    <span>{act.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#1C1917] transition-transform group-hover:translate-x-0.5" />
                  </h4>
                  <p className="font-sans text-[11px] text-[#57534E] mt-0.5 leading-snug">
                    {act.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between text-[11px] font-mono text-[#78716C] mt-4">
        <span>ZERO-KNOWLEDGE ARCHITECTURE</span>
        <span className="text-emerald-700 font-bold">READY TO DEPLOY</span>
      </div>
    </div>
  );
};
