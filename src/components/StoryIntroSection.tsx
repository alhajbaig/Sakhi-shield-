import React from 'react';

export const StoryIntroSection: React.FC = () => {
  return (
    <section id="story" className="py-24 md:py-32 lg:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/10">
      <div className="max-w-[880px] mx-auto px-6 md:px-10 text-center">
        
        {/* Small label */}
        <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.25em] text-[#78716C] uppercase mb-4 block">
          LET'S SAY IT'S 9:40 PM.
        </span>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight mb-10">
          You're on your way home.
        </h2>

        {/* 3-4 very short lines */}
        <div className="space-y-2 mb-10 text-lg sm:text-xl font-sans text-[#44403C] font-normal leading-relaxed">
          <p>Your headphones are on.</p>
          <p>Your phone is in your hand.</p>
          <p>The road feels a little quieter than usual.</p>
        </div>

        {/* Delicate divider line */}
        <div className="w-12 h-px bg-[#1C1917]/15 mx-auto mb-10" />

        {/* Next lines */}
        <div className="space-y-3 mb-12 text-base sm:text-lg font-sans text-[#44403C] font-normal leading-relaxed max-w-md mx-auto">
          <p>You don't want to panic.</p>
          <p>You don't want to call someone for no reason.</p>
          <p className="text-[#1C1917] font-medium pt-2">You just want to feel a little safer.</p>
        </div>

        {/* First Hinglish moment */}
        <div className="inline-block pt-2">
          <p className="font-serif text-2xl sm:text-3xl text-[#1C1917] italic">
            “Bas isi feeling ke liye SakhiShield hai.”
          </p>
        </div>

      </div>
    </section>
  );
};
