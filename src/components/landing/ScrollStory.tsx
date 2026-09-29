import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { Clock, Headphones, Smartphone, Moon, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const climaxRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Clean entrance trigger for the whole section
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 35, scale: 0.98 },
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

      // Staggered reveal for the sensory cues
      if (itemsRef.current) {
        gsap.fromTo(
          itemsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: itemsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Climax quote reveal
      if (climaxRef.current) {
        gsap.fromTo(
          climaxRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: climaxRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="problem-story"
      ref={containerRef}
      className="relative min-h-screen bg-[#FFF2DB]/60 py-20 md:py-28 flex items-center justify-center border-b border-[#171515]/10 overflow-hidden"
    >
      {/* Background subtle ambiance */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#FFE5BF] blur-3xl" />
      </div>

      <div className="w-full max-w-[920px] mx-auto px-6 md:px-10 text-center relative z-10 flex flex-col items-center justify-center">
        
        {/* Main Centered Editorial Stage */}
        <div
          ref={cardRef}
          className="w-full bg-[#FFFAF3] rounded-3xl p-8 sm:p-12 md:p-16 border border-[#171515]/10 shadow-lg text-center"
        >
          {/* Time Stamp Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE5BF] border border-[#171515]/10 mb-6 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#F62440]" />
            <span className="font-mono text-xs font-bold tracking-[0.18em] text-[#171515] uppercase">
              9:40 PM • LATE TRANSIT
            </span>
          </div>

          {/* Centered Main Headline */}
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171515] tracking-tight mb-4">
            You're on your way home.
          </h2>

          <p className="font-serif text-lg sm:text-xl text-[#625B55] italic mb-10">
            During late-night commutes, vigilance is quiet and instinctive.
          </p>

          {/* 3 Relatable Sensory Cards in a Centered Grid */}
          <div
            ref={itemsRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left"
          >
            <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10">
              <Headphones className="w-5 h-5 text-[#171515] mb-2" />
              <div className="font-sans text-sm font-bold text-[#171515]">Headphones on</div>
              <div className="font-sans text-xs text-[#625B55] mt-1">Audio low, senses sharp on surroundings.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10">
              <Smartphone className="w-5 h-5 text-[#171515] mb-2" />
              <div className="font-sans text-sm font-bold text-[#171515]">Phone in hand</div>
              <div className="font-sans text-xs text-[#625B55] mt-1">Screen active, ready for instant check-in.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10">
              <Moon className="w-5 h-5 text-[#F62440] mb-2" />
              <div className="font-sans text-sm font-bold text-[#171515]">Quiet corridor</div>
              <div className="font-sans text-xs text-[#625B55] mt-1">Secondary streets with dimmer lighting.</div>
            </div>
          </div>

          {/* The Core Truth — Crisp, High Contrast & Centered */}
          <div className="space-y-2 mb-10 max-w-lg mx-auto font-sans text-base sm:text-lg text-[#625B55]">
            <p>You don't want to panic.</p>
            <p>You don't want to cause unwarranted alarm for your family.</p>
            <p className="text-[#171515] font-semibold text-lg sm:text-xl pt-1">
              You just want reliable, quiet protection.
            </p>
          </div>

          {/* Centered Delicate Divider */}
          <div className="flex items-center justify-center gap-3 my-8 opacity-40">
            <div className="w-16 h-px bg-[#171515]" />
            <div className="w-2 h-2 rounded-full bg-[#F62440]" />
            <div className="w-16 h-px bg-[#171515]" />
          </div>

          {/* The Landing Climax in DM Serif Display */}
          <div
            ref={climaxRef}
            className="p-6 sm:p-8 rounded-2xl bg-[#FFE5BF] border border-[#171515]/15 max-w-xl mx-auto shadow-xs"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#F62440]" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-[#171515]">
                THE SAKHISHIELD COMMITMENT
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-4xl text-[#171515] italic leading-tight">
              “Peace of mind before anything goes wrong.”
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#625B55] mt-3 font-normal">
              A silent, reliable companion that ensures you reach your doorstep safely — without noise, without panic.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
