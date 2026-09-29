import React from 'react';
import { Footprints, Compass, ShieldCheck } from 'lucide-react';

export const ProductExplanationSection: React.FC = () => {
  const concepts = [
    {
      num: '01',
      title: 'STAY WITH YOU',
      desc: 'Walk With Me keeps an eye on your journey while you travel alone.',
      icon: Footprints,
    },
    {
      num: '02',
      title: 'HELP YOU DECIDE',
      desc: 'Safety Copilot gives you simple options when something doesn\'t feel right.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'KEEP YOUR STORY SAFE',
      desc: 'Incident Vault helps you securely keep important evidence and incident details.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#FFF2DB] border-b border-[#1C1917]/10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        
        {/* Header: Question & One-Sentence Answer */}
        <div className="max-w-[760px] mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight mb-6">
            So what does SakhiShield actually do?
          </h2>
          <p className="font-sans text-lg sm:text-xl text-[#44403C] leading-relaxed font-normal">
            It stays with you during your journey, notices unusual signals, helps you decide what to do, and can bring your trusted people in when you need them.
          </p>
        </div>

        {/* 3 Simple Concepts — Typography-Driven with Subtle Visuals (Not dense cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-4">
          {concepts.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.num}
                className="pt-6 border-t border-[#1C1917]/15 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-[#78716C]">
                      {item.num}
                    </span>
                    <IconComponent className="w-4 h-4 text-[#1C1917]/40 stroke-[1.5]" />
                  </div>
                  <h3 className="font-sans text-sm font-bold tracking-widest text-[#1C1917] uppercase mb-3">
                    {item.title}
                  </h3>
                  <p className="font-sans text-base text-[#44403C] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
