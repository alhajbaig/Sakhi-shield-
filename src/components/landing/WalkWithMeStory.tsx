import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { Navigation, CheckCircle2, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type JourneyPhase = 'start' | 'active' | 'deviation' | 'checkin' | 'safe';

export const WalkWithMeStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<JourneyPhase>('active');
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance reveal when section enters view
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
        rightColRef.current,
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

      // Smooth scroll demonstration without pinning
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 65%',
        end: 'bottom 25%',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.2) setPhase('start');
          else if (p < 0.45) setPhase('active');
          else if (p < 0.7) setPhase('deviation');
          else if (p < 0.9) setPhase('checkin');
          else setPhase('safe');
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="walk-with-me"
      ref={containerRef}
      className="relative min-h-screen bg-transparent py-20 md:py-28 border-b border-[#171515]/10 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-[1280px] w-full mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Narrative & Steps */}
          <div ref={leftColRef} className="lg:col-span-5">
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-3 block">
              SIGNATURE COMPANION • AKELAPAN KHATAM
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#625B55] font-normal mb-1">
              Ghar akele jaana pad raha hai?
            </h2>

            <p className="font-serif text-4xl sm:text-6xl text-[#171515] tracking-tight mb-6">
              Walk With Me.
            </p>

            <div className="space-y-3 text-base sm:text-lg font-sans text-[#625B55] mb-8 font-normal leading-relaxed">
              <p>SakhiShield ko batao kahan ja rahe ho.</p>
              <p>Safar shuru karo.</p>
              <p className="text-[#171515] font-semibold">Phir bas befikr aage badho.</p>
            </div>

            {/* Interactive Phase Indicators for manual switching */}
            <div className="space-y-2 mb-8">
              {[
                { key: 'start', label: '1. Destination select kiya: GHAR (Home)' },
                { key: 'active', label: '2. Silent corridor monitoring active' },
                { key: 'deviation', label: '3. Rasta badla — Anomaly alert' },
                { key: 'checkin', label: '4. Gentle check-in: "Sab theek?"' },
                { key: 'safe', label: '5. Safe arrival verified' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setPhase(item.key as JourneyPhase)}
                  data-cursor="pointer"
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    phase === item.key
                      ? 'bg-[#FFE5BF] text-[#171515] font-bold border border-[#171515]/20 shadow-xs'
                      : 'text-[#625B55] hover:bg-[#FFF2DB]'
                  }`}
                >
                  <span>{item.label}</span>
                  {phase === item.key && (
                    <span className="w-2 h-2 rounded-full bg-[#F62440]" />
                  )}
                </button>
              ))}
            </div>

            {/* Emotional Highlight */}
            <div className="p-5 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10">
              <p className="font-serif text-xl sm:text-2xl text-[#171515] italic">
                “Continuous accompaniment until arrival.”
              </p>
              <p className="font-sans text-xs text-[#625B55] mt-1">
                From transit hubs to your front door — silent, automated corridor verification.
              </p>
            </div>
          </div>

          {/* Right Column: Abstract Safety Journey Map Interface */}
          <div ref={rightColRef} className="lg:col-span-7">
            <div className="bg-[#FFF2DB] rounded-3xl p-6 sm:p-8 border border-[#171515]/10 shadow-lg relative">
              
              {/* Journey Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#171515]/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#171515] text-[#FFFAF3] flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-[#F62440]" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#625B55] block">
                      JOURNEY MONITORING
                    </span>
                    <span className="font-serif text-lg text-[#171515]">
                      {phase === 'start' && 'Destination: Home (2.4 km)'}
                      {phase === 'active' && 'On Route • Corridors Secure'}
                      {phase === 'deviation' && 'Route deviation detected (+620m)'}
                      {phase === 'checkin' && 'Check-in Prompt: Are you safe?'}
                      {phase === 'safe' && 'Safe arrival confirmed'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFAF3] rounded-full text-xs font-mono font-semibold text-[#171515] border border-[#171515]/10">
                    <span className="w-2 h-2 rounded-full bg-[#F62440] animate-pulse" />
                    {phase === 'safe' ? 'REACHED' : 'LIVE'}
                  </span>
                </div>
              </div>

              {/* Abstract Safety Map Surface */}
              <div className="my-6 h-[340px] sm:h-[380px] bg-[#FFFAF3] rounded-2xl border border-[#171515]/10 relative p-6 flex flex-col justify-between overflow-hidden">
                
                {/* Thin geometry & abstract landmarks */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="80" cy="80" r="45" stroke="#171515" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
                    <circle cx="340" cy="280" r="70" stroke="#171515" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
                    <rect x="220" y="40" width="80" height="60" stroke="#171515" strokeWidth="0.5" fill="none" />
                  </svg>
                </div>

                {/* Origin: METRO STATION / START */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#171515]" />
                    <span className="font-mono text-xs font-bold text-[#171515]">
                      METRO STATION GATE 2
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#625B55]">ORIGIN • 21:30</span>
                </div>

                {/* Animated Path & Marker Canvas */}
                <div className="relative flex-1 flex items-center justify-center my-4 z-10">
                  <svg className="w-full h-full" viewBox="0 0 460 220" fill="none">
                    {/* Planned Route Line */}
                    <path
                      d="M 40 40 Q 140 180, 260 90 T 420 180"
                      stroke="#171515"
                      strokeWidth="2"
                      strokeOpacity="0.15"
                      strokeDasharray="4 4"
                    />

                    {/* Active Journey Path */}
                    <path
                      d={
                        phase === 'deviation' || phase === 'checkin'
                          ? "M 40 40 Q 140 180, 260 90 Q 290 50, 340 70"
                          : "M 40 40 Q 140 180, 260 90 T 420 180"
                      }
                      stroke={phase === 'deviation' || phase === 'checkin' ? "#F62440" : "#171515"}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Deviation marker / Alert flag */}
                    {(phase === 'deviation' || phase === 'checkin') && (
                      <g transform="translate(340, 70)">
                        <circle cx="0" cy="0" r="30" fill="#F62440" fillOpacity="0.12" className="animate-safety-radius" />
                        <circle cx="0" cy="0" r="7" fill="#F62440" />
                        <circle cx="0" cy="0" r="2.5" fill="#FFFAF3" />
                        <rect x="14" y="-12" width="130" height="22" rx="4" fill="#F62440" />
                        <text x="22" y="3" className="font-mono text-[10px] fill-white font-bold">
                          +620M ROUTE SHIFT
                        </text>
                      </g>
                    )}

                    {/* Regular YOU position */}
                    {phase === 'active' && (
                      <g transform="translate(230, 115)">
                        <circle cx="0" cy="0" r="24" fill="#F62440" fillOpacity="0.1" className="animate-safety-radius" />
                        <circle cx="0" cy="0" r="6" fill="#F62440" />
                        <circle cx="0" cy="0" r="2" fill="#FFFAF3" />
                        <rect x="12" y="-10" width="36" height="18" rx="4" fill="#171515" />
                        <text x="17" y="3" className="font-mono text-[9px] fill-[#FFFAF3] font-bold">
                          YOU
                        </text>
                      </g>
                    )}

                    {/* Safe Arrival */}
                    {phase === 'safe' && (
                      <g transform="translate(420, 180)">
                        <circle cx="0" cy="0" r="28" fill="#171515" fillOpacity="0.1" />
                        <circle cx="0" cy="0" r="8" fill="#171515" />
                        <circle cx="0" cy="0" r="3" fill="#FFFAF3" />
                      </g>
                    )}
                  </svg>
                </div>

                {/* Destination: HOME */}
                <div className="flex items-center justify-between z-10 pt-2 border-t border-[#171515]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#171515]" />
                    <span className="font-mono text-xs font-bold text-[#171515]">
                      RESIDENCE (HOME)
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#625B55]">TARGET • 21:52</span>
                </div>

                {/* Contextual Check-in Interactive Overlay */}
                {phase === 'checkin' && (
                  <div className="absolute inset-x-4 bottom-4 bg-[#FFFAF3]/95 backdrop-blur-md p-5 rounded-2xl border border-[#F62440]/30 shadow-lg z-20 animate-fadeIn">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-serif text-base text-[#171515]">
                          “Journey is taking longer than expected. Are you safe?”
                        </h4>
                        <p className="font-sans text-xs text-[#625B55]">
                          Confirm your status without false alarm:
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <button
                        onClick={() => {
                          setUserChoice('safe');
                          setPhase('safe');
                        }}
                        className="py-2.5 px-3 bg-[#FFFAF3] hover:bg-[#FFF2DB] border border-[#171515]/20 rounded-xl font-sans text-xs font-semibold text-[#171515] transition-colors cursor-pointer"
                      >
                        I am Safe
                      </button>
                      <button
                        onClick={() => setUserChoice('uncomfortable')}
                        className={`py-2.5 px-3 border rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer ${
                          userChoice === 'uncomfortable'
                            ? 'bg-[#FFE5BF] border-[#171515] text-[#171515]'
                            : 'bg-[#FFFAF3] border-[#171515]/20 text-[#171515]'
                        }`}
                      >
                        Feeling Uneasy
                      </button>
                      <button
                        onClick={() => setUserChoice('help')}
                        className="py-2.5 px-3 bg-[#F62440] text-white hover:bg-[#d91d35] rounded-xl font-sans text-xs font-bold transition-colors shadow-xs cursor-pointer"
                      >
                        Need Help
                      </button>
                    </div>

                    {userChoice === 'uncomfortable' && (
                      <p className="mt-3 font-mono text-[11px] text-[#F62440] text-center font-semibold">
                        ✓ Safety Copilot active • Nearby well-lit safe havens highlighted
                      </p>
                    )}
                  </div>
                )}

                {/* Safe Arrival Confirmation Banner */}
                {phase === 'safe' && (
                  <div className="absolute inset-x-4 bottom-4 bg-[#FFFAF3] p-4 rounded-2xl border border-[#171515]/20 shadow-md z-20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="font-sans text-xs font-bold text-[#171515] block">
                          You have arrived safely.
                        </span>
                        <span className="font-sans text-[11px] text-[#625B55]">
                          Journey complete • Ephemeral GPS telemetry purged
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setPhase('active')}
                      className="px-3 py-1 bg-[#171515] text-[#FFFAF3] text-[11px] font-mono rounded-full cursor-pointer"
                    >
                      Reset Demo
                    </button>
                  </div>
                )}

              </div>

              {/* Console Telemetry Row */}
              <div className="grid grid-cols-3 gap-4 pt-2 text-center">
                <div className="p-3 bg-[#FFFAF3] rounded-xl border border-[#171515]/10">
                  <span className="font-mono text-[10px] text-[#625B55] uppercase block">
                    DISTANCE
                  </span>
                  <span className="font-mono text-sm font-bold text-[#171515]">
                    1.8 / 2.4 KM
                  </span>
                </div>
                <div className="p-3 bg-[#FFFAF3] rounded-xl border border-[#171515]/10">
                  <span className="font-mono text-[10px] text-[#625B55] uppercase block">
                    CORRIDOR
                  </span>
                  <span className="font-mono text-sm font-bold text-[#171515]">
                    {phase === 'deviation' || phase === 'checkin' ? 'DIVERTED' : 'SECURE'}
                  </span>
                </div>
                <div className="p-3 bg-[#FFFAF3] rounded-xl border border-[#171515]/10">
                  <span className="font-mono text-[10px] text-[#625B55] uppercase block">
                    GUARDIANS
                  </span>
                  <span className="font-mono text-sm font-bold text-[#171515]">
                    2 ON STANDBY
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
