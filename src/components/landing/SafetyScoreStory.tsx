import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { Info, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SignalItem {
  id: string;
  name: string;
  points: number;
  description: string;
  defaultActive: boolean;
}

const SIGNALS: SignalItem[] = [
  { id: 'base', name: 'Akele Safar (Baseline)', points: 20, description: 'Single traveler baseline journey state', defaultActive: true },
  { id: 'latenight', name: 'Raat Ka Safar (Post 9:30 PM)', points: 10, description: 'Kam roshni aur kam public transport ka samay', defaultActive: true },
  { id: 'deviation', name: 'Rasta Badalna (>150m)', points: 20, description: 'Regular raste se alag direction mein jaana', defaultActive: false },
  { id: 'pause', name: 'Achanak Ruk Jaana (>5 mins)', points: 15, description: 'Bina kisi reason sunsaan jagah rukna', defaultActive: false },
  { id: 'checkin', name: 'Prompt Ka Jawab Na Dena', points: 25, description: 'Check-in vibrate hone par koi response na aana', defaultActive: false },
];

export const SafetyScoreStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeSignals, setActiveSignals] = useState<Record<string, boolean>>({
    base: true,
    latenight: true,
    deviation: false,
    pause: false,
    checkin: false,
  });

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

  const toggleSignal = (id: string) => {
    setActiveSignals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentScore = SIGNALS.reduce((sum, s) => {
    return sum + (activeSignals[s.id] ? s.points : 0);
  }, 0);

  const getStatusLabel = (score: number) => {
    if (score < 40) return { label: 'SAB THEEK • ROUTINE', color: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (score < 65) return { label: 'DHYAN RAKHEIN • MONITORING', color: 'text-amber-700', bg: 'bg-amber-50' };
    return { label: 'ALERT READY • ESCALATION', color: 'text-[#F62440]', bg: 'bg-[#FFE5BF]' };
  };

  const status = getStatusLabel(currentScore);

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-36 bg-transparent border-b border-[#171515]/10 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Conceptual Explanation */}
          <div ref={leftColRef} className="lg:col-span-6">
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-4 block">
              TRANSPARENT SYSTEM • KOI BLACK-BOX MAGIC NAHI
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#171515] tracking-tight mb-6">
              Your safety status is based on observable signals.
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#625B55] leading-relaxed mb-6 font-normal">
              SakhiShield koi mann padhne ka daawa nahi karta. Yeh real, observable signals ko transparent tareeqe se dekhta hai — taaki jab zaroorat ho, tab sahi madad mil sake.
            </p>

            {/* Mandatory Disclaimer Box */}
            <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-start gap-3 mb-8">
              <Info className="w-5 h-5 text-[#625B55] shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-[#625B55] leading-relaxed">
                <strong className="text-[#171515]">Important:</strong> Yeh koi crime prediction nahi hai. Yeh ek explainable decision tool hai jo aapke safar ko aasan banata hai.
              </p>
            </div>

            <p className="font-serif text-xl sm:text-2xl text-[#171515] italic">
              Signals par click karke dekhein score kaise react karta hai.
            </p>
          </div>

          {/* Right Column: Interactive Score Meter & Signal Checklist */}
          <div ref={rightColRef} className="lg:col-span-6">
            <div className="bg-[#FFF2DB] rounded-3xl p-6 sm:p-10 border border-[#171515]/10 shadow-md">
              {/* Score Display Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#171515]/10 mb-6">
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#625B55] block">
                    OBSERVABLE RISK INDEX
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-5xl sm:text-6xl text-[#171515]">
                      {currentScore}
                    </span>
                    <span className="font-mono text-sm text-[#625B55]">/ 100 MAX</span>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-full font-mono text-xs font-bold ${status.bg} ${status.color} border border-[#171515]/10`}>
                  {status.label}
                </div>
              </div>

              {/* Interactive Signal Checklist */}
              <div className="space-y-2.5 mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-[#625B55] block mb-2">
                  SIGNALS TEST KAREIN (TAP TO TOGGLE):
                </span>

                {SIGNALS.map((sig) => {
                  const active = activeSignals[sig.id];
                  return (
                    <button
                      key={sig.id}
                      onClick={() => toggleSignal(sig.id)}
                      data-cursor="pointer"
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        active
                          ? 'bg-[#FFFAF3] border-[#171515]/20 shadow-xs'
                          : 'bg-[#FFFAF3]/40 border-[#171515]/5 hover:bg-[#FFFAF3]/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            active
                              ? 'bg-[#171515] border-[#171515] text-[#FFFAF3]'
                              : 'border-[#171515]/20'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className={`font-sans text-xs sm:text-sm font-semibold block ${active ? 'text-[#171515]' : 'text-[#625B55]'}`}>
                            {sig.name}
                          </span>
                          <span className="font-sans text-[11px] text-[#625B55]">
                            {sig.description}
                          </span>
                        </div>
                      </div>
                      <span className={`font-mono text-xs font-bold ${active ? 'text-[#F62440]' : 'text-[#625B55]'}`}>
                        +{sig.points}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explainability Footer */}
              <div className="pt-4 border-t border-[#171515]/10 flex items-center justify-between text-xs font-mono text-[#625B55]">
                <span>TOTAL FACTORS: {Object.values(activeSignals).filter(Boolean).length} ACTIVE</span>
                <span className="text-[#171515] font-semibold">100% TRANSPARENT</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
