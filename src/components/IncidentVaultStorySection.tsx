import React from 'react';

export const IncidentVaultStorySection: React.FC = () => {
  const timelineItems = [
    { time: '09:42 PM', text: 'Message saved' },
    { time: '09:44 PM', text: 'Journey note added' },
    { time: '09:47 PM', text: 'Incident recorded' },
  ];

  return (
    <section className="py-24 md:py-32 lg:py-36 bg-[#FFF2DB] border-b border-[#1C1917]/10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Context & Tagline */}
          <div className="lg:col-span-6">
            <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-3 block">
              PRIVATE EVIDENCE VAULT
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight mb-6">
              If something happens, you shouldn't have to remember everything.
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#44403C] leading-relaxed mb-8">
              Important screenshots, messages and incident details can be kept together in one private place.
            </p>

            <p className="font-serif text-2xl sm:text-3xl text-[#1C1917] italic">
              Private. Organized. Yours.
            </p>
          </div>

          {/* Right Column: Minimal Timeline Visual */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[360px] bg-[#FFFAF3] rounded-3xl p-8 border border-[#1C1917]/10 shadow-sm">
              <span className="block text-[11px] font-sans tracking-wider uppercase text-[#78716C] mb-6 font-medium">
                TIMELINE RECORD
              </span>

              <div className="relative pl-6 space-y-6">
                {/* Vertical continuous line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1C1917]/15" />

                {timelineItems.map((item) => (
                  <div key={item.time} className="relative flex items-start gap-4">
                    <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-[#FFFAF3] border-2 border-[#1C1917]/30 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#1C1917]" />
                    </div>
                    <div>
                      <span className="block font-sans text-xs font-semibold text-[#78716C]">
                        {item.time}
                      </span>
                      <span className="font-sans text-sm font-medium text-[#1C1917]">
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-5 border-t border-[#1C1917]/10 text-center">
                <span className="font-sans text-xs text-[#78716C]">
                  Accessible only by you
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
