import React, { useState } from 'react';
import { Shield, Radio, CheckCircle2, Navigation, RefreshCw } from 'lucide-react';

export const WalkWithMeSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<'monitoring' | 'signal' | 'checkin'>('signal');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

  const resetDemo = () => {
    setActiveStep('monitoring');
    setSelectedResponse(null);
  };

  return (
    <section id="walk-with-me" className="py-24 md:py-36 bg-[#FFE5BF] border-b border-[#1C1917]/15">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Signature Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#1C1917]/25">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F62440]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1C1917] font-bold">
              06 / SIGNATURE CAPABILITY
            </span>
          </div>
          <span className="font-mono text-xs sm:text-sm text-[#1C1917] tracking-wider font-semibold">
            LIVE INTERACTIVE SIMULATION
          </span>
        </div>

        {/* Section Headline */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1C1917] tracking-tight leading-[1.02] mb-3">
            Walk With Me.
          </h2>
          <p className="font-sans text-xl sm:text-2xl text-[#44403C] font-normal leading-relaxed">
            A real-time safety session for the moments when you're travelling alone.
          </p>
        </div>

        {/* High-Fidelity Product Simulation Container */}
        <div className="border-2 border-[#1C1917]/25 bg-[#FFFAF3] rounded-2xl p-6 md:p-10 shadow-md">
          
          {/* Top Session Control Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#1C1917]/15 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-lg">
                <Shield className="w-6 h-6 text-[#FFE5BF]" />
              </div>
              <div>
                <span className="font-mono text-xs tracking-widest text-[#78716C] uppercase font-bold">
                  LIVE INTERACTIVE CONSOLE
                </span>
                <h4 className="font-serif text-2xl text-[#1C1917]">Walk With Me Session</h4>
              </div>
            </div>

            {/* Interactive Timeline Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-[#1C1917]/25 p-1 bg-[#FFF2DB]">
                <button
                  type="button"
                  onClick={() => { setActiveStep('monitoring'); setSelectedResponse(null); }}
                  className={`px-3.5 py-2 rounded text-xs sm:text-sm font-mono transition-colors cursor-pointer font-bold ${
                    activeStep === 'monitoring'
                      ? 'bg-[#1C1917] text-[#FFFAF3]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  1. NORMAL CORRIDOR
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveStep('signal'); setSelectedResponse(null); }}
                  className={`px-3.5 py-2 rounded text-xs sm:text-sm font-mono transition-colors cursor-pointer font-bold ${
                    activeStep === 'signal'
                      ? 'bg-[#FFE5BF] text-[#1C1917] border border-[#1C1917]/20'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  2. DEVIATION (+620M)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('checkin')}
                  className={`px-3.5 py-2 rounded text-xs sm:text-sm font-mono transition-colors cursor-pointer font-bold ${
                    activeStep === 'checkin'
                      ? 'bg-[#F62440] text-[#FFFAF3]'
                      : 'text-[#57534E] hover:text-[#F62440]'
                  }`}
                >
                  3. ARE YOU SAFE?
                </button>
              </div>

              <button
                type="button"
                onClick={resetDemo}
                className="p-2 border border-[#1C1917]/20 rounded-lg bg-[#FFF2DB] hover:bg-[#FFE5BF] text-[#1C1917] cursor-pointer"
                title="Reset simulation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Simulation Grid: Route Left, State & Decision Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive SVG Map (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-[#1C1917]/20 bg-[#FFF2DB]/60 rounded-xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#1C1917]/15 text-xs sm:text-sm font-mono mb-4">
                  <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-[#F62440]" />
                    COLLEGE → HOME CORRIDOR
                  </span>
                  <span className="font-bold text-[#1C1917]">
                    {activeStep === 'monitoring' ? 'STATUS: NOMINAL' : 'ANOMALY DETECTED'}
                  </span>
                </div>

                {/* SVG Route Visualization (Responds dynamically to activeStep) */}
                <div className="relative h-64 w-full flex items-center justify-center bg-[#FFFAF3] rounded-lg border border-[#1C1917]/15 p-4 overflow-hidden">
                  <svg viewBox="0 0 360 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="wwm-grid-2" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(28,25,23,0.06)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#wwm-grid-2)" />

                    {/* Safe Corridor Buffer Zone */}
                    <path
                      d="M 40 160 C 100 160 120 70 200 70 C 260 70 300 40 320 40"
                      stroke="rgba(28,25,23,0.08)"
                      strokeWidth="24"
                      strokeLinecap="round"
                    />

                    {/* Baseline Planned Path */}
                    <path
                      d="M 40 160 C 100 160 120 70 200 70 C 260 70 300 40 320 40"
                      stroke="#1C1917"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      opacity="0.35"
                    />

                    {/* Actual Walked Path */}
                    {activeStep === 'monitoring' ? (
                      <path
                        d="M 40 160 C 90 160 110 100 160 85"
                        stroke="#1C1917"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    ) : (
                      <path
                        d="M 40 160 C 100 160 120 70 190 70 L 220 130"
                        stroke="#1C1917"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Waypoint 1: College */}
                    <circle cx="40" cy="160" r="7" fill="#1C1917" />
                    <text x="40" y="185" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" fill="#1C1917" textAnchor="middle">
                      COLLEGE
                    </text>

                    {/* Waypoint 2: Checkpoint */}
                    <circle cx="150" cy="95" r="4" fill="#1C1917" />

                    {/* Anomaly or Active Position */}
                    {activeStep === 'monitoring' ? (
                      <>
                        <circle cx="160" cy="85" r="7" fill="#1C1917" />
                        <circle cx="160" cy="85" r="14" stroke="#1C1917" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                        <text x="180" y="89" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" fill="#1C1917">
                          ON TRACK
                        </text>
                      </>
                    ) : (
                      <>
                        <circle cx="220" cy="130" r="8" fill="#F62440" />
                        <circle cx="220" cy="130" r="18" stroke="#F62440" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
                        <text x="244" y="134" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" fill="#F62440">
                          DEVIATION (+620m)
                        </text>
                      </>
                    )}

                    {/* Expected End: Home */}
                    <circle cx="320" cy="40" r="7" stroke="#1C1917" strokeWidth="2.5" fill="#FFE5BF" />
                    <text x="320" y="24" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" fill="#1C1917" textAnchor="middle">
                      HOME
                    </text>
                  </svg>
                </div>

                {/* Corridor telemetry footer */}
                <div className="mt-4 pt-3 border-t border-[#1C1917]/15 flex items-center justify-between text-xs sm:text-sm font-mono text-[#44403C]">
                  <span>ORIGIN: UNIVERSITY NORTH</span>
                  <span className="font-bold text-[#1C1917]">
                    {activeStep === 'monitoring' ? 'DELTA: 0 METERS (SAFE)' : 'DELTA: +620 METERS (FLAGGED)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Telemetry & Interactive Check-In (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Telemetry Block */}
              <div className="border border-[#1C1917]/20 bg-[#FFF2DB]/60 rounded-xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#1C1917]/15 text-xs sm:text-sm font-mono mb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#F62440]" />
                    <span className="font-bold text-[#1C1917]">WALK WITH ME</span>
                  </div>
                  <span className="font-bold text-[#F62440]">MONITORING ACTIVE</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-lg">
                    <div className="font-mono text-xs text-[#78716C] uppercase font-bold">ESTIMATED TIME</div>
                    <div className="font-sans font-bold text-xl text-[#1C1917] mt-0.5">20 MIN</div>
                  </div>
                  <div className="p-3.5 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-lg">
                    <div className="font-mono text-xs text-[#78716C] uppercase font-bold">CURRENT STATUS</div>
                    <div className="font-sans font-bold text-lg text-[#1C1917] flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${activeStep === 'monitoring' ? 'bg-[#1C1917]' : 'bg-[#F62440]'}`} />
                      {activeStep === 'monitoring' ? 'CORRIDOR SAFE' : 'ANOMALY DETECTED'}
                    </div>
                  </div>
                </div>

                {/* Anomaly Banner */}
                {activeStep !== 'monitoring' && (
                  <div className="p-3.5 bg-[#FFFAF3] border border-[#F62440]/50 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#F62440] uppercase">
                        OBSERVED ANOMALY
                      </div>
                      <div className="font-sans font-bold text-sm sm:text-base text-[#1C1917]">
                        ROUTE DEVIATION: 620m
                      </div>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 bg-[#F62440] text-[#FFFAF3] rounded font-bold">
                      ATTENTION
                    </span>
                  </div>
                )}
              </div>

              {/* The "Are You Safe?" Interactive Prompt */}
              <div className="border border-[#1C1917]/25 bg-[#FFFAF3] rounded-xl p-5 shadow-sm">
                <div className="text-center pb-3">
                  <h4 className="font-serif text-2xl md:text-3xl text-[#1C1917] mb-1 font-bold">
                    “Are you safe?”
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-[#44403C]">
                    Click any option below to test the instant responsive confirmation.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 my-3">
                  <button
                    type="button"
                    onClick={() => setSelectedResponse('SAFE')}
                    className={`p-3.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedResponse === 'SAFE'
                        ? 'border-[#1C1917] bg-[#1C1917] text-[#FFFAF3]'
                        : 'border-[#1C1917]/25 bg-[#FFF2DB]/60 hover:bg-[#FFF2DB] text-[#1C1917]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold block">I'M SAFE</span>
                    <span className="text-[11px] opacity-75">All clear</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedResponse('UNCOMFORTABLE')}
                    className={`p-3.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedResponse === 'UNCOMFORTABLE'
                        ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold'
                        : 'border-[#1C1917]/25 bg-[#FFE5BF]/40 hover:bg-[#FFE5BF] text-[#1C1917]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold block">UNCOMFORTABLE</span>
                    <span className="text-[11px] text-[#57534E]">Safe haven</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedResponse('HELP')}
                    className={`p-3.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedResponse === 'HELP'
                        ? 'border-[#F62440] bg-[#F62440] text-[#FFFAF3] font-bold'
                        : 'border-[#F62440]/40 bg-[#FFF2DB] hover:bg-[#FFE5BF] text-[#1C1917]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-[#F62440] block">I NEED HELP</span>
                    <span className="text-[11px] text-[#78716C]">Escalate</span>
                  </button>
                </div>

                {selectedResponse && (
                  <div className="mt-3 p-3 bg-[#FFE5BF] border border-[#1C1917]/20 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-[#1C1917] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#F62440]" />
                    <span>STATUS VERIFIED: {selectedResponse} ENGAGED</span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#1C1917]/15 flex items-center justify-between text-xs font-mono text-[#78716C]">
                  <span className="text-[#F62440] font-bold">MANUAL SOS ALWAYS AVAILABLE</span>
                  <span className="font-semibold text-[#1C1917]">ZERO INTRUSIVE ALARMS</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
