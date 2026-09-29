import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { ArrowRight, ShieldAlert, Lock, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const DigitalSafetyStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState<number>(2);
  const [savedToVault, setSavedToVault] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
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

  return (
    <section
      id="digital-safety"
      ref={containerRef}
      className="py-24 md:py-36 bg-transparent border-b border-[#171515]/10 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12">
        
        {/* Section Header */}
        <div ref={headerRef} className="max-w-[840px] mb-12">
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-3 block">
            ROAD SE SCREEN TAK • DIGITAL SAFETY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171515] tracking-tight mb-4">
            Safety isn't only about the road.<br />
            <span className="italic text-[#625B55]">Kabhi-kabhi phone ke andar hoti hai.</span>
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#625B55] leading-relaxed max-w-xl">
            Harassment aksar digital messages se shuru hota hai — baar-baar aane wale unwanted calls, creepy DMs ya location dhamki. SakhiShield on-device OCR se text patterns analyze karke aapka private legal record ready rakhta hai.
          </p>
        </div>

        {/* Step Scrubber */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { num: 1, label: '1. MESSAGE SCREENSHOT' },
            { num: 2, label: '2. OCR EXTRACTION' },
            { num: 3, label: '3. SIGNAL ANALYSIS' },
            { num: 4, label: '4. PRIVATE VAULT' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              data-cursor="pointer"
              className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeStep === st.num
                  ? 'bg-[#171515] text-[#FFFAF3] font-bold shadow-xs'
                  : 'bg-[#FFF2DB] text-[#625B55] hover:bg-[#FFE5BF]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Transformation Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Simulated Message Card with OCR highlights */}
          <div ref={leftColRef} className="lg:col-span-6">
            <div className="bg-[#FFF2DB] rounded-3xl p-6 sm:p-8 border border-[#171515]/10 shadow-md relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#171515]/10 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-mono text-xs font-bold text-[#171515] uppercase tracking-wider">
                    INCOMING MESSAGE • ANONYMOUS SENDER
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#625B55]">
                  21:42 PM
                </span>
              </div>

              {/* Message Bubble */}
              <div className="bg-[#FFFAF3] rounded-2xl p-6 border border-[#171515]/10 shadow-sm relative">
                <span className="font-mono text-[10px] text-[#625B55] uppercase block mb-3">
                  RECEIVED VIA INSTANT MESSENGER
                </span>
                
                <p className="font-serif text-xl sm:text-2xl text-[#171515] leading-snug">
                  “
                  {activeStep >= 2 ? (
                    <mark className="bg-[#FFE5BF] text-[#171515] px-1 rounded">
                      You'll regret ignoring me
                    </mark>
                  ) : (
                    "You'll regret ignoring me"
                  )}
                  . I know{' '}
                  {activeStep >= 2 ? (
                    <mark className="bg-[#F62440]/15 text-[#F62440] font-semibold px-1 rounded">
                      where you live
                    </mark>
                  ) : (
                    'where you live'
                  )}
                  .”
                </p>

                {activeStep >= 2 && (
                  <div className="mt-4 pt-4 border-t border-[#171515]/10 flex items-center justify-between font-mono text-[11px] text-[#625B55]">
                    <span>ON-DEVICE OCR: 100% MATCH</span>
                    <span className="text-[#F62440] font-semibold">2 THREAT SIGNALS DETECTED</span>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <p className="font-sans text-xs text-[#625B55] mt-4 italic text-center">
                Data aapke phone par hi rehta hai. Kisi server ya third-party ko nahi bheja jaata.
              </p>
            </div>
          </div>

          {/* Right Column: Signal Analysis & Evidence Preservation Action */}
          <div ref={rightColRef} className="lg:col-span-6">
            <div className="bg-[#FFFAF3] rounded-3xl p-6 sm:p-8 border border-[#171515]/10 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#171515]/10 mb-6">
                <ShieldAlert className="w-5 h-5 text-[#F62440]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#171515]">
                  POTENTIAL THREATENING COMMUNICATION
                </h3>
              </div>

              <div className="space-y-3.5 mb-8">
                <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-start justify-between">
                  <div>
                    <span className="font-sans text-sm font-bold text-[#171515] block">
                      Intimidation & Coercion Signal
                    </span>
                    <span className="font-sans text-xs text-[#625B55]">
                      “You'll regret ignoring me” conditional intimidation pattern
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FFFAF3] text-[#F62440] font-bold">
                    HIGH
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-start justify-between">
                  <div>
                    <span className="font-sans text-sm font-bold text-[#171515] block">
                      Physical Location Reference
                    </span>
                    <span className="font-sans text-xs text-[#625B55]">
                      “where you live” indicates targeted residence monitoring
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FFFAF3] text-[#F62440] font-bold">
                    SIGNIFICANT
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF2DB] border border-[#171515]/10 flex items-start justify-between">
                  <div>
                    <span className="font-sans text-sm font-bold text-[#171515] block">
                      Repeated Contact Frequency
                    </span>
                    <span className="font-sans text-xs text-[#625B55]">
                      3 messages within 2 hours across unlisted channels
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FFFAF3] text-[#625B55] font-semibold">
                    RECORDED
                  </span>
                </div>
              </div>

              {/* Action: Review Before Saving */}
              <div className="p-5 rounded-2xl bg-[#FFE5BF] border border-[#171515]/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#171515]" />
                    <span className="font-sans text-xs font-bold text-[#171515]">
                      Aap review karke khud save karein
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#625B55]">
                    AAPKA CONTROL
                  </span>
                </div>

                <button
                  onClick={() => setSavedToVault(true)}
                  data-cursor="pointer"
                  className={`w-full py-3.5 px-6 rounded-full font-sans text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    savedToVault
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#171515] text-[#FFFAF3] hover:bg-[#F62440]'
                  }`}
                >
                  {savedToVault ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Private Incident Vault Mein Save Ho Gaya</span>
                    </>
                  ) : (
                    <>
                      <span>Save to Private Incident Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
