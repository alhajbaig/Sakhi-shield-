import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const FinalCTA: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
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
      className="py-28 md:py-40 bg-[#FFE5BF]/60 border-b border-[#171515]/10 overflow-hidden relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFF2DB]/60 blur-3xl pointer-events-none" />

      <div ref={cardRef} className="max-w-[880px] mx-auto px-6 md:px-10 text-center relative z-10">
        
        {/* Headline */}
        <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#171515] tracking-tight mb-8">
          Go where you need to go.
        </h2>

        {/* Affirmations */}
        <div className="space-y-1 mb-10 text-lg sm:text-2xl font-serif text-[#625B55] italic">
          <p>Padhai karo.</p>
          <p>Work par jao.</p>
          <p>Doston se milo.</p>
          <p>Late aao ya naye raaste chuno.</p>
        </div>

        {/* Core Truth */}
        <p className="font-serif text-2xl sm:text-3xl text-[#171515] mb-8 max-w-xl mx-auto leading-snug">
          Darr ki wajah se aapki zindagi choti nahi honi chahiye.
        </p>

        {/* Hinglish Closing Climax */}
        <div className="my-12 p-8 sm:p-10 rounded-3xl bg-[#FFFAF3] border border-[#171515]/10 shadow-sm max-w-2xl mx-auto">
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171515] italic leading-relaxed">
            “Tum bas apna safar karo.<br className="hidden sm:inline" />
            Baaki, SakhiShield saath hai.”
          </p>
          <p className="font-sans text-xs text-[#625B55] mt-3">
            Har safar mein ek shant aur sachcha hamsafar.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Link
            to="/signup"
            data-cursor="pointer"
            className="inline-flex items-center gap-2 px-9 py-4 bg-[#F62440] hover:bg-[#D91F38] text-[#FFFAF3] text-sm font-sans font-semibold rounded-full transition-colors shadow-md"
          >
            <span>Get started</span>
            <span className="text-base leading-none">→</span>
          </Link>
          <a
            href="#hero-journey"
            data-cursor="pointer"
            className="inline-flex items-center px-7 py-4 text-sm font-sans font-medium text-[#171515] border border-[#171515]/20 rounded-full hover:bg-[#FFFAF3] transition-colors"
          >
            Upar jayein ↑
          </a>
        </div>

        {/* Reassurance */}
        <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#625B55]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#171515]/40" />
          <span>Private by design</span>
          <span className="text-[#171515]/25">•</span>
          <span>Aapka poora control</span>
        </div>

      </div>
    </section>
  );
};
