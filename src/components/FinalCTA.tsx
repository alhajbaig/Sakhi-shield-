import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section id="cta" className="py-28 md:py-44 bg-[#F62440] text-[#FFFAF3] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Top Metadata */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#FFFAF3]/25">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFFAF3]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#FFFAF3] font-bold">
              12 / STEP FORWARD
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#FFFAF3]/80 tracking-wider font-semibold">
            SAKHISHIELD ECOSYSTEM
          </span>
        </div>

        {/* Climax Headline */}
        <div className="max-w-4xl">
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[92px] text-[#FFFAF3] leading-[1.02] tracking-tight mb-6 font-bold">
            Don't wait<br />
            for the emergency.
          </h2>

          <p className="font-sans text-xl sm:text-2xl text-[#FFFAF3]/90 leading-relaxed max-w-2xl mb-10 font-normal">
            Build a proactive safety layer around your journey and digital communications before
            something goes wrong.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FFFAF3] text-[#F62440] font-mono text-sm tracking-wider font-bold rounded-lg hover:bg-white transition-colors cursor-pointer text-center shadow-lg"
            >
              <span>ENTER SAKHISHIELD</span>
              <ArrowRight className="w-5 h-5 text-[#F62440]" />
            </a>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#FFFAF3]/60 text-[#FFFAF3] font-mono text-sm tracking-wider font-bold rounded-lg hover:bg-[#FFFAF3]/15 transition-colors cursor-pointer text-center"
            >
              <span>REVIEW 4 FEATURES</span>
              <ArrowUpRight className="w-4 h-4 text-[#FFFAF3]" />
            </a>
          </div>
        </div>

        {/* Foundational Bottom Motto */}
        <div className="pt-8 border-t border-[#FFFAF3]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#FFFAF3]/90 font-bold">
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <span>DETECT.</span>
            <span>GUIDE.</span>
            <span>PROTECT.</span>
            <span>DOCUMENT.</span>
          </div>
          <div>
            <span>AUTONOMOUS CONTEXTUAL DEFENSE</span>
          </div>
        </div>

      </div>
    </section>
  );
};
