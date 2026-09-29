import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Lock, Navigation, CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '../animation/useReducedMotion';

export const HeroJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      );

      if (badgesRef.current) {
        gsap.fromTo(
          badgesRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.25 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero-journey"
      ref={containerRef}
      className="relative min-h-[90vh] bg-transparent flex items-center justify-center pt-28 pb-20 overflow-hidden"
    >
      {/* Background Subtle Geometric Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#171515" strokeWidth="0.5" strokeOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative max-w-[1040px] w-full mx-auto px-6 md:px-10 text-center z-10 flex flex-col items-center">
        <div ref={contentRef} className="space-y-6 sm:space-y-8 flex flex-col items-center w-full">
          
          {/* Live presence indicator */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFE5BF]/70 border border-[#171515]/12 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#F62440] animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-[#171515]">
              ACTIVE SENTINEL PROTOCOL
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#171515] leading-[1.05] tracking-tight max-w-4xl mx-auto">
            Because safety shouldn’t wait <br />
            for an <span className="text-[#F62440] italic font-normal">emergency</span> to happen.
          </h1>

          {/* Supporting Copy */}
          <p className="font-sans text-base sm:text-xl text-[#57534E] leading-relaxed max-w-2xl mx-auto font-normal">
            A proactive safety companion that silently monitors your transit corridors, coordinates trusted circles, and verifies safe arrival — without false alarms or noise.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#171515] text-[#FFFAF3] text-sm font-sans font-bold rounded-full hover:bg-[#F62440] transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <span>Launch Safety Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#sentinel-showcase"
              className="inline-flex items-center px-7 py-4 text-sm font-sans font-semibold text-[#171515] border border-[#171515]/20 rounded-full hover:bg-[#FFF2DB] transition-colors"
            >
              Explore Sentinel HUD
            </a>
          </div>

          {/* Trust Guarantees Strip */}
          <div
            ref={badgesRef}
            className="pt-8 sm:pt-12 border-t border-[#171515]/10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-left w-full max-w-3xl"
          >
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF2DB]/50 border border-[#171515]/8">
              <div className="w-8 h-8 rounded-xl bg-[#FFE5BF] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-[#171515]" />
              </div>
              <div>
                <div className="font-sans font-bold text-xs text-[#171515]">Zero-Knowledge</div>
                <div className="font-sans text-[11px] text-[#78716C]">Client-side encrypted</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF2DB]/50 border border-[#171515]/8">
              <div className="w-8 h-8 rounded-xl bg-[#FFE5BF] flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4 text-[#171515]" />
              </div>
              <div>
                <div className="font-sans font-bold text-xs text-[#171515]">Safe Corridors</div>
                <div className="font-sans text-[11px] text-[#78716C]">Illumination & haven routing</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF2DB]/50 border border-[#171515]/8">
              <div className="w-8 h-8 rounded-xl bg-[#FFE5BF] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="font-sans font-bold text-xs text-[#171515]">Verified Arrival</div>
                <div className="font-sans text-[11px] text-[#78716C]">Zero false alarm panic</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroJourney;
