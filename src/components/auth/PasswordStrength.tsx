import React from 'react';
import { evaluatePasswordStrength } from '../../lib/auth';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) {
    return (
      <p className="font-sans text-[11px] text-[#625B55] mt-1.5">
        Use 8+ characters with a mix of letters and numbers.
      </p>
    );
  }

  const { score, label, color, hint } = evaluatePasswordStrength(password);

  return (
    <div className="mt-2 space-y-1.5 animate-fadeIn">
      {/* 4 Subtle Bar Segments */}
      <div className="flex gap-1.5 h-1 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className="flex-1 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: step <= score ? color : 'rgba(23, 21, 21, 0.1)',
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#625B55]">
          STRENGTH:{' '}
          <strong style={{ color }} className="font-bold uppercase tracking-wider">
            {label}
          </strong>
        </span>
        <span className="font-sans text-[#625B55]">{hint}</span>
      </div>
    </div>
  );
};
