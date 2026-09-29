import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RiskIndicatorProps {
  signalType?: string;
  metric?: string;
  detail?: string;
  timestamp?: string;
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  signalType = 'ROUTE DEVIATION',
  metric = '620m',
  detail = 'Path divergence exceeds expected transit corridor threshold',
  timestamp = '22:18:45',
  className = '',
}) => {
  return (
    <div className={`border border-[#F62440]/30 bg-[#FFF2DB] rounded-lg p-4 md:p-5 text-[#1C1917] ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F62440]" />
          <span className="font-mono text-xs font-bold text-[#F62440] uppercase tracking-wider">
            SIGNAL DETECTED
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#78716C]">{timestamp}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1C1917]/10 pb-3">
        <div>
          <span className="font-mono text-xs text-[#78716C] uppercase tracking-wider">Observed Anomaly</span>
          <h5 className="font-sans font-bold text-lg text-[#1C1917] tracking-tight">{signalType}</h5>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs text-[#78716C] uppercase tracking-wider">Magnitude</span>
          <div className="font-mono text-xl font-bold text-[#F62440]">{metric}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#44403C]">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#F62440] shrink-0" />
          <span>{detail}</span>
        </div>
        <span className="font-mono text-[10px] text-[#78716C] hidden sm:inline">DELTA +14.2%</span>
      </div>
    </div>
  );
};
