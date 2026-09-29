import React from 'react';
import { Navigation, Compass, ScanText, Lock, ArrowDown } from 'lucide-react';

export const FeaturesNavigator: React.FC = () => {
  const features = [
    {
      num: '01',
      id: 'feature-01',
      name: 'ADAPTIVE SAFETY GUARDIAN',
      type: 'PHYSICAL DEFENSE',
      tagline: 'Your journey, watched without being watched',
      summary: 'Compares your actual path against expected route corridors, catching deviations and prolonged stops.',
      icon: Navigation,
      color: 'bg-[#FFFAF3]',
    },
    {
      num: '02',
      id: 'feature-02',
      name: 'SAFETY COPILOT',
      type: 'ACTION GUIDANCE',
      tagline: 'Know what to do next when something feels wrong',
      summary: 'Translates signals into practical options across 3 distinct states: Safe, Uncomfortable, and Emergency.',
      icon: Compass,
      color: 'bg-[#FFF2DB]',
    },
    {
      num: '03',
      id: 'feature-03',
      name: 'DIGITAL HARASSMENT INTELLIGENCE',
      type: 'CYBER DEFENSE',
      tagline: 'Your digital safety in the same story',
      summary: 'Extracts message text from screenshots with on-device OCR to detect intimidation patterns and location threats.',
      icon: ScanText,
      color: 'bg-[#FFFAF3]',
    },
    {
      num: '04',
      id: 'feature-04',
      name: 'PRIVATE INCIDENT VAULT',
      type: 'EVIDENCE RECORD',
      tagline: 'Keep the complete story together',
      summary: 'Secures GPS events, timestamps, chat logs, and alerts in a zero-knowledge, tamper-evident cryptographic vault.',
      icon: Lock,
      color: 'bg-[#FFF2DB]',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#FFFAF3] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Top Feature Index Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF2DB] border border-[#1C1917]/20 rounded-full font-mono text-xs uppercase tracking-wider text-[#1C1917] font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F62440]" />
            <span>EXACTLY 4 CONNECTED CORE CAPABILITIES</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight leading-[1.08] mb-4">
            The 4 Core Features of SakhiShield
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#57534E] leading-relaxed">
            Every feature protects a distinct phase of your physical and digital life. Click any feature
            to jump directly into its live interactive simulation.
          </p>
        </div>

        {/* 4 Feature Interactive Jump Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <a
                key={feat.num}
                href={`#${feat.id}`}
                className={`p-6 border border-[#1C1917]/20 ${feat.color} rounded-xl hover:border-[#F62440] hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
                    <span className="font-mono text-2xl font-bold text-[#F62440]">
                      {feat.num}
                    </span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#78716C] px-2 py-0.5 bg-[#1C1917]/5 rounded">
                      {feat.type}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-[#1C1917] text-[#FFFAF3] flex items-center justify-center mb-4 group-hover:bg-[#F62440] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] mb-2 leading-snug group-hover:text-[#F62440] transition-colors">
                    {feat.name}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#44403C] leading-relaxed mb-4">
                    {feat.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between text-xs font-mono font-bold text-[#1C1917] group-hover:text-[#F62440]">
                  <span>JUMP TO PREVIEW</span>
                  <ArrowDown className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
