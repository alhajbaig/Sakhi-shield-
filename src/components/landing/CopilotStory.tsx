import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { Shield, MapPin, PhoneCall, AlertTriangle, Eye, Navigation, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type CopilotMode = 'safe' | 'uncomfortable' | 'emergency';

export const CopilotStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<CopilotMode>('uncomfortable');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Scroll-triggered animations for header and cards
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

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
            trigger: leftColRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const safePlaces = [
    { name: 'Chaayos 24/7 Café', dist: '450 m', type: 'OPEN HAVEN', lit: 'Khula café • Well-lit avenue' },
    { name: 'Fortis Care Centre', dist: '700 m', type: 'HOSPITAL', lit: '24/7 Gate security' },
    { name: 'Nexus Mall Atrium', dist: '900 m', type: 'COMMERCIAL', lit: 'Guarded entrance' },
    { name: 'Koramangala Police Station', dist: '1.2 km', type: 'OFFICIAL', lit: 'Emergency desk' },
  ];

  return (
    <section
      id="safety-copilot"
      ref={containerRef}
      className="py-24 md:py-36 bg-[#FFF2DB]/60 border-b border-[#171515]/10 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
        
        {/* Section Header */}
        <div ref={headerRef} className="max-w-[840px] mb-12">
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-3 block">
            CONTEXTUAL ACTION GUIDANCE • KABHI BHI BINA WAJAH PANIC NAHI
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171515] tracking-tight mb-4">
            When something doesn't feel right,<br />
            you don't always need an answer.<br />
            <span className="italic text-[#F62440]">You need a next step.</span>
          </h2>
          <p className="font-serif text-xl sm:text-2xl text-[#171515] italic">
            “Panic nahi. Pehle next step.”
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <span className="font-mono text-xs text-[#625B55] uppercase tracking-wider mr-2 hidden sm:inline">
            SITUATION SIMULATE KAREIN:
          </span>
          <button
            onClick={() => setActiveMode('safe')}
            data-cursor="pointer"
            className={`px-5 py-2.5 rounded-full font-mono text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
              activeMode === 'safe'
                ? 'bg-[#171515] text-[#FFFAF3] shadow-xs'
                : 'bg-[#FFFAF3] text-[#625B55] hover:bg-[#FFE5BF]'
            }`}
          >
            ● SAB THEEK HAI (SAFE)
          </button>
          <button
            onClick={() => setActiveMode('uncomfortable')}
            data-cursor="pointer"
            className={`px-5 py-2.5 rounded-full font-mono text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
              activeMode === 'uncomfortable'
                ? 'bg-[#FFE5BF] text-[#171515] border border-[#171515]/20 font-bold shadow-xs'
                : 'bg-[#FFFAF3] text-[#625B55] hover:bg-[#FFE5BF]'
            }`}
          >
            ● KUCH AJEEB LAG RAHA HAI
          </button>
          <button
            onClick={() => setActiveMode('emergency')}
            data-cursor="pointer"
            className={`px-5 py-2.5 rounded-full font-mono text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
              activeMode === 'emergency'
                ? 'bg-[#F62440] text-[#FFFAF3] font-bold shadow-xs'
                : 'bg-[#FFFAF3] text-[#625B55] hover:bg-[#FFE5BF]'
            }`}
          >
            ● EMERGENCY (SOS)
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Decision Action System */}
          <div ref={leftColRef} className="lg:col-span-7">
            <div
              className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
                activeMode === 'emergency'
                  ? 'bg-[#FFFAF3] border-[#F62440] shadow-xl'
                  : 'bg-[#FFFAF3] border-[#171515]/10 shadow-md'
              }`}
            >
              {/* Header inside Copilot Card */}
              <div className="flex items-center justify-between pb-6 border-b border-[#171515]/10">
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#625B55] block">
                    CURRENT STATE DETECTED
                  </span>
                  <span className="font-serif text-2xl text-[#171515]">
                    {activeMode === 'safe' && '“Normal Commute • Sab peaceful hai”'}
                    {activeMode === 'uncomfortable' && '“Lag raha hai koi follow kar raha hai”'}
                    {activeMode === 'emergency' && '“Turant help chahiye • High Priority”'}
                  </span>
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    activeMode === 'safe'
                      ? 'bg-emerald-500'
                      : activeMode === 'uncomfortable'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-[#F62440] animate-ping'
                  }`}
                />
              </div>

              {/* Action Buttons depending on Mode */}
              <div className="py-6 space-y-3">
                <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#625B55] block mb-2">
                  RECOMMENDED NEXT ACTIONS (1-TAP):
                </span>

                {activeMode === 'safe' && (
                  <>
                    <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-center justify-between hover:bg-[#FFE5BF] transition-colors">
                      <div className="flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-[#171515]" />
                        <div>
                          <div className="font-sans text-sm font-semibold text-[#171515]">Active commute dekhein</div>
                          <div className="font-sans text-xs text-[#625B55]">Optimal arrival in 18 minutes</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#625B55]" />
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-center justify-between hover:bg-[#FFE5BF] transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[#171515]" />
                        <div>
                          <div className="font-sans text-sm font-semibold text-[#171515]">Silent check-in reminder</div>
                          <div className="font-sans text-xs text-[#625B55]">Agla quiet prompt 10 minute mein</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#625B55]" />
                    </div>
                  </>
                )}

                {activeMode === 'uncomfortable' && (
                  <>
                    <div className="p-4 rounded-2xl bg-[#FFE5BF] border border-[#171515]/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#F62440]" />
                        <div>
                          <div className="font-sans text-sm font-bold text-[#171515]">Reroute to Nearest Safe Haven</div>
                          <div className="font-sans text-xs text-[#625B55]">Verified 24/7 commercial haven 450m ahead on well-lit road</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#F62440]">REROUTE →</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PhoneCall className="w-5 h-5 text-[#171515]" />
                        <div>
                          <div className="font-sans text-sm font-semibold text-[#171515]">Dispatch Discreet Guardian Alert</div>
                          <div className="font-sans text-xs text-[#625B55]">Silent GPS coordinates transmitted to primary circle</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#171515] font-bold">DISPATCH</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-[#171515]" />
                        <div>
                          <div className="font-sans text-sm font-semibold text-[#171515]">Initiate Ambient Audio Buffer</div>
                          <div className="font-sans text-xs text-[#625B55]">Encrypted and saved directly to private incident vault</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#171515] font-bold">START</span>
                    </div>
                  </>
                )}

                {activeMode === 'emergency' && (
                  <>
                    <div className="p-5 rounded-2xl bg-[#F62440] text-white flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-white" />
                        <div>
                          <div className="font-sans text-base font-bold text-white">TRIGGER MANUAL SOS</div>
                          <div className="font-sans text-xs text-white/90">Continuous live tracking + Emergency Siren option</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-white text-[#F62440] font-mono text-xs font-bold rounded-full">
                        ACTIVE
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFFAF3] border border-[#F62440]/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PhoneCall className="w-5 h-5 text-[#F62440]" />
                        <div>
                          <div className="font-sans text-sm font-bold text-[#171515]">Direct Emergency Helpline (112)</div>
                          <div className="font-sans text-xs text-[#625B55]">National women safety dispatch network</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#F62440]">CALL 112</span>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Reassurance */}
              <div className="pt-4 border-t border-[#171515]/10 flex items-center justify-between text-xs font-sans text-[#625B55]">
                <span>Koi chat ya delay nahi. 1-Tap me action.</span>
                <span className="font-mono text-[10px] text-[#171515] font-semibold">ZERO FRICTION</span>
              </div>
            </div>
          </div>

          {/* Right Column: Safe Places Proximity Interface */}
          <div ref={rightColRef} className="lg:col-span-5">
            <div className="bg-[#FFFAF3] rounded-3xl p-6 sm:p-8 border border-[#171515]/10 shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-[#171515]/10 mb-6">
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#625B55] block">
                    PROXIMITY HAVENS • AAS-PAAS KI JAGAH
                  </span>
                  <h3 className="font-serif text-2xl text-[#171515]">
                    Safe Places Near You
                  </h3>
                </div>
                <MapPin className="w-5 h-5 text-[#F62440]" />
              </div>

              <p className="font-sans text-xs text-[#625B55] mb-6 leading-relaxed">
                Raat ke waqt akele chalte huye agar ajeeb lage, toh yeh janna zaroori hai ki aage kaunsi dukaan ya hospital khula hai jahan aap ja sakte hain.
              </p>

              {/* Proximity List */}
              <div className="space-y-3.5">
                {safePlaces.map((place) => (
                  <div
                    key={place.name}
                    className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-center justify-between hover:bg-[#FFE5BF] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-bold text-[#171515]">
                          {place.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FFFAF3] text-[#171515] font-medium border border-[#171515]/10">
                          {place.type}
                        </span>
                        <span className="font-sans text-xs text-[#625B55]">
                          {place.lit}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-[#171515] block">
                        {place.dist}
                      </span>
                      <span className="font-mono text-[10px] text-[#F62440] font-bold">
                        WALKABLE
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#171515]/10 text-center">
                <span className="font-sans text-xs text-[#625B55] italic">
                  Hamesha safe jagah ki taraf aage badhein.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
