import React from 'react';
import { Navigation, ShieldCheck, MapPin } from 'lucide-react';

interface JourneyPreviewProps {
  className?: string;
}

export const JourneyPreview: React.FC<JourneyPreviewProps> = ({ className = '' }) => {
  return (
    <div className={`border border-[#1C1917]/15 bg-[#FFFAF3] rounded-lg p-5 md:p-6 text-[#1C1917] ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1C1917] animate-none" />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#1C1917]">
            SESSION / ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#78716C]">
          <span>REF: WWM-8942</span>
          <span className="inline-block w-1 h-1 rounded-full bg-[#78716C]" />
          <span>22:18:04 UTC</span>
        </div>
      </div>

      {/* Main Journey Visualization Graphic */}
      <div className="relative py-4 px-2">
        {/* Origin and Destination tags */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-[#1C1917]/10 bg-[#FFF2DB]/60 p-3 rounded">
            <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider mb-0.5">Origin</div>
            <div className="font-sans font-semibold text-sm text-[#1C1917] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1C1917]" />
              University North Gate
            </div>
            <div className="font-mono text-[10px] text-[#78716C] mt-1">Departed 22:10</div>
          </div>
          <div className="border border-[#1C1917]/10 bg-[#FFF2DB]/60 p-3 rounded">
            <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider mb-0.5">Destination</div>
            <div className="font-sans font-semibold text-sm text-[#1C1917] flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#1C1917]" />
              Residence (Home)
            </div>
            <div className="font-mono text-[10px] text-[#78716C] mt-1">ETA: 22:30 (20 min)</div>
          </div>
        </div>

        {/* Abstract Route Map Graphic */}
        <div className="relative border border-[#1C1917]/15 bg-[#FFF2DB]/40 rounded-md p-5 overflow-hidden">
          <div className="absolute top-2 right-3 font-mono text-[10px] text-[#78716C] tracking-widest">
            28°36'44.2"N 77°12'19.1"E
          </div>

          {/* SVG Map Path */}
          <div className="relative h-44 w-full flex items-center justify-center">
            <svg viewBox="0 0 400 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Grid Background Pattern */}
              <defs>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(28,25,23,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Safe Corridor Buffer */}
              <path
                d="M 30 80 Q 120 40 200 80 T 370 80"
                stroke="rgba(28,25,23,0.08)"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Baseline Expected Route */}
              <path
                d="M 30 80 Q 120 40 200 80 T 370 80"
                stroke="#1C1917"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.4"
              />

              {/* Actual Tracked Path with Anomaly Deviation Node */}
              <path
                d="M 30 80 Q 120 40 190 75 L 225 125"
                stroke="#1C1917"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Waypoint 1: Origin */}
              <circle cx="30" cy="80" r="5" fill="#1C1917" />
              <text x="30" y="105" fontFamily="Space Grotesk" fontSize="9" fill="#1C1917" textAnchor="middle">CAMPUS</text>

              {/* Waypoint 2: Checkpoint Alpha */}
              <circle cx="120" cy="58" r="3.5" fill="#1C1917" />
              <text x="120" y="46" fontFamily="Space Grotesk" fontSize="8" fill="#78716C" textAnchor="middle">CP-01</text>

              {/* Deviation Anomaly Point */}
              <circle cx="225" cy="125" r="7" fill="#F62440" />
              <circle cx="225" cy="125" r="14" stroke="#F62440" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <text x="245" y="129" fontFamily="Space Grotesk" fontSize="9" fontWeight="600" fill="#F62440">
                DEVIATION (+620m)
              </text>

              {/* Waypoint 3: Expected Destination */}
              <circle cx="370" cy="80" r="5" stroke="#1C1917" strokeWidth="2" fill="#FFFAF3" />
              <text x="370" y="105" fontFamily="Space Grotesk" fontSize="9" fill="#1C1917" textAnchor="middle">HOME</text>
            </svg>
          </div>

          {/* Telemetry Strip */}
          <div className="mt-4 pt-3 border-t border-[#1C1917]/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-[#1C1917]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F62440]" />
              <span className="font-medium">SIGNAL: ANOMALY NOTED</span>
            </div>
            <div className="flex items-center gap-4 text-[#78716C]">
              <span>SPEED: 4.2 KM/H</span>
              <span>DEV: +620 METERS</span>
              <span>BATTERY: 84%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer telemetry */}
      <div className="mt-2 flex items-center justify-between text-xs text-[#78716C] px-1 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1C1917]" />
          TELEMETRY ENCRYPTED (ZERO CLOUD RETENTION UNLESS SECURED)
        </span>
        <span className="text-[#1C1917] font-semibold">SAKHI ENGINE V1.4</span>
      </div>
    </div>
  );
};
