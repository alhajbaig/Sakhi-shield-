import React from 'react';

export const PhilosophySection: React.FC = () => {
  return (
    <section className="py-40 md:py-60 bg-[#FFE5BF] border-b border-[#1C1917]/10 flex flex-col items-center justify-center text-center">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">
        
        {/* Massive Whitespace and Calm Centered Editorial Statement */}
        <div className="max-w-4xl mx-auto">
          <p className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1C1917] leading-[1.12] tracking-tight">
            “Technology should know<br />
            when to step forward —<br className="hidden sm:inline" />
            <span className="italic font-normal">and when to give control back.”</span>
          </p>

          {/* Subordinate Motto Line with Generous Whitespace */}
          <div className="mt-16 md:mt-24 pt-8 border-t border-[#1C1917]/20 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono tracking-[0.25em] text-[#1C1917] uppercase font-bold">
              <span>DETECT.</span>
              <span>GUIDE.</span>
              <span>PROTECT.</span>
              <span>DOCUMENT.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
