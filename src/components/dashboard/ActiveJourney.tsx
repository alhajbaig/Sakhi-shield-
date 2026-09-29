import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { Navigation, Compass, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActiveJourney: React.FC = () => {
  const { user, startJourney, endJourney } = useApp();
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [destInput, setDestInput] = useState('Residence (Home)');

  const journey = user.activeJourney;

  const handleStart = () => {
    startJourney(destInput);
    setShowDestinationModal(false);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#F62440]" />
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
              ACTIVE JOURNEY
            </h3>
          </div>
          {journey && (
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
              SESSION ACTIVE
            </span>
          )}
        </div>

        {/* Dynamic State View */}
        {!journey ? (
          /* Empty / Inactive state with quick presets */
          <div className="py-2 space-y-4">
            <div>
              <h4 className="font-serif text-2xl text-[#1C1917] font-bold mb-1">
                No active journey.
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Activate Walk With Me for real-time corridor monitoring, safe haven guidance, and automated check-ins. Guardians are alerted only upon unverified delays or deviations.
              </p>
            </div>

            {/* Quick Destination Chips */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold block">
                Quick Destination Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Home (Residence)', icon: '🏡' },
                  { name: 'Office / Campus', icon: '🏢' },
                  { name: 'Metro / Transit Hub', icon: '🚇' },
                  { name: 'Market / Central', icon: '🛍️' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => startJourney(preset.name)}
                    className="px-3 py-1.5 rounded-lg border border-[#1C1917]/15 bg-white/80 hover:bg-[#FFE5BF] hover:border-[#1C1917]/30 transition-all font-mono text-xs text-[#1C1917] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/walk-with-me"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1C1917] hover:bg-[#F62440] text-[#FFFAF3] rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Navigation className="w-4 h-4 text-[#FFE5BF]" />
                <span>OPEN LIVE MAP COMPANION</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active journey view */
          <div className="py-2 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#78716C] uppercase font-semibold">Live Destination</span>
                <div className="font-serif text-2xl text-[#1C1917] font-bold flex items-center gap-2 mt-0.5">
                  <Compass className="w-5 h-5 text-[#F62440]" />
                  <span>{journey.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-[#78716C] uppercase font-semibold">Estimated Arrival</span>
                <div className="font-mono text-2xl font-bold text-[#1C1917]">
                  {journey.eta}
                </div>
              </div>
            </div>

            {/* Live Visual Corridor Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#78716C]">
                <span>Origin (Current Point)</span>
                <span className="text-[#F62440] font-bold">65% ROUTE COMPLETED</span>
                <span>Destination</span>
              </div>
              <div className="h-2 w-full bg-[#1C1917]/10 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#F62440] w-2/3 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-[#FFF2DB]/80 rounded-xl border border-[#1C1917]/10">
                <span className="text-[#78716C] block text-[10px] font-semibold">CORRIDOR MONITORING</span>
                <span className="font-bold text-[#1C1917] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>{journey.monitoring}</span>
                </span>
              </div>
              <div className="p-3 bg-[#FFF2DB]/80 rounded-xl border border-[#1C1917]/10">
                <span className="text-[#78716C] block text-[10px] font-semibold">SENTINEL STATUS</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{journey.status}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Link
                to="/walk-with-me"
                className="flex-1 py-2.5 px-3 bg-[#1C1917] text-[#FFFAF3] hover:bg-[#333] rounded-xl text-xs font-mono font-bold transition-colors text-center flex items-center justify-center gap-2 shadow-xs min-w-[130px]"
              >
                <span>OPEN HUD VIEW</span>
                <span>→</span>
              </Link>
              <button
                type="button"
                onClick={endJourney}
                className="py-2.5 px-3 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Confirm you have arrived safely"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>I HAVE ARRIVED</span>
              </button>
              <button
                type="button"
                onClick={endJourney}
                className="py-2.5 px-3 bg-stone-200/80 hover:bg-stone-300 border border-stone-300 text-stone-700 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer shadow-2xs"
                title="Cancel / Turn off walk monitoring"
              >
                <span>OFF WALK</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Destination Modal */}
      {showDestinationModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFAF3] border border-[#1C1917]/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-serif text-2xl font-bold text-[#1C1917] mb-2">
              Start Walk With Me Session
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#57534E] mb-4">
              Enter your planned destination so SakhiShield can compute your safe transit corridor bounds.
            </p>

            <div className="mb-4">
              <label className="font-mono text-xs font-bold text-[#1C1917] uppercase block mb-1">
                Destination
              </label>
              <input
                type="text"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                placeholder="e.g. Home, Metro Station, Hostel"
                className="w-full p-3 rounded-lg border border-[#1C1917]/20 bg-white font-sans text-sm focus:border-[#F62440] focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDestinationModal(false)}
                className="flex-1 py-2.5 border border-[#1C1917]/20 text-[#1C1917] rounded-lg text-xs font-mono font-bold hover:bg-[#FFF2DB]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleStart}
                className="flex-1 py-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-lg text-xs font-mono font-bold hover:bg-[#333]"
              >
                START SESSION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Subtitle */}
      <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between text-[11px] font-mono text-[#78716C] mt-4">
        <span>PRIMARY PASSENGER DEFENSE</span>
        <span>CORRIDOR BOUNDS ±150M</span>
      </div>
    </div>
  );
};
