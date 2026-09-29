import React from 'react';
import { IncidentTimeline } from './product/IncidentTimeline';
import { ShieldCheck, FileKey } from 'lucide-react';

export const IncidentVaultSection: React.FC = () => {
  return (
    <section id="feature-04" className="py-24 md:py-36 bg-[#FFF2DB] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Layer Header with Feature 04 of 04 Banner */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              FEATURE 04 OF 04
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            SECURE EVIDENCE ARCHIVE
          </span>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Text */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#F62440] uppercase font-bold mb-2 block">
                04 · PRIVATE INCIDENT VAULT
              </span>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.08] mb-5">
                “When something happens, keep the story together.”
              </h2>

              <p className="font-sans text-base sm:text-lg text-[#44403C] leading-relaxed mb-6">
                The Incident Vault automatically transforms scattered safety information into one structured,
                privacy-controlled record. No more lost screenshots or forgotten timelines.
              </p>

              <div className="space-y-3 pt-4 border-t border-[#1C1917]/15 font-sans text-sm text-[#44403C]">
                <div className="p-3 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-lg flex items-start gap-3">
                  <FileKey className="w-4 h-4 text-[#F62440] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#1C1917] block font-mono text-xs uppercase tracking-wider">
                      Zero-Knowledge Encryption
                    </strong>
                    Encrypted with your private passkey. Not even SakhiShield can read your vault data.
                  </div>
                </div>

                <div className="p-3 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-lg flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#1C1917] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#1C1917] block font-mono text-xs uppercase tracking-wider">
                      Tamper-Evident SHA-256 Timestamps
                    </strong>
                    Mathematical proof verifies that timestamps were never edited after the event.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-3.5 border border-[#1C1917]/15 bg-[#FFFAF3] rounded-lg font-mono text-xs text-[#57534E]">
              VAULT FORMAT: SHA-256 TIMESTAMPED • EXPORT PRIVILEGES: USER ONLY
            </div>
          </div>

          {/* Right Product Preview: Incident Timeline Component */}
          <div className="lg:col-span-7">
            <IncidentTimeline incidentId="SK-2048" />
          </div>

        </div>

      </div>
    </section>
  );
};
