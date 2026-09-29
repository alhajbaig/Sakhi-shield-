// Walk With Me - Route Preview & Confirmation Modal (Ultra Premium Design)
// Visual timeline from your location to destination with safety features

import React from 'react';
import type { JourneyRoute } from '../../types/journey';
import type { GeocodedDestination } from '../../services/mapboxService';
import { Clock, MapPin, ShieldCheck, ArrowRight, X, Navigation, Route, Eye, Users, Loader2 } from 'lucide-react';

interface RoutePreviewModalProps {
  destination: GeocodedDestination;
  route: JourneyRoute;
  onConfirm: () => void;
  onCancel: () => void;
  isStarting: boolean;
}

export const RoutePreviewModal: React.FC<RoutePreviewModalProps> = ({
  destination,
  route,
  onConfirm,
  onCancel,
  isStarting,
}) => {
  const distanceKm = (route.distanceMeters / 1000).toFixed(1);
  const durationMins = Math.round(route.durationSeconds / 60);
  const arrivalTime = new Date(Date.now() + route.durationSeconds * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/70 backdrop-blur-sm">
      <div
        className="bg-[#FFFAF3] border border-[#171515]/10 rounded-[2rem] max-w-lg w-full shadow-2xl overflow-hidden"
        style={{
          animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#171515] via-[#F62440] to-[#FFB347]" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#171515] flex items-center justify-center shadow-md">
                <Route className="w-5 h-5 text-[#FFE5BF]" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-[0.15em] block">
                  SAFETY CORRIDOR
                </span>
                <h3 className="font-serif text-lg font-bold text-[#171515] -mt-0.5">
                  Route Preview
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isStarting}
              className="p-2 rounded-xl text-[#78716C] hover:text-[#171515] hover:bg-[#171515]/5 cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Visual Route Timeline */}
          <div className="relative pl-8">
            {/* Vertical connecting line */}
            <div className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-emerald-500 via-[#171515]/20 to-[#F62440]" />

            {/* Start Point */}
            <div className="relative flex items-start gap-4 pb-6">
              <div className="absolute -left-8 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md z-10 ring-4 ring-emerald-100">
                <Navigation className="w-4 h-4 text-white" />
              </div>
              <div className="pt-0.5">
                <span className="font-mono text-[9px] text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">
                  YOUR LOCATION
                </span>
                <p className="font-sans text-xs text-[#78716C] mt-1">
                  Current GPS position
                </p>
              </div>
            </div>

            {/* Route info in middle */}
            <div className="relative flex items-start gap-4 pb-6 ml-1">
              <div className="absolute -left-[2.25rem] w-6 h-6 rounded-full bg-[#FFF2DB] border-2 border-[#171515]/20 flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-[#171515]/40" />
              </div>
              <div className="flex items-center gap-3 bg-[#FFF2DB]/60 rounded-xl px-4 py-2.5 border border-[#171515]/10">
                <div className="flex items-center gap-1.5 text-[#171515]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs font-bold">~{durationMins} min</span>
                </div>
                <div className="w-px h-4 bg-[#171515]/20" />
                <div className="flex items-center gap-1.5 text-[#171515]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs font-bold">{distanceKm} km</span>
                </div>
                <div className="w-px h-4 bg-[#171515]/20" />
                <div className="flex items-center gap-1.5 text-[#78716C]">
                  <span className="font-mono text-[10px]">ETA {arrivalTime}</span>
                </div>
              </div>
            </div>

            {/* Destination Point */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-8 w-8 h-8 rounded-full bg-[#F62440] flex items-center justify-center shadow-md z-10 ring-4 ring-red-100">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="pt-0.5">
                <span className="font-mono text-[9px] text-[#F62440] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full">
                  DESTINATION
                </span>
                <h4 className="font-serif text-base font-bold text-[#171515] mt-1 leading-snug">
                  {destination.name}
                </h4>
                <p className="font-sans text-xs text-[#78716C] mt-0.5 max-w-[280px]">
                  {destination.fullAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Safety Features Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#171515]/8">
              <Eye className="w-4 h-4 text-[#171515]" />
              <span className="font-mono text-[9px] font-bold text-[#171515] text-center uppercase">Live Monitoring</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#171515]/8">
              <Users className="w-4 h-4 text-[#171515]" />
              <span className="font-mono text-[9px] font-bold text-[#171515] text-center uppercase">Circle on Standby</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#171515]/8">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-mono text-[9px] font-bold text-[#171515] text-center uppercase">Auto Check-ins</span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-sans text-[11px] text-emerald-800 leading-relaxed">
              Monitoring activates only after confirmation and auto-terminates on arrival. Your location is never stored permanently.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={isStarting}
              className="flex-1 py-3.5 px-5 rounded-2xl border border-[#171515]/15 font-mono text-xs font-bold text-[#171515] hover:bg-[#FFF2DB]/50 transition-all cursor-pointer disabled:opacity-50"
            >
              CHANGE DESTINATION
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isStarting}
              className="flex-[1.5] py-3.5 px-5 rounded-2xl bg-[#171515] text-[#FFFAF3] font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              style={{
                background: isStarting ? '#171515' : 'linear-gradient(135deg, #171515 0%, #2d2a2a 100%)',
              }}
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>INITIALIZING...</span>
                </>
              ) : (
                <>
                  <span>START WALK WITH ME</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
