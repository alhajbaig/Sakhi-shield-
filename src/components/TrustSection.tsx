import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const antiFeatures = [
    { title: 'NO FACIAL RECOGNITION', detail: 'Zero biometric scans, street camera matching, or facial profiling.' },
    { title: 'NO CRIME PREDICTION', detail: 'Evaluates observable physical deviations, not speculative algorithmic guilt.' },
    { title: 'NO ALWAYS-ON GPS', detail: 'Location sampling operates strictly inside an explicit, user-started session.' },
    { title: 'NO ALWAYS-ON MICROPHONE', detail: 'Zero ambient audio listening. Ambient sensors activate only upon manual trigger.' },
    { title: 'NO “AI DETECTS CRIMINALS”', detail: 'We reject dystopian claims. Technology detects anomalies, not human character.' },
    { title: 'NO AUTOMATIC POLICE DISPATCH', detail: 'No unverified police calls that could endanger users or provoke unnecessary panic.' },
  ];

  return (
    <section className="py-24 md:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              10 / ETHICAL MANDATE
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            HONEST TECHNOLOGY
          </span>
        </div>

        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.08]">
            “Safety doesn't need surveillance.”
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#44403C] mt-4 leading-relaxed">
            Many safety apps quietly turn into tracking software that monetizes your location.
            We explicitly declare the surveillance boundaries we will never cross.
          </p>
        </div>

        {/* Anti-Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
          {antiFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-5 border border-[#1C1917]/20 bg-[#FFF2DB]/60 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-[#F62440] uppercase tracking-wider mb-2">
                  <X className="w-4 h-4 text-[#F62440] shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#44403C] leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#1C1917]/10 font-mono text-[10px] text-[#78716C] font-semibold">
                PERMANENT BOUNDARY
              </div>
            </div>
          ))}
        </div>

        {/* Closing Affirmation */}
        <div className="mt-14 pt-10 border-t border-[#1C1917]/15 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-[#1C1917] text-[#FFFAF3] mb-3">
            <ShieldCheck className="w-6 h-6 text-[#FFE5BF]" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1917] tracking-tight font-bold">
            “Designed to assist the user, not replace their judgment.”
          </h3>
          <p className="font-mono text-xs text-[#78716C] mt-2 uppercase tracking-wider font-semibold">
            HUMAN-FIRST • TRANSPARENT • ACCOUNTABLE
          </p>
        </div>

      </div>
    </section>
  );
};
