import React from 'react';
import { PrivacyPanel } from './product/PrivacyPanel';

export const PrivacySection: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'USER CONTROL',
      desc: 'You decide when sessions activate, who sees your route, and when records are deleted.',
    },
    {
      num: '02',
      title: 'MINIMAL COLLECTION',
      desc: 'Zero background surveillance. Location is only sampled during an active session.',
    },
    {
      num: '03',
      title: 'EXPLICIT PERMISSIONS',
      desc: 'No automatic unconsented police dispatches. Escalation requires your confirmation.',
    },
    {
      num: '04',
      title: 'SECURE STORAGE',
      desc: 'Zero-knowledge encryption guarantees our servers cannot decrypt your private vault.',
    },
    {
      num: '05',
      title: 'AUDITABLE LOGS',
      desc: 'Every access or export produces a tamper-evident timestamped local audit trail.',
    },
  ];

  return (
    <section id="privacy" className="py-24 md:py-36 bg-[#FFF2DB] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              09 / DATA SOVEREIGNTY
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            PRIVACY BY DESIGN
          </span>
        </div>

        {/* Huge Headline */}
        <div className="max-w-4xl mb-12">
          <span className="font-mono text-xs tracking-widest text-[#F62440] uppercase font-bold mb-2 block">
            PRIVACY ARCHITECTURE
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1C1917] tracking-tight leading-[1.06]">
            “Your safety data should remain yours.”
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#44403C] mt-4 leading-relaxed max-w-2xl">
            A safety tool that constantly tracks you is just another threat. SakhiShield gives you
            full sovereign control over your data.
          </p>
        </div>

        {/* 5 Core Principles Grid with readable text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-10">
          {principles.map((p) => (
            <div
              key={p.num}
              className="p-5 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-xl flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#F62440] block mb-2">{p.num}</span>
                <h3 className="font-serif text-lg text-[#1C1917] mb-2 font-bold">{p.title}</h3>
                <p className="font-sans text-xs sm:text-sm text-[#44403C] leading-relaxed">{p.desc}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#1C1917]/10 font-mono text-[10px] text-[#78716C] font-semibold">
                ARCHITECTURAL GUARANTEE
              </div>
            </div>
          ))}
        </div>

        {/* Realistic Privacy Controls Interface */}
        <div className="my-10 max-w-5xl mx-auto">
          <PrivacyPanel />
        </div>

      </div>
    </section>
  );
};
