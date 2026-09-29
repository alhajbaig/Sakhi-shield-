import React from 'react';
import { evaluatePasswordStrength } from '../../lib/auth';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) {
    return (
      <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-[#625B55]/70 tracking-wider">
        <span>PRIVATE SPACE</span>
        <span className="text-[10px]">8+ characters with mixed keys</span>
      </div>
    );
  }

  const { score } = evaluatePasswordStrength(password);

  // Label reflecting privacy & system integrity rather than gamification
  const statusLabels: Record<number, string> = {
    1: 'INITIALIZING PROTECTION',
    2: 'ACTIVE PROTOCOL',
    3: 'SECURED SPACE',
    4: 'PROTECTED BY ARCHITECTURE',
  };

  const percentage = Math.max(15, (score / 4) * 100);

  return (
    <div className="mt-2 space-y-1.5 animate-fadeIn">
      {/* Editorial System Metric Line */}
      <div className="relative w-full h-[2px] bg-[#171515]/10 rounded-full overflow-visible">
        <div
          className="h-full bg-[#171515] transition-all duration-300 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Active Red Point on the line */}
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F62440] shadow-[0_0_8px_rgba(246,36,64,0.4)] transition-transform duration-300 scale-100"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono tracking-wider">
        <span className="text-[#171515] font-semibold flex items-center gap-1.5">
          <span>PRIVATE SPACE</span>
          <span className="text-[#625B55]/50">/</span>
          <span className="text-[#625B55] uppercase">{statusLabels[score] || 'SECURE'}</span>
        </span>
        <span className="text-[#625B55]">
          {score >= 3 ? 'CALM & STRONG' : 'NEEDS DEPTH'}
        </span>
      </div>
    </div>
  );
};
