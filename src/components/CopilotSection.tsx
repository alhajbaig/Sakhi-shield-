import React from 'react';
import { CopilotPanel } from './product/CopilotPanel';

export const CopilotSection: React.FC = () => {
  return (
    <section id="feature-02" className="py-24 md:py-36 bg-[#FFF2DB] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Layer Header with Feature 02 of 04 Banner */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              FEATURE 02 OF 04
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            CONTEXTUAL ACTION GUIDANCE
          </span>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Product Preview */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <CopilotPanel initialMode="UNCOMFORTABLE" />
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#F62440] uppercase font-bold mb-2 block">
                02 · SAFETY COPILOT
              </span>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.08] mb-5">
                “When something feels wrong, know what to do next.”
              </h2>

              <p className="font-sans text-base sm:text-lg text-[#44403C] leading-relaxed mb-6">
                Safety Copilot turns ambiguous signals into practical actions without panic.
                Rather than an unhelpful chat bubble, it offers structured choices for 3 situations:
                when you're safe, when you feel uncomfortable, and when it's an emergency.
              </p>

              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="p-3 border border-[#1C1917]/15 bg-[#FFFAF3] rounded-lg">
                  <div className="font-bold text-[#1C1917]">STATE 01 — SAFE</div>
                  <div className="text-[#57534E] font-sans text-xs mt-0.5">
                    Passive background tracking with zero interruptions.
                  </div>
                </div>

                <div className="p-3 border border-[#1C1917]/15 bg-[#FFE5BF] rounded-lg">
                  <div className="font-bold text-[#1C1917]">STATE 02 — UNCOMFORTABLE</div>
                  <div className="text-[#57534E] font-sans text-xs mt-0.5">
                    Assistance: nearest 24/7 staffed hubs, discreet location links, quiet alerts.
                  </div>
                </div>

                <div className="p-3 border border-[#F62440]/30 bg-[#FFFAF3] rounded-lg">
                  <div className="font-bold text-[#F62440]">STATE 03 — EMERGENCY</div>
                  <div className="text-[#57534E] font-sans text-xs mt-0.5">
                    Live GPS stream, sirens, and automatic incident dossier creation.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 font-mono text-xs text-[#78716C] pt-3 border-t border-[#1C1917]/15">
              COPILOT IS AN ACTION ENGINE — NOT A CONVERSATIONAL CHATBOT.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
