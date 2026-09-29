import React from 'react';

export const WhatItIsNotSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#FFFAF3] border-b border-[#1C1917]/10">
      <div className="max-w-[800px] mx-auto px-6 md:px-10 text-center">
        
        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight mb-12">
          SakhiShield doesn't try to control your life.
        </h2>

        {/* Three short lines */}
        <div className="space-y-3 mb-10 text-lg sm:text-xl font-sans text-[#78716C]">
          <p>“It doesn't predict crime.”</p>
          <p>“It doesn't decide what you should do.”</p>
          <p>“It doesn't replace your judgment.”</p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-[#1C1917]/15 mx-auto mb-10" />

        {/* The true purpose */}
        <p className="font-serif text-xl sm:text-2xl text-[#1C1917] leading-relaxed max-w-xl mx-auto">
          It simply gives you more information, more options, and a little more support when you need it.
        </p>

      </div>
    </section>
  );
};
