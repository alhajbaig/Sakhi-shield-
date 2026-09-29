import React from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  children: React.ReactNode;
  tag?: string;
  headline: React.ReactNode;
  subheadline: string;
  points?: string[];
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  tag = 'SAKHISHIELD SAFETY',
  headline,
  subheadline,
  points = [
    'Zero persistent location tracking',
    'Private and encrypted safety enclave',
    'You decide what to share and when',
  ],
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] text-[#171515] selection:bg-[#171515] selection:text-[#FAF8F5]">
      
      {/* LEFT PANEL: Deep Ink Dual-Tone Identity Panel */}
      <div className="w-full lg:w-[45%] lg:min-h-screen bg-[#141211] text-[#FAF7F2] p-6 py-7 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#171515]/10">
        {/* Brand Header */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="Back to SakhiShield Home"
          >
            <div className="w-2.5 h-2.5 bg-[#F62440] rounded-full" />
            <span className="font-mono text-sm sm:text-base font-bold tracking-[0.18em] text-[#FAF7F2] uppercase">
              SAKHISHIELD
            </span>
          </Link>
        </div>

        {/* Center Editorial Focus */}
        <div className="my-5 lg:my-0 max-w-lg">
          <div className="flex items-center gap-2 mb-2 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F62440]" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#FAF7F2]/60 uppercase">
              {tag}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#FAF7F2] font-normal leading-[1.12] tracking-tight mb-2 sm:mb-4">
            {headline}
          </h1>

          <p className="font-sans text-xs sm:text-base text-[#FAF7F2]/70 leading-relaxed mb-4 lg:mb-8 font-normal">
            {subheadline}
          </p>

          {/* Clean Dual-Tone Pillars (hidden on tiny screens to save scroll space) */}
          {points && points.length > 0 && (
            <div className="hidden sm:block space-y-3 pt-6 border-t border-[#FAF7F2]/10">
              {points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-sans text-[#FAF7F2]/80">
                  <span className="w-1 h-1 rounded-full bg-[#FAF7F2]/40" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiet Footer */}
        <div className="hidden lg:flex items-center justify-between text-[11px] font-mono text-[#FAF7F2]/50 tracking-wider">
          <span>PRIVATE BY ARCHITECTURE</span>
          <span>© 2026 SAKHISHIELD</span>
        </div>
      </div>

      {/* RIGHT PANEL: Calm Warm Off-White Form Panel */}
      <div className="w-full lg:w-[55%] min-h-full lg:min-h-screen bg-[#FAF8F5] p-6 sm:p-12 lg:p-16 flex flex-col justify-between">
        {/* Top Navigation */}
        <div className="flex justify-end items-center">
          <Link
            to="/"
            className="text-xs sm:text-sm font-sans font-medium text-[#625B55] hover:text-[#171515] transition-colors"
          >
            ← Back to story
          </Link>
        </div>

        {/* Centered Minimal Form */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          {children}
        </div>

        {/* Bottom Note */}
        <div className="text-center lg:text-left text-[11px] font-mono text-[#625B55]/70 tracking-wider">
          END-TO-END ENCRYPTED SAFETY ENCLAVE
        </div>
      </div>

    </div>
  );
};

export default AuthShell;
