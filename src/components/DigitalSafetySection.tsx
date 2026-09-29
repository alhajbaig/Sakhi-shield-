import React from 'react';
import { DigitalAnalysisPanel } from './product/DigitalAnalysisPanel';
import { Cpu, Eye, Lock } from 'lucide-react';

export const DigitalSafetySection: React.FC = () => {
  return (
    <section id="feature-03" className="py-24 md:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Layer Header with Feature 03 of 04 Banner */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              FEATURE 03 OF 04
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            DIGITAL THREAT INTELLIGENCE
          </span>
        </div>

        {/* Editorial Headline */}
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-xs tracking-widest text-[#F62440] uppercase font-bold mb-2 block">
            03 · DIGITAL HARASSMENT INTELLIGENCE
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.08] mb-4">
            “Your digital safety belongs in the same story.”
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#44403C] leading-relaxed">
            Harassment often arrives via chat messages or DM threats before or during a physical journey.
            SakhiShield extracts text with on-device OCR to detect intimidation patterns without sharing
            your raw screenshots with any cloud service.
          </p>
        </div>

        {/* Large Interactive Pipeline Interface */}
        <div className="my-8 max-w-5xl mx-auto">
          <DigitalAnalysisPanel />
        </div>

        {/* 3-Column Technical Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#1C1917]/15 mt-12 max-w-5xl mx-auto">
          <div className="p-4 bg-[#FFF2DB]/50 border border-[#1C1917]/15 rounded-lg">
            <div className="font-mono text-xs font-bold text-[#1C1917] uppercase mb-1.5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#F62440]" />
              <span>ON-DEVICE OCR</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-normal">
              Text is extracted locally on your phone. Private images never leave your device.
            </p>
          </div>

          <div className="p-4 bg-[#FFF2DB]/50 border border-[#1C1917]/15 rounded-lg">
            <div className="font-mono text-xs font-bold text-[#1C1917] uppercase mb-1.5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#1C1917]" />
              <span>PATTERN DETECTION</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-normal">
              Detects explicit intimidation, stalker location references, and repeated harassment.
            </p>
          </div>

          <div className="p-4 bg-[#FFF2DB]/50 border border-[#1C1917]/15 rounded-lg">
            <div className="font-mono text-xs font-bold text-[#1C1917] uppercase mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1C1917]" />
              <span>VAULT EVIDENCE LINK</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-normal">
              Instantly anchors digital threat screenshots to your physical journey timestamp.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
