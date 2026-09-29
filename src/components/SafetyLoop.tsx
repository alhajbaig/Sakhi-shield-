import React from 'react';

export const SafetyLoop: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'DETECT',
      desc: 'Recognize route deviations, unexpected stops, or threatening digital messages early.',
    },
    {
      num: '02',
      title: 'VERIFY',
      desc: 'Discreet check-in prompts let you confirm your status before any alarms are raised.',
    },
    {
      num: '03',
      title: 'GUIDE',
      desc: 'Copilot suggests real-world options: nearest open safe havens, route checks, or quiet check-ins.',
    },
    {
      num: '04',
      title: 'PROTECT',
      desc: 'If an anomaly persists without confirmation, your trusted circle receives live encrypted telemetry.',
    },
    {
      num: '05',
      title: 'DOCUMENT',
      desc: 'Automatically package screenshots, time logs, and coordinates into a tamper-proof incident dossier.',
    },
    {
      num: '06',
      title: 'RESOLVE',
      desc: 'Return control to you upon safe arrival. Session telemetry is erased from memory.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#FFFAF3] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              04 / CORE SAFETY LOOP
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            THE 6-PHASE CYCLE
          </span>
        </div>

        {/* Section Title */}
        <div className="max-w-3xl mb-14">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight leading-[1.08]">
            An unbroken loop of context, verification, and control.
          </h2>
        </div>

        {/* 6 Steps Grid with readable typography and reduced text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {steps.map((step) => (
            <div key={step.num} className="border-t-2 border-[#1C1917]/20 pt-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-3xl font-light text-[#78716C] block mb-2">
                  {step.num}
                </span>
                <h3 className="font-serif text-2xl text-[#1C1917] mb-2 font-bold">
                  {step.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#44403C] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1C1917]/10 flex items-center justify-between text-xs font-mono text-[#78716C]">
                <span>PHASE {step.num}</span>
                <span className="font-semibold text-[#1C1917]">AUTONOMOUS</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
