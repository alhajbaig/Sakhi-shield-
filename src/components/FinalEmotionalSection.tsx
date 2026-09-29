import React from 'react';
import { Link } from 'react-router-dom';

export const FinalEmotionalSection: React.FC = () => {
  return (
    <section className="py-28 md:py-36 lg:py-40 bg-[#FFE5BF] border-b border-[#1C1917]/10">
      <div className="max-w-[880px] mx-auto px-6 md:px-10 text-center">
        
        {/* Headline */}
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight mb-8">
          Go where you need to go.
        </h2>

        {/* Short Affirmations */}
        <div className="space-y-1 mb-8 text-lg sm:text-xl font-sans text-[#44403C] font-normal">
          <p>Study.</p>
          <p>Work.</p>
          <p>Meet your friends.</p>
          <p>Come home late.</p>
          <p>Take the long way.</p>
        </div>

        {/* The Core Truth */}
        <p className="font-serif text-2xl sm:text-3xl text-[#1C1917] mb-8 max-w-xl mx-auto leading-snug">
          Your life shouldn't become smaller because you are afraid.
        </p>

        {/* Reassurance */}
        <p className="font-sans text-base sm:text-lg text-[#44403C] mb-12 max-w-md mx-auto">
          SakhiShield is here to help you feel a little more prepared for the journey.
        </p>

        {/* Hinglish Closing Climax */}
        <div className="mb-14">
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1C1917] italic leading-relaxed">
            “Tum bas apna safar karo.<br className="hidden sm:inline" />
            Baaki, SakhiShield saath hai.”
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#F62440] text-[#FFFAF3] text-sm font-sans font-medium rounded-full hover:bg-[#d91d35] transition-colors shadow-sm"
          >
            <span>Get started</span>
            <span className="text-base leading-none">→</span>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-7 py-4 text-sm font-sans font-medium text-[#1C1917] border border-[#1C1917]/20 rounded-full hover:bg-[#FFFAF3] transition-colors"
          >
            See how it works
          </a>
        </div>

      </div>
    </section>
  );
};
