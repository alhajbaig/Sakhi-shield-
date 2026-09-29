import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../animation/useReducedMotion';
import { Search, HelpCircle, Compass, Users, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StepData {
  id: string;
  num: string;
  name: string;
  hinglishName: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: StepData[] = [
  {
    id: 'detect',
    num: '01',
    name: 'DETECT',
    hinglishName: 'KUCH AALAG LAGNA',
    title: 'Quietly notices unusual signals',
    description: 'Rasta badla ho ya gaadi ajeeb jagah ruk gayi ho — SakhiShield bina shor machaye unusual movement ko notice karta hai.',
    icon: Search,
  },
  {
    id: 'verify',
    num: '02',
    name: 'VERIFY',
    hinglishName: 'AAPSE POOCHHNA',
    title: 'Gently checks in with you',
    description: 'Bina kisi panic ke, aapse aaram se poochhta hai: "Sab theek hai na?" Bas ek tap me confirm karein.',
    icon: HelpCircle,
  },
  {
    id: 'guide',
    num: '03',
    name: 'GUIDE',
    hinglishName: 'SAHI RASTA CHUNNA',
    title: 'Offers calm next steps',
    description: 'Jab ghabrahat ho, tab lambi advice nahi chahiye hoti. SakhiShield turant clear options deta hai: Safe Haven, lit route, ya guardian alert.',
    icon: Compass,
  },
  {
    id: 'protect',
    num: '04',
    name: 'PROTECT',
    hinglishName: 'APNO KO ALERT KARNA',
    title: 'Alerts your trusted circle',
    description: 'Agar aap uncomfortable hain ya response nahi diya, toh aapke chune hue log (Papa, dost) ko discreetly live coordinates chale jaate hain.',
    icon: Users,
  },
  {
    id: 'document',
    num: '05',
    name: 'DOCUMENT',
    hinglishName: 'SAFE RECORD RAKHNA',
    title: 'Keeps evidence private & ready',
    description: 'Har timestamp, location note aur screenshot aapke private vault me safely archive ho jata hai — sirf aapke access ke liye.',
    icon: FileText,
  },
];

export const SafetyLoop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance animation
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

      // Smooth scroll step progression without pinning
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 65%',
        end: 'bottom 25%',
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.min(
            STEPS.length - 1,
            Math.floor(self.progress * STEPS.length)
          );
          setActiveStepIndex(index);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const current = STEPS[activeStepIndex];

  return (
    <section
      id="safety-loop"
      ref={containerRef}
      className="relative min-h-screen bg-[#FFE5BF]/60 py-20 md:py-28 border-b border-[#171515]/10 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-[1280px] w-full mx-auto px-6 md:px-10 lg:px-12">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-[760px] mx-auto mb-10">
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#625B55] uppercase mb-3 block">
            HAR KADAM PAR SAATH • THE CORE SAFETY LOOP
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#171515] tracking-tight">
            How it works when you need it.
          </h2>
          <p className="font-serif text-lg text-[#625B55] italic mt-2">
            Har baar emergency nahi hoti — par tayyari har pal hoti hai.
          </p>
        </div>

        {/* Step Navigation Bar / Progress Rail */}
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-10 overflow-x-auto pb-2 scrollbar-none">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                data-cursor="pointer"
                className="group flex flex-col items-center gap-2 px-3 py-1 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-[#F62440] text-[#FFFAF3] scale-110 shadow-xs'
                        : 'bg-[#FFFAF3] text-[#625B55] group-hover:bg-[#171515] group-hover:text-white'
                    }`}
                  >
                    {step.num}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold tracking-wider transition-colors duration-200 hidden sm:inline ${
                      isActive ? 'text-[#F62440]' : 'text-[#625B55] group-hover:text-[#171515]'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                <div
                  className={`h-0.5 w-12 transition-all duration-300 ${
                    isActive ? 'bg-[#F62440]' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Center Stage: Interactive System Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          
          {/* Left: Step Explanatory Content */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-[#FFFAF3] rounded-3xl p-8 border border-[#171515]/10 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[#F62440] tracking-widest">
                  STEP {current.num} / 05
                </span>
                <span className="font-mono text-[10px] uppercase text-[#625B55] bg-[#FFE5BF] px-2 py-0.5 rounded">
                  {current.hinglishName}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#171515] mb-3">
                {current.title}
              </h3>
              <p className="font-sans text-base text-[#625B55] leading-relaxed mb-6 font-normal">
                {current.description}
              </p>

              <div className="pt-4 border-t border-[#171515]/10 flex items-center justify-between text-xs font-mono text-[#625B55]">
                <span>STATE: {current.name}</span>
                <span className="text-[#F62440] font-semibold">SAKHI ENGINE ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Interactive Simulation UI */}
          <div ref={cardRef} className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-[#FFFAF3] rounded-3xl p-6 sm:p-8 border border-[#171515]/10 shadow-md min-h-[340px] flex flex-col justify-between">
              
              {/* Header inside simulation */}
              <div className="flex items-center justify-between pb-4 border-b border-[#171515]/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F62440] animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[#171515] uppercase tracking-wider">
                    INTELLIGENT RESPONSE • {current.name}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#625B55]">
                  21:44 PM IST
                </span>
              </div>

              {/* Dynamic Center Visualization based on Active Step */}
              <div className="py-6 flex flex-col justify-center items-center">
                
                {/* STEP 1: DETECT */}
                {activeStepIndex === 0 && (
                  <div className="w-full max-w-md bg-[#FFF2DB] rounded-2xl p-6 border border-[#171515]/10 text-center animate-fadeIn">
                    <span className="inline-block px-3 py-1 bg-[#F62440]/10 text-[#F62440] rounded-full text-xs font-mono font-semibold tracking-wide mb-3">
                      UNUSUAL SHIFT DETECTED
                    </span>
                    <h4 className="font-serif text-xl text-[#171515] mb-2">
                      Rasta thoda diverge hua hai
                    </h4>
                    <p className="font-sans text-xs text-[#625B55]">
                      Expected route se 140m alag direction mein movement observe hui hai.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-mono text-[#171515]">
                      <span>STATUS: WALKING</span>
                      <span>•</span>
                      <span>DEVIATION: +3 MIN</span>
                    </div>
                  </div>
                )}

                {/* STEP 2: VERIFY */}
                {activeStepIndex === 1 && (
                  <div className="w-full max-w-md bg-[#FFF2DB] rounded-2xl p-6 border border-[#171515]/10 text-center animate-fadeIn">
                    <span className="inline-block px-3 py-1 bg-[#171515] text-[#FFFAF3] rounded-full text-xs font-mono font-semibold tracking-wide mb-3">
                      GENTLE CHECK-IN
                    </span>
                    <h4 className="font-serif text-xl text-[#171515] mb-2">
                      “Sab theek hai na?”
                    </h4>
                    <p className="font-sans text-xs text-[#625B55] mb-5">
                      Rasta thoda alag hai. Kisi bhi emergency ke bina, bas ek tap mein status confirm karein.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button className="px-5 py-2 bg-[#FFFAF3] rounded-full border border-[#171515]/20 font-sans text-xs font-medium text-[#171515]">
                        Haan, sab theek hai
                      </button>
                      <button className="px-5 py-2 bg-[#F62440] rounded-full text-white font-sans text-xs font-medium">
                        Saath bane raho
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: GUIDE */}
                {activeStepIndex === 2 && (
                  <div className="w-full max-w-md space-y-2.5 animate-fadeIn">
                    <div className="p-3.5 bg-[#FFF2DB] rounded-xl border border-[#171515]/10 flex items-center justify-between">
                      <span className="font-sans text-sm font-medium text-[#171515]">“Kuch theek nahi lag raha”</span>
                      <span className="font-mono text-xs text-[#F62440]">Well-lit route →</span>
                    </div>
                    <div className="p-3.5 bg-[#FFFAF3] rounded-xl border border-[#171515]/10 flex items-center justify-between">
                      <span className="font-sans text-sm font-medium text-[#171515]">“Aas-paas safe jagah batao”</span>
                      <span className="font-mono text-xs text-[#625B55]">Open Café 350m →</span>
                    </div>
                    <div className="p-3.5 bg-[#FFE5BF] rounded-xl border border-[#171515]/10 flex items-center justify-between">
                      <span className="font-sans text-sm font-bold text-[#F62440]">“Mujhe help chahiye”</span>
                      <span className="font-mono text-xs font-bold text-[#F62440]">Instant Alert →</span>
                    </div>
                  </div>
                )}

                {/* STEP 4: PROTECT */}
                {activeStepIndex === 3 && (
                  <div className="w-full max-w-md bg-[#FFF2DB] rounded-2xl p-6 border border-[#171515]/10 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#171515] text-[#FFFAF3] flex items-center justify-center font-mono text-xs font-bold">
                        TC
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-[#171515]">
                          Discreet Guardian Notification
                        </h4>
                        <p className="font-sans text-xs text-[#625B55]">
                          Papa aur Aanya ko live coordinates chale gaye
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#FFFAF3] p-3 rounded-xl border border-[#171515]/10 flex items-center justify-between text-xs font-mono text-[#171515]">
                      <span>BATTERY: 68%</span>
                      <span>ACCURACY: ±4m</span>
                      <span className="text-[#F62440] font-bold">LIVE SYNC</span>
                    </div>
                  </div>
                )}

                {/* STEP 5: DOCUMENT */}
                {activeStepIndex === 4 && (
                  <div className="w-full max-w-md bg-[#FFF2DB] rounded-2xl p-6 border border-[#171515]/10 animate-fadeIn">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#625B55] block mb-2">
                      PRIVATE VAULT ENTRY SAVED
                    </span>
                    <h4 className="font-serif text-lg text-[#171515] mb-3">
                      Safar Record #SK-944
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs text-[#625B55] bg-[#FFFAF3] p-3 rounded-xl border border-[#171515]/10">
                      <div>21:41 — Route deviation logged</div>
                      <div>21:42 — Discreet check-in sent</div>
                      <div className="text-[#F62440] font-semibold">21:44 — Location encrypted & stored safely</div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Microcopy */}
              <div className="pt-4 border-t border-[#171515]/10 flex items-center justify-between text-xs font-mono text-[#625B55]">
                <span>SCROLL KAREIN NEXT STEP KE LIYE</span>
                <span>STEP 0{activeStepIndex + 1} OF 05</span>
              </div>

            </div>
          </div>

        </div>

        {/* Concluding Philosophy Statement */}
        <div className="mt-12 text-center">
          <p className="font-serif text-xl sm:text-2xl text-[#171515] italic">
            “Safety koi achanak hone wali cheez nahi hai. Yeh chote-chote sahi decisions ka saath hai.”
          </p>
        </div>

      </div>
    </section>
  );
};
