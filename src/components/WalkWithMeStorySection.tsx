import React from 'react';

export const WalkWithMeStorySection: React.FC = () => {
  return (
    <section id="walk-with-me" className="py-24 md:py-32 lg:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story & Meaning */}
          <div className="lg:col-span-6">
            <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-3 block">
              SIGNATURE COMPANION
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#78716C] font-normal mb-2">
              Going home alone?
            </h2>

            <p className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight mb-8">
              Walk With Me.
            </p>

            <div className="space-y-2 text-base sm:text-lg font-sans text-[#44403C] mb-8 leading-relaxed">
              <p>Tell SakhiShield where you're going.</p>
              <p>Start your journey.</p>
              <p>Then just keep walking.</p>
            </div>

            <div className="p-4 bg-[#FFF2DB] rounded-2xl border border-[#1C1917]/10 mb-8 max-w-md">
              <p className="font-sans text-sm text-[#44403C]">
                If something unusual happens, SakhiShield can check in with you.
              </p>
            </div>

            {/* Emotional Highlight */}
            <p className="font-serif text-xl sm:text-2xl text-[#1C1917] italic">
              “Bas ghar pahunchne tak saath.”
            </p>
          </div>

          {/* Right Column: Clean Journey Line Visual */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[360px] bg-[#FFF2DB] rounded-3xl p-8 sm:p-10 border border-[#1C1917]/10 shadow-sm flex flex-col items-center">
              
              {/* Origin: COLLEGE */}
              <div className="text-center">
                <span className="font-sans text-xs font-semibold tracking-wider text-[#78716C] uppercase">
                  COLLEGE
                </span>
              </div>

              {/* Minimal Path */}
              <div className="py-4 flex flex-col items-center space-y-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]/25" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]/25" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]/25" />

                {/* Current Location: YOU */}
                <div className="my-2 flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-[#1C1917] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#FFFAF3]" />
                  </div>
                  <span className="mt-1.5 font-sans text-xs font-bold tracking-wider text-[#1C1917] uppercase">
                    YOU
                  </span>
                </div>

                <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]/25" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]/25" />
              </div>

              {/* Destination: HOME */}
              <div className="text-center pt-2">
                <span className="font-sans text-xs font-semibold tracking-wider text-[#78716C] uppercase">
                  HOME
                </span>
              </div>

              {/* Journey Status Card */}
              <div className="mt-8 w-full pt-6 border-t border-[#1C1917]/10 flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFAF3] rounded-full border border-[#1C1917]/10">
                  <span className="w-2 h-2 rounded-full bg-[#F62440]" />
                  <span className="font-sans text-xs font-medium text-[#1C1917]">
                    Journey active
                  </span>
                </div>
                <span className="font-serif text-sm text-[#44403C] italic">
                  “I'm here with you.”
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
