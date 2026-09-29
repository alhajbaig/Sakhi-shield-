import React from 'react';

interface SafetyPulseProps {
  label?: string;
  sublabel?: string;
  className?: string;
}

export const SafetyPulse: React.FC<SafetyPulseProps> = ({
  label = 'SAKHI IS WITH YOU',
  sublabel,
  className = '',
}) => {
  return (
    <div
      data-cursor="safety"
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FFFAF3] border border-[#171515]/10 shadow-xs select-none ${className}`}
    >
      {/* Subtle heartbeat pulse indicator */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F62440] opacity-50" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F62440]" />
      </span>

      <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-[#171515]">
        {label}
      </span>

      {sublabel && (
        <span className="font-sans text-[11px] text-[#625B55] pl-1.5 border-l border-[#171515]/15">
          {sublabel}
        </span>
      )}
    </div>
  );
};
