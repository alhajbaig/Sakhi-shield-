import React from 'react';

export const BigIdeaSection: React.FC = () => {
  return (
    <section className="py-24 md:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/10">
      <div className="max-w-[880px] mx-auto px-6 md:px-10 text-center">
        
        {/* Strong Visual Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight mb-12">
          “Not just for emergencies.”
        </h2>

        {/* Three Lines */}
        <div className="space-y-4 text-xl sm:text-2xl lg:text-3xl font-serif text-[#44403C] leading-snug">
          <p>Before something happens.</p>
          <p className="text-[#F62440]">When something feels wrong.</p>
          <p>And when you simply want someone to know you're okay.</p>
        </div>

      </div>
    </section>
  );
};
