import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ManualSOSStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [sosActivated, setSosActivated] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
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
      ref={containerRef}
      className="py-24 md:py-36 bg-[#FFE5BF]/60 border-b border-[#171515]/10 overflow-hidden"
    >
      <div ref={contentRef} className="max-w-[960px] mx-auto px-6 md:px-10 text-center">
        
        {/* Eyebrow */}
        <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-4 block">
          UNCONDITIONAL HUMAN OVERRIDE • AAPKA FINAL CONTROL
        </span>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171515] tracking-tight mb-6">
          When you need immediate help,<br />
          <span className="text-[#F62440]">don't wait for a score.</span>
        </h2>

        <p className="font-sans text-base sm:text-lg text-[#625B55] leading-relaxed max-w-xl mx-auto mb-10 font-normal">
          Manual SOS hamesha screen par available hota hai. Iske liye kisi AI algorithm, score calculation ya internet ka wait nahi karna padta. Ek tap, aur madad shuru.
        </p>

        {/* The Signature SOS Interactive Element */}
        <div className="flex flex-col items-center justify-center mb-10">
          <button
            onClick={() => setSosActivated(!sosActivated)}
            data-cursor="safety"
            className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
            aria-label="Simulate Manual SOS Button"
          >
            {/* Outer animated halo */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#F62440]/15 animate-safety-radius absolute" />
            
            {/* Main red action button */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#F62440] hover:bg-[#D91F38] text-white flex flex-col items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-105 active:scale-95 z-10 border-4 border-[#FFFAF3]">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest">
                SOS
              </span>
              <span className="font-mono text-[9px] tracking-wider uppercase opacity-90 mt-0.5">
                TAP TO TEST
              </span>
            </div>
          </button>

          {/* Feedback banner if simulated */}
          {sosActivated && (
            <div className="mt-8 p-4 bg-[#FFFAF3] rounded-2xl border border-[#F62440] shadow-md max-w-md w-full animate-fadeIn text-left flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
              <div>
                <span className="font-sans text-xs font-bold text-[#171515] block">
                  Simulated SOS Protocol Dispatched
                </span>
                <span className="font-sans text-[11px] text-[#625B55]">
                  Instant siren option • Silent location alert sent to Trusted Circle • 112 emergency hotline primed.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Reassurance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-[#171515]/15 text-xs font-mono text-[#625B55]">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#F62440]" />
            <span>KOI AI DELAY NAHI</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#F62440]" />
            <span>OFFLINE SMS SE BHI KAAM KAREGA</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#F62440]" />
            <span>DIRECT EMERGENCY DISPATCH</span>
          </div>
        </div>

      </div>
    </section>
  );
};
