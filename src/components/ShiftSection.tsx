import React from 'react';
import { ArrowDown } from 'lucide-react';

export const ShiftSection: React.FC = () => {
  return (
    <section className="py-24 md:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/15 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F62440]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              03 / THE SHIFT
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            PROACTIVE EVOLUTION
          </span>
        </div>

        {/* Huge Headline */}
        <div className="max-w-4xl mb-14">
          <span className="font-mono text-xs tracking-widest text-[#F62440] uppercase font-bold mb-2 block">
            A PARADIGM SHIFT
          </span>
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#1C1917] leading-[1.02] tracking-tight">
            From reactive<br />
            to <span className="italic font-normal text-[#F62440]">proactive</span>.
          </h2>
        </div>

        {/* The Transformation Visual */}
        <div className="border border-[#1C1917]/20 rounded-xl bg-[#FFF2DB]/50 p-6 md:p-10 my-8 shadow-sm">
          
          {/* Old Way */}
          <div className="pb-8 border-b border-[#1C1917]/15">
            <div className="font-mono text-xs text-[#78716C] tracking-wider uppercase mb-3 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#78716C]" />
              <span>THE OLD WAY (REACTIVE ONLY)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl opacity-75">
              <div className="p-3.5 border border-[#1C1917]/20 rounded bg-[#FFFAF3]">
                <span className="font-mono text-xs text-[#78716C] block">01 TRIGGER</span>
                <span className="font-serif text-xl text-[#1C1917] mt-0.5 block font-bold">DANGER</span>
                <span className="text-xs text-[#57534E]">Incident occurs</span>
              </div>
              <div className="p-3.5 border border-[#1C1917]/20 rounded bg-[#FFFAF3]">
                <span className="font-mono text-xs text-[#78716C] block">02 ACTION</span>
                <span className="font-serif text-xl text-[#1C1917] mt-0.5 block font-bold">SOS</span>
                <span className="text-xs text-[#57534E]">Panic trigger</span>
              </div>
              <div className="p-3.5 border border-[#1C1917]/20 rounded bg-[#FFFAF3]">
                <span className="font-mono text-xs text-[#78716C] block">03 RESULT</span>
                <span className="font-serif text-xl text-[#1C1917] mt-0.5 block font-bold">HELP</span>
                <span className="text-xs text-[#57534E]">Post-crisis response</span>
              </div>
            </div>
          </div>

          {/* Transformation Indicator */}
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowDown className="w-5 h-5 text-[#F62440]" />
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#1C1917] uppercase">
                THE SAKHISHIELD CONTINUUM
              </span>
            </div>
            <span className="font-mono text-xs text-[#78716C] font-semibold">
              PRE-CRISIS INTERVENTION
            </span>
          </div>

          {/* Proactive 5 Stages */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              <div className="p-4 border border-[#1C1917]/20 rounded-lg bg-[#FFFAF3]">
                <span className="font-mono text-xs text-[#F62440] font-bold block">01</span>
                <div className="font-serif text-2xl text-[#1C1917] my-1">DETECT</div>
                <p className="font-sans text-xs text-[#44403C]">
                  Catch route anomalies or threat messages early.
                </p>
              </div>

              <div className="p-4 border border-[#1C1917]/20 rounded-lg bg-[#FFFAF3]">
                <span className="font-mono text-xs text-[#1C1917] font-bold block">02</span>
                <div className="font-serif text-2xl text-[#1C1917] my-1">VERIFY</div>
                <p className="font-sans text-xs text-[#44403C]">
                  Quick status check before setting off alarms.
                </p>
              </div>

              <div className="p-4 border border-[#1C1917]/20 rounded-lg bg-[#FFE5BF]">
                <span className="font-mono text-xs text-[#1C1917] font-bold block">03</span>
                <div className="font-serif text-2xl text-[#1C1917] my-1">GUIDE</div>
                <p className="font-sans text-xs text-[#44403C]">
                  Get nearest safe havens and discrete relay options.
                </p>
              </div>

              <div className="p-4 border border-[#F62440]/30 rounded-lg bg-[#FFFAF3]">
                <span className="font-mono text-xs text-[#F62440] font-bold block">04</span>
                <div className="font-serif text-2xl text-[#F62440] my-1">PROTECT</div>
                <p className="font-sans text-xs text-[#44403C]">
                  Alert your trusted circle if a signal is unverified.
                </p>
              </div>

              <div className="p-4 border border-[#1C1917]/20 rounded-lg bg-[#FFFAF3]">
                <span className="font-mono text-xs text-[#1C1917] font-bold block">05</span>
                <div className="font-serif text-2xl text-[#1C1917] my-1">DOCUMENT</div>
                <p className="font-sans text-xs text-[#44403C]">
                  Securely lock timestamps & evidence in your private vault.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
