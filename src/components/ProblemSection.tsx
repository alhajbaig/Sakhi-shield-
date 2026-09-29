import React from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="why" className="py-24 md:py-32 bg-[#FFF2DB] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              02 / THE PROBLEM
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            THE REACTIVE PARADOX
          </span>
        </div>

        {/* Large Editorial Headline */}
        <div className="max-w-4xl mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1C1917] leading-[1.08] tracking-tight">
            “Most safety tools begin when something has already gone wrong.”
          </h2>
        </div>

        {/* Minimal Reactive Pipeline Breakdown */}
        <div className="py-6 px-6 md:px-8 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-lg mb-16 max-w-2xl shadow-sm">
          <div className="font-mono text-xs text-[#78716C] uppercase tracking-wider mb-3 font-semibold">
            Traditional Emergency Response
          </div>
          <div className="flex items-center justify-between font-mono text-base sm:text-lg font-bold text-[#1C1917]">
            <span className="text-[#F62440]">DANGER</span>
            <ArrowRight className="w-5 h-5 text-[#78716C]" />
            <span>SOS TRIGGER</span>
            <ArrowRight className="w-5 h-5 text-[#78716C]" />
            <span className="text-[#78716C]">HELP CALL</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1C1917]/10 text-sm font-sans text-[#57534E]">
            Waiting for an emergency button means help only starts after danger is already happening.
          </div>
        </div>

        {/* Editorial Composition: 6 Signals (Concise, larger text) */}
        <div className="my-12">
          <div className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#1C1917] font-bold mb-6 pb-2 border-b border-[#1C1917]/15 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F62440]" />
            <span>REAL-WORLD EARLY SIGNALS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-lg">
              <span className="font-mono text-xs text-[#F62440] font-bold block mb-1">SIGNAL 01</span>
              <div className="font-serif text-2xl text-[#1C1917] mb-1">ROUTE CHANGE</div>
              <p className="font-sans text-sm text-[#44403C] leading-normal">
                Sudden detour from your normal route into unlit or unfamiliar paths.
              </p>
            </div>

            <div className="p-5 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-lg">
              <span className="font-mono text-xs text-[#1C1917] font-bold block mb-1">SIGNAL 02</span>
              <div className="font-serif text-2xl text-[#1C1917] mb-1">UNEXPECTED STOP</div>
              <p className="font-sans text-sm text-[#44403C] leading-normal">
                Stopped in an unexpected location for 8+ minutes with no response.
              </p>
            </div>

            <div className="p-5 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-lg">
              <span className="font-mono text-xs text-[#1C1917] font-bold block mb-1">SIGNAL 03</span>
              <div className="font-serif text-2xl text-[#1C1917] mb-1">LONGER JOURNEY</div>
              <p className="font-sans text-sm text-[#44403C] leading-normal">
                Travel time delayed significantly without traffic justification.
              </p>
            </div>

            <div className="p-5 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-lg">
              <span className="font-mono text-xs text-[#1C1917] font-bold block mb-1">SIGNAL 04</span>
              <div className="font-serif text-2xl text-[#1C1917] mb-1">MISSED CHECK-IN</div>
              <p className="font-sans text-sm text-[#44403C] leading-normal">
                Discreet safety prompt goes unanswered at scheduled transit points.
              </p>
            </div>

            <div className="p-5 border border-[#F62440]/40 bg-[#FFFAF3] rounded-lg">
              <span className="font-mono text-xs text-[#F62440] font-bold block mb-1">SIGNAL 05</span>
              <div className="font-serif text-2xl text-[#1C1917] mb-1">THREATENING MESSAGE</div>
              <p className="font-sans text-sm text-[#44403C] leading-normal">
                Intimidating or stalking messages received before or during transit.
              </p>
            </div>

            <div className="p-5 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-lg">
              <span className="font-mono text-xs text-[#1C1917] font-bold block mb-1">SIGNAL 06</span>
              <div className="font-serif text-2xl text-[#1C1917] mb-1">SCATTERED EVIDENCE</div>
              <p className="font-sans text-sm text-[#44403C] leading-normal">
                Evidence lost across messages, screenshots, and location histories.
              </p>
            </div>
          </div>
        </div>

        {/* Large Editorial Concluding Statement */}
        <div className="mt-16 pt-12 border-t border-[#1C1917]/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-baseline">
          <div className="lg:col-span-7">
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1C1917] leading-tight">
              “Not every unsafe moment starts with an emergency button.”
            </h3>
          </div>
          <div className="lg:col-span-5 font-sans text-base sm:text-lg text-[#57534E] leading-relaxed">
            A journey changes. A message turns hostile. A check-in goes missed.
            SakhiShield catches these observable patterns early so you stay in control.
          </div>
        </div>

      </div>
    </section>
  );
};
