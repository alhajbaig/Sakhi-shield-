import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  num: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'hero-journey', num: '01', label: 'JOURNEY' },
  { id: 'problem-story', num: '02', label: 'AWARENESS' },
  { id: 'safety-loop', num: '03', label: 'CORE LOOP' },
  { id: 'walk-with-me', num: '04', label: 'WALK WITH ME' },
  { id: 'safety-copilot', num: '05', label: 'GUIDANCE' },
  { id: 'digital-safety', num: '06', label: 'DIGITAL' },
  { id: 'incident-vault', num: '07', label: 'YOUR STORY' },
  { id: 'privacy-story', num: '08', label: 'PRIVACY' },
];

export const ScrollProgress: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero-journey');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);

      // Detect active section
      for (const section of [...SECTIONS].reverse()) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Top Progress Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-0.5 bg-[#171515]/10 pointer-events-none">
        <div
          className="h-full bg-[#F62440] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Desktop Right Floating Section Indicator */}
      <nav
        aria-label="Story progress"
        className="hidden lg:flex fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3.5 pointer-events-auto select-none"
      >
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="group flex items-center gap-2.5 py-1 text-right focus:outline-none cursor-pointer"
              aria-current={isActive ? 'true' : undefined}
              aria-label={`Scroll to ${sec.label}`}
            >
              {/* Section label (reveals on hover or when active) */}
              <span
                className={`font-mono text-[10px] tracking-[0.16em] uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-[#F62440] font-bold opacity-100 translate-x-0'
                    : 'text-[#625B55] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {sec.num} / {sec.label}
              </span>

              {/* Indicator bar/dot */}
              <div
                className={`transition-all duration-200 rounded-full ${
                  isActive
                    ? 'w-6 h-1 bg-[#F62440]'
                    : 'w-1.5 h-1.5 bg-[#171515]/20 group-hover:bg-[#171515]/60'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
};
