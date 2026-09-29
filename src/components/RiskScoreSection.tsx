import React, { useState } from 'react';
import { Info, Check } from 'lucide-react';

export const RiskScoreSection: React.FC = () => {
  const [activeFactors, setActiveFactors] = useState<{ [key: string]: boolean }>({
    lateNight: true,
    deviation: true,
    stop: true,
    eta: true,
    checkin: true,
  });

  const factors = [
    { id: 'lateNight', label: 'Late-Night Journey (> 22:00)', points: 10, desc: 'Elevated situational caution window' },
    { id: 'deviation', label: 'Route Deviation (> 500m)', points: 20, desc: 'Divergence from registered transit corridor' },
    { id: 'stop', label: 'Unexpected Stop (> 8 min)', points: 15, desc: 'Stationary position outside safe commercial hubs' },
    { id: 'eta', label: 'ETA Exceeded (> 15 min)', points: 10, desc: 'Delayed arrival without traffic anomaly' },
    { id: 'checkin', label: 'Missed Check-in (45s Expired)', points: 25, desc: 'No confirmation received on safety dialog' },
  ];

  const baseScore = 20;
  const calculatedScore = baseScore + Object.keys(activeFactors).reduce((sum, key) => {
    if (!activeFactors[key]) return sum;
    const factor = factors.find((f) => f.id === key);
    return sum + (factor ? factor.points : 0);
  }, 0);

  const getTier = (score: number) => {
    if (score <= 30) return { name: 'SAFE', color: 'text-[#1C1917]', bg: 'bg-[#FFFAF3]', border: 'border-[#1C1917]/20', badge: 'bg-[#1C1917]' };
    if (score <= 60) return { name: 'ATTENTION', color: 'text-[#D97706]', bg: 'bg-[#FFE5BF]', border: 'border-[#D97706]/40', badge: 'bg-[#D97706]' };
    if (score <= 80) return { name: 'HIGH RISK', color: 'text-[#F62440]', bg: 'bg-[#FFF2DB]', border: 'border-[#F62440]/40', badge: 'bg-[#F62440]' };
    return { name: 'CRITICAL', color: 'text-[#F62440]', bg: 'bg-[#F62440]/10', border: 'border-[#F62440]', badge: 'bg-[#F62440]' };
  };

  const currentTier = getTier(calculatedScore);

  const toggleFactor = (id: string) => {
    setActiveFactors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="risk-engine" className="py-24 md:py-36 bg-[#FFFAF3] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              07 / EXPLAINABLE TELEMETRY
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#78716C] tracking-wider font-semibold">
            LIVE SIGNAL CALCULATOR
          </span>
        </div>

        {/* Section Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs tracking-widest text-[#F62440] uppercase font-bold mb-2 block">
              SIGNALS, NOT ASSUMPTIONS
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.08]">
              “Safety signals should be explainable.”
            </h2>
          </div>
          <div className="lg:col-span-5 font-sans text-base sm:text-lg text-[#44403C] leading-relaxed">
            SakhiShield does not claim to predict crime. It evaluates observable safety-related signals
            with transparent mathematical weights. Toggle factors below to see the live score response.
          </div>
        </div>

        {/* Interactive Signal Scoring Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Interactive Checklist (7 cols) */}
          <div className="lg:col-span-7 border-2 border-[#1C1917]/20 bg-[#FFF2DB]/50 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#1C1917]/15 mb-4">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#1C1917] uppercase tracking-wider">
                TOGGLE OBSERVED SIGNALS
              </span>
              <span className="font-mono text-xs sm:text-sm text-[#78716C] font-semibold">
                CLICK TO TEST SCORE
              </span>
            </div>

            {/* Base Score Row */}
            <div className="flex items-center justify-between py-3 border-b border-[#1C1917]/10 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-[#1C1917] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-[#1C1917] text-sm sm:text-base">
                    Base Commute Profile (Constant)
                  </span>
                  <p className="text-xs text-[#57534E]">Standard solitary travel baseline</p>
                </div>
              </div>
              <span className="font-mono font-bold text-[#1C1917] text-base">20</span>
            </div>

            {/* Interactive Signal Checkboxes */}
            <div className="space-y-2.5 my-3">
              {factors.map((f) => {
                const checked = activeFactors[f.id];
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFactor(f.id)}
                    className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      checked
                        ? 'border-[#1C1917] bg-[#FFFAF3]'
                        : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          checked
                            ? 'bg-[#F62440] border-[#F62440] text-white'
                            : 'border-[#1C1917]/30 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-mono font-bold text-sm sm:text-base text-[#1C1917] block">
                          {f.label}
                        </span>
                        <span className="text-xs text-[#57534E] font-sans">{f.desc}</span>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-sm sm:text-base text-[#1C1917] ml-2">
                      +{f.points}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Sum Total Banner */}
            <div className="mt-6 pt-4 border-t-2 border-[#1C1917] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-[#78716C] uppercase font-bold block">
                  CALCULATED ANOMALY SCORE
                </span>
                <span className="font-serif text-2xl text-[#1C1917] font-bold">
                  TOTAL SIGNALS
                </span>
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-bold text-[#F62440]">
                {calculatedScore} / 100
              </div>
            </div>
          </div>

          {/* Right: Dynamic Tier Status & Ethical Disclaimer (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Tier Card */}
            <div className={`p-6 border-2 ${currentTier.border} ${currentTier.bg} rounded-xl shadow-sm transition-colors`}>
              <div className="font-mono text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                ACTIVE CLASSIFICATION TIER
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className={`font-serif text-3xl sm:text-4xl font-bold ${currentTier.color}`}>
                  {currentTier.name}
                </h3>
                <span className="font-mono text-xl font-bold text-[#1C1917]">
                  {calculatedScore} PTS
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#44403C]">
                {currentTier.name === 'SAFE' && 'Signals within normal limits. Background monitoring remains passive.'}
                {currentTier.name === 'ATTENTION' && 'Moderate anomaly detected. Prompting quick verification dialog.'}
                {currentTier.name === 'HIGH RISK' && 'Multiple compounding signals. Recommending nearest safe havens.'}
                {currentTier.name === 'CRITICAL' && 'Maximum risk signals detected. Escalating live telemetry to guardians.'}
              </p>
            </div>

            {/* All Tiers Reference */}
            <div className="p-5 border border-[#1C1917]/20 bg-[#FFF2DB]/60 rounded-xl space-y-2">
              <div className="font-mono text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                SCORING TIERS REFERENCE
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-white rounded border border-[#1C1917]/10 flex items-center justify-between">
                  <span className="font-bold">SAFE</span>
                  <span className="text-[#78716C]">0 – 30</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#1C1917]/10 flex items-center justify-between">
                  <span className="font-bold text-[#D97706]">ATTENTION</span>
                  <span className="text-[#78716C]">31 – 60</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#1C1917]/10 flex items-center justify-between">
                  <span className="font-bold text-[#F62440]">HIGH RISK</span>
                  <span className="text-[#78716C]">61 – 80</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#1C1917]/10 flex items-center justify-between">
                  <span className="font-bold text-[#F62440]">CRITICAL</span>
                  <span className="text-[#78716C]">81 – 100</span>
                </div>
              </div>
            </div>

            {/* Ethical Notice */}
            <div className="p-5 border border-[#1C1917]/20 bg-[#FFFAF3] rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
              <p className="font-sans text-xs sm:text-sm text-[#44403C] leading-relaxed">
                <strong className="text-[#1C1917] block font-mono text-xs uppercase mb-1">
                  Ethical Notice
                </strong>
                “The score represents detected safety-related signals. It is not proof that danger is occurring.”
                SakhiShield evaluates objective data points, never subjective assumptions.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
