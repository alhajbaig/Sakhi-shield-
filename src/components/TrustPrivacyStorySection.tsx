import React from 'react';

export const TrustPrivacyStorySection: React.FC = () => {
  const points = [
    {
      title: 'PRIVATE',
      desc: 'Your personal safety information stays under your control.',
    },
    {
      title: 'EXPLAINABLE',
      desc: 'You should know why SakhiShield is responding.',
    },
    {
      title: 'USER-CONTROLLED',
      desc: 'You decide who you trust and what you share.',
    },
  ];

  return (
    <section id="privacy" className="py-24 md:py-32 bg-[#FFF2DB] border-b border-[#1C1917]/10">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        
        {/* Headline */}
        <div className="mb-14 md:mb-16">
          <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-4 block">
            TRUST BY DESIGN
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight leading-tight">
            Your safety.<br />
            Your data.<br />
            Your choice.
          </h2>
        </div>

        {/* 3 Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pb-12 border-b border-[#1C1917]/15">
          {points.map((point) => (
            <div key={point.title} className="pt-4">
              <h3 className="font-sans text-xs font-bold tracking-widest text-[#1C1917] uppercase mb-3">
                {point.title}
              </h3>
              <p className="font-sans text-base text-[#44403C] leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Small reassurance line */}
        <div className="pt-8 text-center sm:text-left">
          <p className="font-sans text-sm text-[#78716C] italic">
            Safety shouldn't mean giving up your privacy.
          </p>
        </div>

      </div>
    </section>
  );
};
