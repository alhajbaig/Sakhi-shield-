import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { Lock, FileCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEvent {
  time: string;
  title: string;
  detail: string;
  isRed?: boolean;
}

const EVENTS: TimelineEvent[] = [
  { time: '22:41', title: 'Route deviation notice hua', detail: 'Commute corridor se 180m alag direction mein movement' },
  { time: '22:42', title: 'Silent check-in prompt bheja gaya', detail: 'Haptic vibration delivered: "Sab theek hai na?"' },
  { time: '22:43', title: 'No response (Time out)', detail: 'Corridor watchdog ne escalation protocol prepare kiya', isRed: true },
  { time: '22:43', title: 'Trusted circle notified', detail: 'Live coordinates Papa aur Aanya ke phone par silently share huye', isRed: true },
  { time: '22:44', title: 'Evidence automatically added', detail: 'Screenshot aur audio snippet encrypted timestamp ke saath jud gaya' },
  { time: '22:47', title: 'Safe arrival confirmed', detail: 'User ne passkey enter ki, tracking band aur details vault me seal ho gayi' },
];

export const IncidentVaultStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        timelineRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
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
      id="incident-vault"
      ref={containerRef}
      className="py-24 md:py-36 bg-[#FFF2DB]/60 border-b border-[#171515]/10 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Archive Philosophy & Meaning */}
          <div ref={leftColRef} className="lg:col-span-5">
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-4 block">
              PRIVATE EVIDENCE ARCHIVE • SAB YAAD RAKHNE KI ZAROORAT NAHI
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#171515] tracking-tight mb-6">
              If something happens,<br />
              you shouldn't have to<br />
              remember everything.
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#625B55] leading-relaxed mb-8">
              Mushkil waqt mein exact ghadi ka time, raste ke mod aur messages yaad rakhna bohot mushkil hota hai. SakhiShield har cheez ko date-time ke saath ek secure chronological dossier bana kar rakhta hai — jo hamesha sirf aapka hota hai.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#171515] text-[#FFFAF3] flex items-center justify-center">
                  <Lock className="w-3 h-3 text-[#FFE5BF]" />
                </div>
                <span className="font-sans text-sm font-semibold text-[#171515]">
                  Zero-Knowledge on-device encrypted storage
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#171515] text-[#FFFAF3] flex items-center justify-center">
                  <FileCheck className="w-3 h-3 text-[#FFE5BF]" />
                </div>
                <span className="font-sans text-sm font-semibold text-[#171515]">
                  Police ya authority report ke liye ready PDF export
                </span>
              </div>
            </div>

            <p className="font-serif text-2xl sm:text-3xl text-[#171515] italic">
              Private. Organized. Sirf aapka.
            </p>
          </div>

          {/* Right Column: Connected Vertical Timeline Component */}
          <div ref={timelineRef} className="lg:col-span-7">
            <div className="bg-[#FFFAF3] rounded-3xl p-6 sm:p-10 border border-[#171515]/10 shadow-lg">
              {/* Dossier Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#171515]/10 mb-8">
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#625B55] block">
                    INCIDENT DOSSIER ARCHIVE
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-[#171515]">
                    12 SEPT 2026 • 22:41 PM
                  </span>
                </div>
                <span className="font-mono text-xs px-3 py-1 bg-[#FFE5BF] rounded-full text-[#171515] font-bold border border-[#171515]/10">
                  SEALED & VERIFIED
                </span>
              </div>

              {/* Vertical Connected Timeline */}
              <div className="relative pl-8 sm:pl-10 space-y-7">
                <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-0.5 bg-[#171515]/15" />

                {EVENTS.map((ev, i) => (
                  <div key={i} className="relative flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <div
                      className={`absolute -left-[27px] sm:-left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-[#FFFAF3] flex items-center justify-center transition-all ${
                        ev.isRed
                          ? 'border-[#F62440] shadow-xs'
                          : 'border-[#171515]/40'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.isRed ? 'bg-[#F62440]' : 'bg-[#171515]'
                        }`}
                      />
                    </div>

                    <span className="font-mono text-xs font-bold text-[#171515] shrink-0 w-16">
                      {ev.time}
                    </span>

                    <div>
                      <h4
                        className={`font-sans text-sm font-semibold ${
                          ev.isRed ? 'text-[#F62440]' : 'text-[#171515]'
                        }`}
                      >
                        {ev.title}
                      </h4>
                      <p className="font-sans text-xs text-[#625B55] mt-0.5">
                        {ev.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dossier Footer Reassurance */}
              <div className="mt-8 pt-6 border-t border-[#171515]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#625B55]">
                <span>ENCRYPTION: AES-256 GCM (CLIENT KEYS ONLY)</span>
                <span className="text-[#171515] font-bold">EXPORTABLE AS PDF / ZIP</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
