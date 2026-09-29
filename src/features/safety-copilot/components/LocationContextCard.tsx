// SakhiShield — Location Context Card
// Communicates GPS lock quality and privacy boundaries without leaking exact coordinates.

import React from 'react';
import { MapPin, Lock } from 'lucide-react';
import type { LocationContext, RouteContext } from '../types/safetyCopilot.types';

interface LocationContextCardProps {
  location?: LocationContext;
  route?: RouteContext;
}

export const LocationContextCard: React.FC<LocationContextCardProps> = ({ location, route }) => {
  const hasGps = Boolean(location?.hasPermission);
  const isOffRoute = Boolean(route?.isOffRoute);

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[#1C1917]/12 bg-white/70 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1C1917]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
            Spatial Corridor & Privacy
          </h3>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-700" />
          PRIVACY LOCKED
        </span>
      </div>

      <div className="space-y-2 text-xs font-sans text-[#57534E]">
        <div className="flex items-center justify-between py-1 border-b border-[#1C1917]/6">
          <span className="font-mono text-[11px] text-[#78716C]">GPS Telemetry:</span>
          <span className="font-semibold text-[#1C1917]">
            {hasGps ? 'High Precision Acquired' : 'Approximate / Sensor Standby'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-[#1C1917]/6">
          <span className="font-mono text-[11px] text-[#78716C]">Corridor Alignment:</span>
          <span className={`font-semibold ${isOffRoute ? 'text-amber-700' : 'text-emerald-700'}`}>
            {isOffRoute ? 'Deviation Alert Active' : 'Aligned with Planned Route'}
          </span>
        </div>

        <p className="text-[11px] text-[#78716C] leading-normal pt-1">
          Exact coordinates are retained strictly on-device and are only transmitted to your Trusted Circle during verified emergency alerts.
        </p>
      </div>
    </div>
  );
};
