// Walk With Me - Developer Simulation & Test Tooling Panel
// Allows QA and testing of deviation, stops, ETA delays, check-ins, and emergency signals

import React, { useState } from 'react';
import type { GPSPoint } from '../../types/journey';
import { Bug, Play, RotateCcw, AlertTriangle, X } from 'lucide-react';

interface SimulationControlPanelProps {
  currentLocation: GPSPoint | null;
  onSimulateDeviation: () => void;
  onSimulateStop: () => void;
  onSimulateEtaDelay: () => void;
  onTriggerCheckIn: () => void;
  onSimulateSOS: () => void;
  onResetSimulation: () => void;
}

export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({
  currentLocation,
  onSimulateDeviation,
  onSimulateStop,
  onSimulateEtaDelay,
  onTriggerCheckIn,
  onSimulateSOS,
  onResetSimulation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#171515] text-[#FFE5BF] shadow-2xl hover:bg-black transition-transform cursor-pointer hover:scale-105 flex items-center gap-2 font-mono text-[11px] font-bold border border-[#FFE5BF]/30"
      >
        <Bug className="w-4 h-4 text-[#F62440]" />
        <span>SIMULATE</span>
      </button>

      {/* Simulation Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-[#FFFAF3] rounded-3xl border border-[#171515]/20 shadow-2xl p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#171515]/10">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-[#F62440]" />
              <span className="font-mono text-xs font-bold text-[#171515] uppercase tracking-wider">
                TEST SCENARIOS
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#78716C] hover:text-[#171515] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-sans text-[11px] text-[#78716C]">
            Trigger observable journey events to verify deterministic risk calculation, check-in prompts, and guardian escalation.
          </p>

          {currentLocation ? (
            <div className="p-2 rounded-xl bg-white border border-[#171515]/10 font-mono text-[10px] text-[#78716C] flex items-center justify-between">
              <span>GPS: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</span>
              <span className="text-emerald-700 font-bold">±{Math.round(currentLocation.accuracy)}m</span>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-white border border-[#171515]/10 font-mono text-[10px] text-amber-700">
              GPS: Acquiring satellite lock...
            </div>
          )}

          <div className="space-y-2">
            <button
              type="button"
              onClick={onSimulateDeviation}
              className="w-full py-2 px-3 rounded-xl bg-white border border-[#171515]/15 text-left font-mono text-[10px] font-bold text-[#171515] hover:bg-amber-50 hover:border-amber-400 transition-colors flex items-center justify-between"
            >
              <span>ROUTE DEVIATION (+180M)</span>
              <Play className="w-3 h-3 text-amber-600" />
            </button>

            <button
              type="button"
              onClick={onSimulateStop}
              className="w-full py-2 px-3 rounded-xl bg-white border border-[#171515]/15 text-left font-mono text-[10px] font-bold text-[#171515] hover:bg-amber-50 hover:border-amber-400 transition-colors flex items-center justify-between"
            >
              <span>UNEXPECTED STOP (&gt;45s)</span>
              <Play className="w-3 h-3 text-amber-600" />
            </button>

            <button
              type="button"
              onClick={onSimulateEtaDelay}
              className="w-full py-2 px-3 rounded-xl bg-white border border-[#171515]/15 text-left font-mono text-[10px] font-bold text-[#171515] hover:bg-amber-50 hover:border-amber-400 transition-colors flex items-center justify-between"
            >
              <span>ETA DELAY (+10 MIN)</span>
              <Play className="w-3 h-3 text-amber-600" />
            </button>

            <button
              type="button"
              onClick={onTriggerCheckIn}
              className="w-full py-2 px-3 rounded-xl bg-white border border-[#171515]/15 text-left font-mono text-[10px] font-bold text-[#171515] hover:bg-[#FFF2DB] transition-colors flex items-center justify-between"
            >
              <span>TRIGGER CHECK-IN PROMPT</span>
              <AlertTriangle className="w-3 h-3 text-[#F62440]" />
            </button>

            <button
              type="button"
              onClick={onSimulateSOS}
              className="w-full py-2 px-3 rounded-xl bg-red-50 border border-red-300 text-left font-mono text-[10px] font-bold text-red-900 hover:bg-red-100 transition-colors flex items-center justify-between"
            >
              <span>TRIGGER EMERGENCY SOS</span>
              <Play className="w-3 h-3 text-red-600" />
            </button>

            <button
              type="button"
              onClick={onResetSimulation}
              className="w-full py-2 px-3 rounded-xl border border-[#171515]/20 text-center font-mono text-[10px] font-bold text-[#78716C] hover:text-[#171515] hover:bg-[#FFF2DB]/60 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET TO BASELINE</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
