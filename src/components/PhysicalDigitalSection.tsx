import React from 'react';
import { ArrowDown, Shield, Smartphone, Lock } from 'lucide-react';

export const PhysicalDigitalSection: React.FC = () => {
  return (
    <section className="py-24 md:py-36 bg-[#FFF2DB] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              08 / UNIFIED ARCHITECTURE
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            PHYSICAL + DIGITAL CONVERGENCE
          </span>
        </div>

        {/* Editorial Headline */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.08]">
            “Safety doesn't exist in separate apps.”
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#44403C] mt-4 leading-relaxed">
            Harassment often begins in a chat message and follows onto a sidewalk. SakhiShield unites
            physical journey telemetry and digital threat intelligence into one connected defensive posture.
          </p>
        </div>

        {/* Minimal Architecture Composition */}
        <div className="border-2 border-[#1C1917]/20 bg-[#FFFAF3] rounded-2xl p-6 md:p-12 max-w-4xl mx-auto my-8 shadow-sm">
          
          {/* Top Row: Dual Streams */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            <div className="md:col-span-5 p-5 border border-[#1C1917]/20 rounded-xl bg-[#FFF2DB]/60">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold">
                  LAYER 01 / PHYSICAL
                </span>
                <Shield className="w-5 h-5 text-[#F62440]" />
              </div>
              <div className="font-serif text-2xl text-[#1C1917] mb-1 font-bold">PHYSICAL SAFETY</div>
              <div className="font-mono text-xs text-[#F62440] font-bold mb-1">
                Adaptive Safety Guardian
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#57534E]">
                Route divergence, stationary stops, and travel corridors.
              </p>
            </div>

            <div className="md:col-span-1 flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full border border-[#1C1917]/25 flex items-center justify-center font-mono text-base font-bold text-[#1C1917]">
                +
              </div>
            </div>

            <div className="md:col-span-5 p-5 border border-[#1C1917]/20 rounded-xl bg-[#FFF2DB]/60">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold">
                  LAYER 02 / DIGITAL
                </span>
                <Smartphone className="w-5 h-5 text-[#1C1917]" />
              </div>
              <div className="font-serif text-2xl text-[#1C1917] mb-1 font-bold">DIGITAL SAFETY</div>
              <div className="font-mono text-xs text-[#F62440] font-bold mb-1">
                Digital Harassment Intelligence
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#57534E]">
                Screenshots, repetitive intimidation strings, and stalking threats.
              </p>
            </div>

          </div>

          <div className="flex flex-col items-center justify-center my-5">
            <div className="h-6 w-px bg-[#1C1917]/30" />
            <ArrowDown className="w-4 h-4 text-[#F62440] my-1" />
            <div className="h-4 w-px bg-[#1C1917]/30" />
          </div>

          {/* Center Layer */}
          <div className="p-5 border-2 border-[#1C1917]/25 rounded-xl bg-[#FFE5BF] text-center max-w-xl mx-auto shadow-xs">
            <div className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold mb-1">
              CENTRAL DECISION CORE
            </div>
            <div className="font-serif text-3xl text-[#1C1917] mb-1 font-bold">
              SAFETY COPILOT
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#44403C] max-w-md mx-auto">
              Combines physical anomalies with incoming threat signals to calculate proactive safe havens.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-5">
            <div className="h-6 w-px bg-[#1C1917]/30" />
            <ArrowDown className="w-4 h-4 text-[#F62440] my-1" />
            <div className="h-4 w-px bg-[#1C1917]/30" />
          </div>

          {/* Bottom Layer */}
          <div className="p-5 border border-[#1C1917]/20 rounded-xl bg-[#FFF2DB]/80 text-center max-w-xl mx-auto">
            <div className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold mb-1 flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4 text-[#1C1917]" />
              <span>SOVEREIGN ARCHIVE</span>
            </div>
            <div className="font-serif text-3xl text-[#1C1917] mb-1 font-bold">
              PRIVATE INCIDENT VAULT
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#44403C] max-w-md mx-auto">
              Commits location logs and screenshot evidence into one tamper-evident, encrypted dossier.
            </p>
          </div>

        </div>

        {/* Large Concluding Statement */}
        <div className="mt-14 text-center">
          <p className="font-serif text-3xl sm:text-4xl text-[#1C1917] tracking-tight">
            “One journey. One context. One protected record.”
          </p>
        </div>

      </div>
    </section>
  );
};
