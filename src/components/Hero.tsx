import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 bg-[#FFFAF3] border-b border-[#1C1917]/10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Small eyebrow */}
            <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-4 sm:mb-6">
              FOR THE JOURNEY HOME.
            </span>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] leading-[1.14] tracking-tight mb-6">
              Because sometimes,<br />
              you just want someone<br />
              to <span className="text-[#F62440] italic font-normal">stay with you</span>.
            </h1>

            {/* Supporting text */}
            <p className="font-sans text-base sm:text-lg text-[#44403C] leading-relaxed max-w-xl mb-8 font-normal">
              SakhiShield is a personal safety companion that stays quietly by your side — while you travel, when something feels wrong, and when you need help.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#F62440] text-[#FFFAF3] text-sm font-sans font-medium rounded-full hover:bg-[#d91d35] transition-colors shadow-sm"
              >
                <span>Get started</span>
                <span className="text-base leading-none">→</span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-6 py-3.5 text-sm font-sans font-medium text-[#1C1917] border border-[#1C1917]/20 rounded-full hover:bg-[#FFF2DB] transition-colors"
              >
                How it works
              </a>
            </div>

            {/* Small reassurance */}
            <div className="flex items-center gap-2.5 text-xs text-[#78716C] font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]/40" />
              <span>Private by design</span>
              <span className="text-[#1C1917]/25">•</span>
              <span>You stay in control</span>
            </div>
          </div>

          {/* Right Column: Editorial Journey Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] bg-[#FFF2DB] rounded-3xl p-8 sm:p-10 border border-[#1C1917]/10 relative shadow-sm">
              
              {/* Destination: HOME */}
              <div className="pb-6 border-b border-[#1C1917]/10 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-sans tracking-[0.2em] uppercase text-[#78716C] font-medium">
                    Destination
                  </span>
                  <span className="font-serif text-2xl text-[#1C1917]">
                    HOME
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#1C1917]/20" />
              </div>

              {/* Journey Path */}
              <div className="py-10 px-4 flex flex-col items-center relative">
                {/* Dotted path */}
                <div className="w-px h-36 border-l-2 border-dashed border-[#1C1917]/20 relative flex flex-col justify-between items-center py-2">
                  <div className="w-2 h-2 rounded-full bg-[#1C1917]/20 -ml-1" />
                  <div className="w-2 h-2 rounded-full bg-[#1C1917]/20 -ml-1" />
                  <div className="w-2 h-2 rounded-full bg-[#1C1917]/20 -ml-1" />
                </div>

                {/* Current Location: YOU */}
                <div className="relative mt-2 flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-[#1C1917] flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#FFFAF3]" />
                  </div>
                  <span className="mt-2 text-xs font-sans font-semibold tracking-wider text-[#1C1917] uppercase">
                    YOU
                  </span>

                  {/* Tiny SakhiShield safety indicator pill */}
                  <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFAF3] rounded-full border border-[#1C1917]/10 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#F62440]" />
                    <span className="font-sans text-xs text-[#1C1917] font-medium">
                      SakhiShield is with you
                    </span>
                  </div>
                </div>
              </div>

              {/* Quiet caption at the base */}
              <div className="pt-6 border-t border-[#1C1917]/10 text-center">
                <p className="font-sans text-xs text-[#78716C] italic">
                  Quiet presence. No alarms, no noise.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
