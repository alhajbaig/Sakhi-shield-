// Walk With Me - Active Journey Status Card (Ultra Premium UX)
// Live monitoring dashboard with progress, ETA, safety signals, and quick actions

import React, { useState, useEffect } from 'react';
import type { Journey, GPSPoint } from '../../types/journey';
import type { RiskEngineResult, RouteDeviationState, StopDetectionState } from '../../types/safety';
import {
  Compass,
  Clock,
  Shield,
  AlertTriangle,
  Share2,
  Building2,
  CheckCircle,
  AlertOctagon,
  Users,
  Route,
  MapPin,
  Activity,
  XCircle,
} from 'lucide-react';

interface JourneyStatusCardProps {
  journey: Journey;
  currentLocation: GPSPoint | null;
  riskResult: RiskEngineResult;
  deviationState: RouteDeviationState;
  deviationDistance: number;
  stopState: StopDetectionState;
  stoppedDurationSec?: number;
  onOpenSafePlaces: () => void;
  onOpenRerouteModal?: () => void;
  onShareLocation: () => void;
  onRequestCheckIn: () => void;
  onCompleteJourney: () => void;
  onCancelJourney?: () => void;
  onTriggerSOS: () => void;
}

export const JourneyStatusCard: React.FC<JourneyStatusCardProps> = ({
  journey,
  currentLocation: _currentLocation,
  riskResult,
  deviationState: _deviationState,
  deviationDistance,
  stopState,
  stoppedDurationSec = 0,
  onOpenSafePlaces,
  onOpenRerouteModal,
  onShareLocation,
  onRequestCheckIn,
  onCompleteJourney,
  onCancelJourney,
  onTriggerSOS,
}) => {
  const distanceKm = (journey.distance_meters / 1000).toFixed(1);
  const [elapsedMin, setElapsedMin] = useState(0);

  // Live elapsed time
  useEffect(() => {
    const startTime = new Date(journey.started_at).getTime();
    const update = () => {
      setElapsedMin(Math.floor((Date.now() - startTime) / 60000));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [journey.started_at]);

  // Format ETA time nicely (e.g. 10:45 PM)
  const etaFormatted = new Date(journey.estimated_arrival).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getRiskBadge = () => {
    switch (riskResult.level) {
      case 'SAFE':
        return { label: 'ON TRACK', color: 'bg-emerald-500 text-white', dot: 'bg-emerald-400' };
      case 'ATTENTION':
        return { label: 'SIGNAL DETECTED', color: 'bg-amber-500 text-white', dot: 'bg-amber-400' };
      case 'HIGH_RISK':
        return { label: 'ELEVATED', color: 'bg-orange-500 text-white', dot: 'bg-orange-400' };
      case 'CRITICAL':
        return { label: 'CRITICAL', color: 'bg-[#F62440] text-white', dot: 'bg-red-300' };
    }
  };

  const badge = getRiskBadge();

  const getPaceStatus = () => {
    if (stopState === 'STOP_CONFIRMED') return { label: 'Stationary', color: 'text-amber-700' };
    if (stoppedDurationSec && stoppedDurationSec > 5) return { label: `Paused (${stoppedDurationSec}s)`, color: 'text-amber-600' };
    if (stopState === 'POSSIBLY_STOPPED') return { label: 'Slowing', color: 'text-amber-600' };
    if (stopState === 'LOCATION_UNCERTAIN') return { label: 'Signal weak', color: 'text-[#78716C]' };
    return { label: 'Walking', color: 'text-emerald-700' };
  };

  const pace = getPaceStatus();

  return (
    <div className="bg-[#FFFAF3] rounded-[2rem] border border-[#171515]/10 shadow-xl overflow-hidden">
      {/* Top Status Bar */}
      <div className="px-5 py-3.5 bg-[#171515] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-white/90 uppercase">
            LIVE MONITORING
          </span>
          {journey.route_version && journey.route_version > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-white/15 font-mono text-[9px] font-bold text-white/80">
              ROUTE V{journey.route_version}
            </span>
          )}
        </div>

        <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold flex items-center gap-1.5 ${badge.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Destination & Progress */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#F62440] shrink-0" />
              <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider">HEADING TO</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171515] truncate leading-tight">
              {journey.destination_name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-[10px] text-[#78716C] uppercase block">WALKING</span>
            <span className="font-mono text-lg font-bold text-[#171515]">{elapsedMin}m</span>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 bg-white rounded-2xl border border-[#171515]/8 text-center">
            <Clock className="w-4 h-4 text-[#171515] mx-auto mb-1.5" />
            <span className="font-mono text-[9px] text-[#78716C] uppercase block">ETA</span>
            <span className="font-mono text-sm font-bold text-[#171515]">{etaFormatted}</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#171515]/8 text-center">
            <Compass className="w-4 h-4 text-[#171515] mx-auto mb-1.5" />
            <span className="font-mono text-[9px] text-[#78716C] uppercase block">DISTANCE</span>
            <span className="font-mono text-sm font-bold text-[#171515]">{distanceKm} km</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#171515]/8 text-center">
            <Activity className="w-4 h-4 text-[#171515] mx-auto mb-1.5" />
            <span className="font-mono text-[9px] text-[#78716C] uppercase block">PACE</span>
            <span className={`font-mono text-sm font-bold ${pace.color}`}>{pace.label}</span>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3 py-2.5 px-4 bg-white/80 rounded-2xl border border-[#171515]/8">
          <div className="flex items-center gap-2 flex-1">
            <Route className="w-3.5 h-3.5 text-[#171515]" />
            <span className="font-mono text-[10px] text-[#78716C]">CORRIDOR</span>
            <span className={`font-mono text-[10px] font-bold ${
              deviationDistance > 100 ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              {deviationDistance > 100 ? `+${deviationDistance}m Off` : 'On Track'}
            </span>
          </div>
          <div className="w-px h-4 bg-[#171515]/10" />
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[10px] font-bold text-emerald-700">GUARDIANS ACTIVE</span>
          </div>
        </div>

        {/* Safety Signals (if any) */}
        {riskResult.reasons.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <span className="font-mono text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              SAFETY SIGNALS ({riskResult.score}/100)
            </span>
            {riskResult.reasons.map((r, i) => (
              <p key={i} className="font-sans text-xs text-amber-800">
                • {r}
              </p>
            ))}

            {deviationDistance >= 100 && onOpenRerouteModal && (
              <button
                type="button"
                onClick={onOpenRerouteModal}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-amber-200/90 hover:bg-amber-300 text-amber-950 font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <Route className="w-3.5 h-3.5 text-amber-900" />
                <span>INTENTIONAL DETOUR? UPDATE ROUTE</span>
              </button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider block mb-2.5">
            QUICK ACTIONS
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onOpenSafePlaces}
              className="p-3 rounded-xl border border-[#171515]/10 bg-white hover:bg-[#FFF2DB] text-center transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
            >
              <Building2 className="w-4 h-4 text-[#171515] mx-auto mb-1 group-hover:text-[#F62440] transition-colors" />
              <span className="font-mono text-[10px] font-bold text-[#171515] block uppercase">SAFE SPOTS</span>
            </button>

            <button
              type="button"
              onClick={onShareLocation}
              className="p-3 rounded-xl border border-[#171515]/10 bg-white hover:bg-[#FFF2DB] text-center transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4 text-[#171515] mx-auto mb-1 group-hover:text-[#F62440] transition-colors" />
              <span className="font-mono text-[10px] font-bold text-[#171515] block uppercase">SHARE LINK</span>
            </button>

            <button
              type="button"
              onClick={onRequestCheckIn}
              className="p-3 rounded-xl border border-[#171515]/10 bg-white hover:bg-[#FFF2DB] text-center transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
            >
              <Shield className="w-4 h-4 text-[#171515] mx-auto mb-1 group-hover:text-[#F62440] transition-colors" />
              <span className="font-mono text-[10px] font-bold text-[#171515] block uppercase">CHECK-IN</span>
            </button>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCompleteJourney}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#171515] text-[#FFFAF3] font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] min-w-[130px]"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>I'VE ARRIVED</span>
          </button>

          {onCancelJourney && (
            <button
              type="button"
              onClick={onCancelJourney}
              className="py-3 px-3.5 rounded-2xl bg-stone-200/90 hover:bg-stone-300 text-stone-800 font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.01] active:scale-[0.99]"
              title="Turn off corridor walk monitoring"
            >
              <XCircle className="w-4 h-4 text-stone-600" />
              <span>OFF WALK</span>
            </button>
          )}

          <button
            type="button"
            onClick={onTriggerSOS}
            className="py-3 px-5 rounded-2xl bg-[#F62440] text-white font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg hover:bg-[#D91F38] hover:scale-[1.01] active:scale-[0.99]"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
