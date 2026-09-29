import React from 'react';
import { SafetyStatus } from './product/SafetyStatus';
import { RiskIndicator } from './product/RiskIndicator';
import { CheckInPrompt } from './product/CheckInPrompt';

export const GuardianSection: React.FC = () => {
  return (
    <section id="feature-01" className="py-24 md:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Layer Header with Clear 01 OF 04 Counter */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F62440]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              FEATURE 01 OF 04
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            PHYSICAL DEFENSE LAYER
          </span>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Text */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#F62440] uppercase font-bold mb-2 block">
                01 · ADAPTIVE SAFETY GUARDIAN
              </span>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.08] mb-5">
                “Your journey,<br />watched without being watched.”
              </h2>

              <p className="font-sans text-base sm:text-lg text-[#44403C] leading-relaxed mb-6">
                Walk With Me creates a monitored safety session while you travel alone. SakhiShield
                compares your planned route against real-time signals: route deviations, prolonged stops,
                and missed check-ins.
              </p>

              <div className="space-y-3 pt-4 border-t border-[#1C1917]/15 font-sans text-sm text-[#44403C]">
                <div className="p-3 bg-[#FFF2DB] border border-[#1C1917]/10 rounded flex items-center gap-3">
                  <span className="font-mono font-bold text-[#F62440]">01</span>
                  <span>Observable corridor checks, never subjective profiling.</span>
                </div>
                <div className="p-3 bg-[#FFF2DB] border border-[#1C1917]/10 rounded flex items-center gap-3">
                  <span className="font-mono font-bold text-[#1C1917]">02</span>
                  <span>No crime prediction. Evaluates physical telemetry relative to your plan.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-3.5 border border-[#1C1917]/15 bg-[#FFF2DB]/80 rounded font-mono text-xs text-[#57534E]">
              CORRIDOR BUFFER: ±150 METERS • GPS SAMPLING: ONLY DURING SESSION
            </div>
          </div>

          {/* Right Product Preview Composition */}
          <div className="lg:col-span-7 space-y-4">
            <SafetyStatus
              destination="HOME"
              eta="20 MIN"
              expectedArrival="10:30 PM"
              monitoring="ACTIVE"
              status="SAFE"
            />

            <RiskIndicator
              signalType="ROUTE DEVIATION"
              metric="620m"
              detail="Observed divergence from expected university transit corridor"
              timestamp="22:18:45"
            />

            <CheckInPrompt />
          </div>

        </div>

      </div>
    </section>
  );
};
