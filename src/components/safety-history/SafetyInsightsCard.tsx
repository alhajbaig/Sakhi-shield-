import React, { useState, useEffect } from 'react';
import { Sparkles, SunMedium, Clock, Zap } from 'lucide-react';

export const SafetyInsightsCard: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sh-glass-card p-5 sm:p-6 rounded-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFE5BF]/70 text-[#1C1917] flex items-center justify-center sh-icon-spring">
            <Sparkles className="w-4 h-4 text-[#F62440]" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm sm:text-base text-[#1C1917]">
              Corridor Safety Intelligence & Patterns
            </h3>
            <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider block">
              Continuous spatial telemetry across verified routes
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 sh-beacon-pulse" />
          <span>Optimal Corridor</span>
        </span>
      </div>

      {/* Progress Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Metric 1: Illumination */}
        <div className="p-4 rounded-2xl bg-white/60 border border-[#1C1917]/[0.06] hover:bg-white/90 transition-all space-y-2.5 group">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-semibold text-[#57534E] flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
              <span>Street Illumination</span>
            </span>
            <span className="font-mono font-bold text-[#1C1917]">93%</span>
          </div>
          <div className="w-full h-1.5 bg-[#1C1917]/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full sh-bar-fill"
              style={{ width: mounted ? '93%' : '0%' }}
            />
          </div>
          <div className="text-[11px] font-sans text-[#78716C] leading-snug">
            Pathways categorized as high-lumen verified zones.
          </div>
        </div>

        {/* Metric 2: Safe Haven Proximity */}
        <div className="p-4 rounded-2xl bg-white/60 border border-[#1C1917]/[0.06] hover:bg-white/90 transition-all space-y-2.5 group">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-semibold text-[#57534E] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Safe Haven Proximity</span>
            </span>
            <span className="font-mono font-bold text-emerald-700">96%</span>
          </div>
          <div className="w-full h-1.5 bg-[#1C1917]/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full sh-bar-fill"
              style={{ width: mounted ? '96%' : '0%' }}
            />
          </div>
          <div className="text-[11px] font-sans text-[#78716C] leading-snug">
            Verified havens & police kiosks within 200m at all times.
          </div>
        </div>

        {/* Metric 3: Guardian Latency */}
        <div className="p-4 rounded-2xl bg-white/60 border border-[#1C1917]/[0.06] hover:bg-white/90 transition-all space-y-2.5 group">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-semibold text-[#57534E] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-45 transition-transform" />
              <span>Guardian Sync Latency</span>
            </span>
            <span className="font-mono font-bold text-[#1C1917]">42s avg</span>
          </div>
          <div className="w-full h-1.5 bg-[#1C1917]/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full sh-bar-fill"
              style={{ width: mounted ? '85%' : '0%' }}
            />
          </div>
          <div className="text-[11px] font-sans text-[#78716C] leading-snug">
            Live stream opened by primary circle within 42 seconds.
          </div>
        </div>
      </div>

      {/* Editorial Copilot Observation Note */}
      <div className="p-4 rounded-2xl bg-[#FFE5BF]/30 border-l-3 border-[#F62440] border border-[#1C1917]/[0.06] flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#F62440] shrink-0 mt-0.5" />
        <p className="font-sans text-xs text-[#1C1917] leading-relaxed">
          <strong className="font-semibold">Safety Copilot Pattern Note:</strong> Your commute routes maintain a 94% average illumination score. Arterial metro connectors keep response readiness within optimal threshold limits.
        </p>
      </div>
    </div>
  );
};
