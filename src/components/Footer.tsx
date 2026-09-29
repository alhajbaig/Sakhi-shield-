import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171515] text-[#FFFAF3] py-16 md:py-20 border-t border-[#171515]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-[#FFFAF3]/10">
          
          {/* Brand & Slogan */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-[#F62440] rounded-full animate-heartbeat" />
              <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-[#FFFAF3]">
                SAKHISHIELD
              </span>
            </div>
            <p className="font-serif text-lg text-[#FFE5BF] italic">
              A personal safety companion.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 font-sans text-xs text-[#FFFAF3]/70 font-normal">
            <a href="#safety-loop" className="hover:text-[#FFFAF3] transition-colors">
              How it works
            </a>
            <a href="#walk-with-me" className="hover:text-[#FFFAF3] transition-colors">
              Walk With Me
            </a>
            <a href="#safety-copilot" className="hover:text-[#FFFAF3] transition-colors">
              Safety Copilot
            </a>
            <a href="#digital-safety" className="hover:text-[#FFFAF3] transition-colors">
              Digital Safety
            </a>
            <a href="#incident-vault" className="hover:text-[#FFFAF3] transition-colors">
              Incident Vault
            </a>
            <a href="#privacy-story" className="hover:text-[#FFFAF3] transition-colors">
              Privacy
            </a>
          </nav>

        </div>

        {/* Bottom Microcopy */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-[#FFFAF3]/40">
          <div>
            © 2026 SakhiShield. Made for safer journeys.
          </div>
          <div className="flex items-center gap-6">
            <span>Private by architecture</span>
            <span>•</span>
            <span>You stay in control</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
