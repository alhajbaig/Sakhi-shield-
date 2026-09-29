import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const WhatItIsNot: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.96, y: 25 },
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
      className="py-24 md:py-36 bg-transparent border-b border-[#171515]/10 overflow-hidden"
    >
      <div ref={cardRef} className="max-w-[800px] mx-auto px-6 md:px-10 text-center">
        
        {/* Eyebrow */}
        <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-4 block">
          HONEST BOUNDARIES • SACHCHA BHAROSA
        </span>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171515] tracking-tight mb-8">
          SakhiShield doesn't try to control your life.
        </h2>

        {/* Three Short Lines */}
        <div className="space-y-3 mb-10 text-xl sm:text-2xl font-serif text-[#625B55] italic">
          <p>“Yeh crime predict nahi karta.”</p>
          <p>“Yeh aapke badle faisle nahi leta.”</p>
          <p>“Yeh aapke judgment ko replace nahi karta.”</p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-[#171515]/20 mx-auto mb-10" />

        {/* True Purpose */}
        <p className="font-sans text-base sm:text-lg text-[#171515] leading-relaxed max-w-lg mx-auto font-normal">
          Yeh bas mushkil waqt mein clear options, sahi information aur thoda sa sahara deta hai — taaki aap aage badh sakein.
        </p>

      </div>
    </section>
  );
};
