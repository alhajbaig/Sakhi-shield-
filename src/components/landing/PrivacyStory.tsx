import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { Lock, EyeOff, ShieldCheck, UserCheck, Trash2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const PrivacyStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [locationMode, setLocationMode] = useState<'journey_only' | 'off'>('journey_only');
  const [evidenceMode, setEvidenceMode] = useState<boolean>(true);
  const [autoPurge, setAutoPurge] = useState<boolean>(true);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftColRef.current, rightColRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="privacy-story"
      ref={containerRef}
      className="py-24 md:py-36 bg-[#FFF2DB]/60 border-b border-[#171515]/10 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Trust Statement */}
          <div ref={leftColRef} className="lg:col-span-5">
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-4 block">
              PRIVACY BY DESIGN • AAPKA DATA, AAPKA CONTROL
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#171515] tracking-tight mb-6 leading-tight">
              Your safety should never mean giving up your privacy.
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#625B55] leading-relaxed mb-8 font-normal">
              Zyadatar safety apps 24 ghante background me tracking karti hain. SakhiShield sirf tab active hota hai jab aap akele safar par ho. Ghar pahunchte hi temporary GPS coordinates automatically delete ho jaate hain.
            </p>

            <div className="p-5 rounded-2xl bg-[#FFE5BF] border border-[#171515]/15 mb-6">
              <span className="font-mono text-xs font-bold text-[#171515] uppercase tracking-wider block mb-1">
                OUR STRICT PROMISE
              </span>
              <p className="font-serif text-xl text-[#171515] italic">
                “Koi background spying nahi. Koi ad tracking nahi. Sirf safe journey.”
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Privacy Sovereignty Console */}
          <div ref={rightColRef} className="lg:col-span-7">
            <div className="bg-[#FFFAF3] rounded-3xl p-6 sm:p-10 border border-[#171515]/10 shadow-lg">
              <div className="flex items-center justify-between pb-6 border-b border-[#171515]/10 mb-6">
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#625B55] block">
                    INTERACTIVE PRIVACY CONSOLE
                  </span>
                  <span className="font-serif text-2xl text-[#171515]">
                    Aap Decide Karein. Har Setting.
                  </span>
                </div>
                <Lock className="w-5 h-5 text-[#F62440]" />
              </div>

              {/* Interactive Controls */}
              <div className="space-y-4">
                
                {/* Control 1: Location Sharing */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <EyeOff className="w-5 h-5 text-[#171515] shrink-0" />
                    <div>
                      <span className="font-sans text-sm font-bold text-[#171515] block">
                        LOCATION SHARING
                      </span>
                      <span className="font-sans text-xs text-[#625B55]">
                        {locationMode === 'journey_only'
                          ? 'Sirf active journey ke dauran live sharing'
                          : 'Completely disabled (Manual trigger only)'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setLocationMode(locationMode === 'journey_only' ? 'off' : 'journey_only')
                    }
                    data-cursor="pointer"
                    className="px-4 py-2 bg-[#FFFAF3] border border-[#171515]/20 rounded-full font-mono text-xs font-bold text-[#171515] hover:bg-[#FFE5BF] transition-colors cursor-pointer shrink-0"
                  >
                    {locationMode === 'journey_only' ? 'SAFAR MEIN HI ON' : 'DISABLED'}
                  </button>
                </div>

                {/* Control 2: Evidence Encryption */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#171515] shrink-0" />
                    <div>
                      <span className="font-sans text-sm font-bold text-[#171515] block">
                        INCIDENT VAULT EVIDENCE
                      </span>
                      <span className="font-sans text-xs text-[#625B55]">
                        On-device zero-knowledge encryption
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEvidenceMode(!evidenceMode)}
                    data-cursor="pointer"
                    className="px-4 py-2 bg-[#FFFAF3] border border-[#171515]/20 rounded-full font-mono text-xs font-bold text-[#171515] hover:bg-[#FFE5BF] transition-colors cursor-pointer shrink-0"
                  >
                    {evidenceMode ? 'DEVICE PAR SAFE' : 'CLOUD BACKUP'}
                  </button>
                </div>

                {/* Control 3: Trusted Contacts Permissions */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-[#171515] shrink-0" />
                    <div>
                      <span className="font-sans text-sm font-bold text-[#171515] block">
                        TRUSTED CIRCLE ACCESS
                      </span>
                      <span className="font-sans text-xs text-[#625B55]">
                        Kisko live status dikhega, yeh aap tay karein
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-[#FFFAF3] border border-[#171515]/20 rounded-full font-mono text-xs font-bold text-[#171515]">
                    2 GUARDIANS
                  </span>
                </div>

                {/* Control 4: Ephemeral Auto-Purge */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-[#171515] shrink-0" />
                    <div>
                      <span className="font-sans text-sm font-bold text-[#171515] block">
                        COORDINATE AUTO-PURGE
                      </span>
                      <span className="font-sans text-xs text-[#625B55]">
                        Ghar pahunchte hi location history delete
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoPurge(!autoPurge)}
                    data-cursor="pointer"
                    className="px-4 py-2 bg-[#FFFAF3] border border-[#171515]/20 rounded-full font-mono text-xs font-bold text-[#171515] hover:bg-[#FFE5BF] transition-colors cursor-pointer shrink-0"
                  >
                    {autoPurge ? 'GHAR PAHUNCHTE HI DELETE' : '24H RAKHO'}
                  </button>
                </div>

              </div>

              {/* Console Footnote */}
              <div className="mt-8 pt-5 border-t border-[#171515]/10 text-center">
                <span className="font-mono text-xs text-[#F62440] font-semibold">
                  ● ZERO BACKGROUND TRACKING OUTSIDE JOURNEYS
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
