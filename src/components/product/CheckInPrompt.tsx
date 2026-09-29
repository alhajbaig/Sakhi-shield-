import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface CheckInPromptProps {
  className?: string;
  onSelect?: (state: string) => void;
}

export const CheckInPrompt: React.FC<CheckInPromptProps> = ({ className = '', onSelect }) => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

  const handleChoice = (choice: string) => {
    setSelectedResponse(choice);
    if (onSelect) onSelect(choice);
  };

  return (
    <div className={`border border-[#1C1917]/20 bg-[#FFFAF3] rounded-lg p-5 md:p-6 text-[#1C1917] ${className}`}>
      {/* Header with Countdown/Timer */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1C1917]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#1C1917] uppercase">
            SAFETY CHECK-IN
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#78716C]">AUTO-VERIFY IN 45s</span>
      </div>

      {/* Main Prompt */}
      <div className="py-4 text-center">
        <h3 className="font-serif text-2xl md:text-3xl text-[#1C1917] mb-1">
          “Are you safe?”
        </h3>
        <p className="font-sans text-xs md:text-sm text-[#44403C] max-w-sm mx-auto">
          An anomaly was observed along your planned route. Verify your status to guide our copilot response.
        </p>
      </div>

      {/* 3 Action Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3">
        <button
          type="button"
          onClick={() => handleChoice('SAFE')}
          className={`flex flex-col items-center justify-center p-3.5 rounded border transition-colors cursor-pointer text-center ${
            selectedResponse === 'SAFE'
              ? 'border-[#1C1917] bg-[#1C1917] text-[#FFFAF3]'
              : 'border-[#1C1917]/20 bg-[#FFF2DB]/60 hover:bg-[#FFF2DB] text-[#1C1917]'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-1.5 opacity-90" />
          <span className="font-mono text-xs font-bold tracking-wider">I'M SAFE</span>
          <span className="text-[10px] opacity-75 mt-0.5">Resume baseline</span>
        </button>

        <button
          type="button"
          onClick={() => handleChoice('UNCOMFORTABLE')}
          className={`flex flex-col items-center justify-center p-3.5 rounded border transition-colors cursor-pointer text-center ${
            selectedResponse === 'UNCOMFORTABLE'
              ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-semibold'
              : 'border-[#1C1917]/20 bg-[#FFE5BF]/40 hover:bg-[#FFE5BF]/80 text-[#1C1917]'
          }`}
        >
          <HelpCircle className="w-5 h-5 mb-1.5 text-[#1C1917]" />
          <span className="font-mono text-xs font-bold tracking-wider">I'M UNCOMFORTABLE</span>
          <span className="text-[10px] text-[#44403C] mt-0.5">Prepare safe guidance</span>
        </button>

        <button
          type="button"
          onClick={() => handleChoice('HELP')}
          className={`flex flex-col items-center justify-center p-3.5 rounded border transition-colors cursor-pointer text-center ${
            selectedResponse === 'HELP'
              ? 'border-[#F62440] bg-[#F62440] text-[#FFFAF3]'
              : 'border-[#F62440]/40 bg-[#FFF2DB] hover:bg-[#FFE5BF] text-[#1C1917]'
          }`}
        >
          <AlertOctagon className="w-5 h-5 mb-1.5 text-[#F62440]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#F62440]">I NEED HELP</span>
          <span className="text-[10px] text-[#78716C] mt-0.5">Escalate to circle</span>
        </button>
      </div>

      {/* Confirmation indicator if clicked */}
      {selectedResponse && (
        <div className="mt-2 p-2 bg-[#FFF2DB] border border-[#1C1917]/10 rounded flex items-center justify-center gap-2 text-xs font-mono text-[#1C1917]">
          <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
          <span>STATUS UPDATED: {selectedResponse} RECORDED</span>
        </div>
      )}

      {/* Mandatory Manual SOS rule footer */}
      <div className="mt-4 pt-3 border-t border-[#1C1917]/10 flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#F62440] font-semibold tracking-wider">
          MANUAL SOS ALWAYS AVAILABLE
        </span>
        <span className="text-[#78716C]">TAP 3X POWER OR HOLD VOLUME</span>
      </div>
    </div>
  );
};
