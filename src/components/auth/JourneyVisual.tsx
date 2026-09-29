import React from 'react';

export const JourneyVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[380px] bg-[#FFFAF3] rounded-3xl p-8 border border-[#171515]/10 shadow-md">
      {/* Destination: HOME */}
      <div className="pb-5 border-b border-[#171515]/10 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#625B55] block">
            DESTINATION
          </span>
          <span className="font-serif text-2xl text-[#171515]">
            HOME
          </span>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#171515]/20" />
      </div>

      {/* Vertical Journey Line */}
      <div className="py-8 flex flex-col items-center relative">
        {/* Origin / Top Node */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#171515]/30" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#625B55]">
            DAILY COMMUTE
          </span>
        </div>

        {/* Dotted path */}
        <div className="w-px h-28 border-l-2 border-dashed border-[#171515]/20 relative flex flex-col justify-around items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#171515]/20 -ml-[4px]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#171515]/20 -ml-[4px]" />
        </div>

        {/* The Returning YOU position */}
        <div className="my-3 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#F62440]/15 animate-safety-radius absolute" />
            <div className="w-8 h-8 rounded-full bg-[#171515] flex items-center justify-center shadow-xs z-10 border border-[#FFFAF3]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F62440]" />
            </div>
          </div>
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#171515] uppercase mt-2">
            YOU
          </span>
        </div>

        {/* Central Safety Badge */}
        <div className="mt-4 px-4 py-1.5 bg-[#FFE5BF] rounded-full border border-[#171515]/10 shadow-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F62440] animate-pulse" />
          <span className="font-mono text-xs font-semibold text-[#171515] tracking-wider uppercase">
            SAKHI IS WITH YOU
          </span>
        </div>
      </div>

      {/* Bottom Reassurance */}
      <div className="pt-5 border-t border-[#171515]/10 text-center">
        <p className="font-serif text-sm text-[#171515] italic">
          “Welcome back to your private safety space.”
        </p>
      </div>
    </div>
  );
};
