import React from 'react';
import { ShieldCheck, Clock, Radio, Compass } from 'lucide-react';

interface SafetyStatusProps {
  destination?: string;
  eta?: string;
  expectedArrival?: string;
  monitoring?: string;
  status?: 'SAFE' | 'ATTENTION' | 'ALERT';
  className?: string;
}

export const SafetyStatus: React.FC<SafetyStatusProps> = ({
  destination = 'HOME',
  eta = '20 MIN',
  expectedArrival = '10:30 PM',
  monitoring = 'ACTIVE',
  status = 'SAFE',
  className = '',
}) => {
  return (
    <div className={`border border-[#1C1917]/15 bg-[#FFFAF3] rounded-lg p-5 md:p-6 text-[#1C1917] ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#1C1917]/10">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-[#78716C] uppercase">
            PRODUCT / SESSION
          </span>
          <h4 className="font-serif text-lg text-[#1C1917]">Walk With Me</h4>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#1C1917] text-[#FFFAF3] rounded text-xs font-mono">
          <Radio className="w-3 h-3 text-[#FFFAF3]" />
          <span>MONITORING {monitoring}</span>
        </div>
      </div>

      {/* Grid of Key Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">
        <div className="border border-[#1C1917]/10 bg-[#FFF2DB]/50 p-3 rounded">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider mb-1">
            Destination
          </div>
          <div className="font-sans font-bold text-base text-[#1C1917] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#1C1917]" />
            {destination}
          </div>
        </div>

        <div className="border border-[#1C1917]/10 bg-[#FFF2DB]/50 p-3 rounded">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider mb-1">
            Expected Arrival
          </div>
          <div className="font-sans font-bold text-base text-[#1C1917] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#1C1917]" />
            {expectedArrival}
          </div>
          <div className="font-mono text-[10px] text-[#78716C] mt-0.5">ETA: {eta}</div>
        </div>

        <div className="col-span-2 md:col-span-1 border border-[#1C1917]/10 bg-[#FFF2DB]/50 p-3 rounded flex flex-col justify-between">
          <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider mb-1">
            Safety Status
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1C1917]" />
            <span className="font-mono text-sm font-bold tracking-wider text-[#1C1917]">
              {status}
            </span>
          </div>
          <div className="font-mono text-[10px] text-[#78716C] mt-0.5">Zero anomalies verified</div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] pt-2 border-t border-[#1C1917]/10">
        <span>SESSION ENCRYPTED END-TO-END</span>
        <span>GPS SAMPLING: CONSERVATIVE (50M)</span>
      </div>
    </div>
  );
};
