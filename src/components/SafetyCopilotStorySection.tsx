import React from 'react';

export const SafetyCopilotStorySection: React.FC = () => {
  const options = [
    { label: "I'M OKAY", sub: 'False alarm • Continue journey', highlight: false },
    { label: "I'm uncomfortable", sub: 'Quiet check-in • Suggest lit areas', highlight: true },
    { label: "I NEED HELP", sub: 'Alert trusted circle • Discreet guidance', highlight: false },
  ];

  return (
    <section id="safety-copilot" className="py-24 md:py-32 lg:py-36 bg-[#FFF2DB] border-b border-[#1C1917]/10">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 text-center">
        
        {/* Eyebrow */}
        <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-4 block">
          SIMPLE, CONTEXTUAL SAFETY GUIDANCE
        </span>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight mb-6">
          When something doesn't feel right.
        </h2>

        {/* Subhead text */}
        <div className="space-y-1 mb-12 text-base sm:text-lg font-sans text-[#44403C] max-w-lg mx-auto">
          <p>You don't always need an emergency button.</p>
          <p>Sometimes you just need to know what to do next.</p>
        </div>

        {/* Three options visually shown (Not a chatbot, but 3 calm choices) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {options.map((opt) => (
            <div
              key={opt.label}
              className={`p-6 rounded-2xl text-left border transition-all ${
                opt.highlight
                  ? 'bg-[#FFFAF3] border-[#F62440]/30 shadow-xs'
                  : 'bg-[#FFFAF3]/80 border-[#1C1917]/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs tracking-wider uppercase font-semibold text-[#1C1917]">
                  {opt.label}
                </span>
                {opt.highlight && (
                  <span className="w-2 h-2 rounded-full bg-[#F62440]" />
                )}
              </div>
              <p className="font-sans text-xs text-[#78716C]">
                {opt.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Next step reassurance */}
        <p className="font-serif text-2xl sm:text-3xl text-[#1C1917] mb-4">
          SakhiShield helps you choose the next step.
        </p>

        {/* Hinglish line */}
        <p className="font-serif text-xl sm:text-2xl text-[#78716C] italic">
          “Panic nahi. Pehle next step.”
        </p>

      </div>
    </section>
  );
};
