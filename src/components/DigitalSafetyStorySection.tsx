import React from 'react';
import { ArrowDown } from 'lucide-react';

export const DigitalSafetyStorySection: React.FC = () => {
  const examples = [
    'Threatening message',
    'Repeated unwanted contact',
    'Location-related threat',
    'Suspicious communication',
  ];

  return (
    <section id="digital-safety" className="py-24 md:py-32 lg:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Context & Examples */}
          <div className="lg:col-span-6">
            <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] text-[#78716C] uppercase mb-3 block">
              DIGITAL COMFORT & SECURITY
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight mb-6">
              Safety isn't only about the road.
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#44403C] leading-relaxed mb-8">
              Sometimes the thing making you uncomfortable is sitting in your phone.
            </p>

            <div className="space-y-2.5 mb-8">
              {examples.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm sm:text-base font-sans text-[#44403C]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F62440]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="font-sans text-sm sm:text-base text-[#78716C] leading-relaxed">
              SakhiShield can help identify potential safety signals and help you preserve important evidence.
            </p>
          </div>

          {/* Right Column: Visual Minimal Message Flow */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] bg-[#FFF2DB] rounded-3xl p-6 sm:p-8 border border-[#1C1917]/10 shadow-sm flex flex-col items-center">
              
              {/* Step 1: The Incoming Message */}
              <div className="w-full bg-[#FFFAF3] rounded-2xl p-5 border border-[#1C1917]/10 shadow-xs">
                <span className="block text-[11px] font-sans tracking-wider uppercase text-[#78716C] mb-2 font-medium">
                  MESSAGE
                </span>
                <p className="font-serif text-base text-[#1C1917] leading-snug">
                  “Don't ignore me. I know where you live.”
                </p>
              </div>

              {/* Arrow Down */}
              <div className="py-3 flex justify-center text-[#78716C]">
                <ArrowDown className="w-4 h-4 stroke-[1.5]" />
              </div>

              {/* Step 2: Signal Indicator */}
              <div className="w-full bg-[#FFE5BF] rounded-2xl p-4 border border-[#1C1917]/10 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F62440]" />
                  <span className="font-sans text-xs font-semibold text-[#1C1917]">
                    Potential safety signal detected
                  </span>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="py-3 flex justify-center text-[#78716C]">
                <ArrowDown className="w-4 h-4 stroke-[1.5]" />
              </div>

              {/* Step 3: Calm Evidence Action */}
              <div className="w-full">
                <div className="w-full py-3 bg-[#FFFAF3] rounded-full border border-[#1C1917]/20 text-center">
                  <span className="font-sans text-xs font-medium text-[#1C1917]">
                    Save this evidence
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
