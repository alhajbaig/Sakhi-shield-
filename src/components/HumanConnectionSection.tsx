import React from 'react';

export const HumanConnectionSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 lg:py-36 bg-[#FFE5BF] border-b border-[#1C1917]/10">
      <div className="max-w-[820px] mx-auto px-6 md:px-10 text-center">
        
        {/* Hinglish Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight mb-4">
          “Har baar emergency nahi hoti.”
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-lg sm:text-xl text-[#44403C] mb-10 italic">
          Sometimes something just feels… off.
        </p>

        {/* Small Story */}
        <div className="space-y-3 mb-10 text-base sm:text-lg font-sans text-[#44403C] max-w-lg mx-auto leading-relaxed">
          <p>Maybe you're walking home.</p>
          <p>Maybe your route changed.</p>
          <p>Maybe someone keeps following.</p>
          <p>Maybe you received a message that made you uncomfortable.</p>
          <p className="pt-2 text-[#1C1917] font-medium">You don't always know what to do next.</p>
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-[#1C1917]/20 mx-auto mb-8" />

        {/* Product Purpose */}
        <p className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
          SakhiShield helps you take that next step.
        </p>

      </div>
    </section>
  );
};
