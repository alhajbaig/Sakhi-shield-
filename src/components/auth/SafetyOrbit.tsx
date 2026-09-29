import React from 'react';

interface SafetyOrbitProps {
  activeField?: 'name' | 'email' | 'password' | 'phone' | null;
}

export const SafetyOrbit: React.FC<SafetyOrbitProps> = ({ activeField }) => {
  return (
    <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center select-none">
      {/* Subtle outer geometric ring */}
      <div className="absolute inset-4 rounded-full border border-[#171515]/10 pointer-events-none" />
      <div className="absolute inset-16 rounded-full border border-dashed border-[#171515]/15 pointer-events-none" />

      {/* SVG Connecting Curved Threads */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400" fill="none">
        {/* Line to Trusted Circle (Top Left) */}
        <path
          d="M 200 200 Q 150 140, 100 100"
          stroke={activeField === 'phone' ? '#F62440' : '#171515'}
          strokeWidth={activeField === 'phone' ? 2 : 1}
          strokeOpacity={activeField === 'phone' ? 0.8 : 0.25}
          strokeDasharray={activeField === 'phone' ? 'none' : '3 3'}
          className="transition-all duration-300"
        />

        {/* Line to Walk With Me (Top Right) */}
        <path
          d="M 200 200 Q 260 130, 310 90"
          stroke={activeField === 'name' ? '#F62440' : '#171515'}
          strokeWidth={activeField === 'name' ? 2 : 1}
          strokeOpacity={activeField === 'name' ? 0.8 : 0.25}
          strokeDasharray={activeField === 'name' ? 'none' : '3 3'}
          className="transition-all duration-300"
        />

        {/* Line to Safety Copilot (Bottom Left) */}
        <path
          d="M 200 200 Q 130 270, 80 300"
          stroke={activeField === 'email' ? '#F62440' : '#171515'}
          strokeWidth={activeField === 'email' ? 2 : 1}
          strokeOpacity={activeField === 'email' ? 0.8 : 0.25}
          strokeDasharray={activeField === 'email' ? 'none' : '3 3'}
          className="transition-all duration-300"
        />

        {/* Line to Incident Vault (Bottom Right) */}
        <path
          d="M 200 200 Q 280 270, 320 310"
          stroke={activeField === 'password' ? '#F62440' : '#171515'}
          strokeWidth={activeField === 'password' ? 2 : 1}
          strokeOpacity={activeField === 'password' ? 0.8 : 0.25}
          strokeDasharray={activeField === 'password' ? 'none' : '3 3'}
          className="transition-all duration-300"
        />
      </svg>

      {/* CENTER: YOU */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Safety Radius Halo */}
        <div className="absolute w-24 h-24 rounded-full bg-[#F62440]/15 animate-safety-radius pointer-events-none" />
        
        <div className="w-12 h-12 rounded-full bg-[#171515] text-[#FFFAF3] flex items-center justify-center shadow-md border-2 border-[#FFFAF3] transition-transform duration-300">
          <div className="w-4 h-4 rounded-full bg-[#F62440]" />
        </div>
        <span className="font-mono text-xs font-bold tracking-widest text-[#171515] mt-2 uppercase">
          YOU
        </span>
      </div>

      {/* SATELLITE 1: TRUSTED CIRCLE (Top Left) */}
      <div
        className={`absolute top-10 left-4 p-3 rounded-2xl border transition-all duration-300 backdrop-blur-xs flex items-center gap-2 ${
          activeField === 'phone'
            ? 'bg-[#FFE5BF] border-[#F62440]/40 shadow-sm scale-105'
            : 'bg-[#FFFAF3] border-[#171515]/10 shadow-xs'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#171515]" />
        <div>
          <span className="font-mono text-[9px] text-[#625B55] uppercase block">YOUR PEOPLE</span>
          <span className="font-sans text-xs font-bold text-[#171515]">Trusted Circle</span>
        </div>
      </div>

      {/* SATELLITE 2: WALK WITH ME (Top Right) */}
      <div
        className={`absolute top-8 right-4 p-3 rounded-2xl border transition-all duration-300 backdrop-blur-xs flex items-center gap-2 ${
          activeField === 'name'
            ? 'bg-[#FFE5BF] border-[#F62440]/40 shadow-sm scale-105'
            : 'bg-[#FFFAF3] border-[#171515]/10 shadow-xs'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#F62440]" />
        <div>
          <span className="font-mono text-[9px] text-[#625B55] uppercase block">YOUR JOURNEY</span>
          <span className="font-sans text-xs font-bold text-[#171515]">Walk With Me</span>
        </div>
      </div>

      {/* SATELLITE 3: SAFETY COPILOT (Bottom Left) */}
      <div
        className={`absolute bottom-10 left-2 p-3 rounded-2xl border transition-all duration-300 backdrop-blur-xs flex items-center gap-2 ${
          activeField === 'email'
            ? 'bg-[#FFE5BF] border-[#F62440]/40 shadow-sm scale-105'
            : 'bg-[#FFFAF3] border-[#171515]/10 shadow-xs'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#171515]" />
        <div>
          <span className="font-mono text-[9px] text-[#625B55] uppercase block">YOUR DECISIONS</span>
          <span className="font-sans text-xs font-bold text-[#171515]">Safety Copilot</span>
        </div>
      </div>

      {/* SATELLITE 4: INCIDENT VAULT (Bottom Right) */}
      <div
        className={`absolute bottom-8 right-2 p-3 rounded-2xl border transition-all duration-300 backdrop-blur-xs flex items-center gap-2 ${
          activeField === 'password'
            ? 'bg-[#FFE5BF] border-[#F62440]/40 shadow-sm scale-105'
            : 'bg-[#FFFAF3] border-[#171515]/10 shadow-xs'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#171515]" />
        <div>
          <span className="font-mono text-[9px] text-[#625B55] uppercase block">YOUR STORY</span>
          <span className="font-sans text-xs font-bold text-[#171515]">Incident Vault</span>
        </div>
      </div>
    </div>
  );
};
