import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, Zap, ArrowRight, Navigation, CheckCircle2, Radio } from 'lucide-react';
import { ScrollExpand } from '../ui/ScrollExpand';
import { useAuth } from '../../lib/AuthContext';

export const SafeCorridorExpand: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'havens' | 'sentry' | 'sos'>('havens');
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative select-none" id="safe-corridor">
      {/* ── 01. TOP WAVY TRANSITION: Ivory (#FFFAF3) to Ink (#171515) ── */}
      <div className="w-full overflow-hidden leading-none bg-[#FFFAF3] -mb-1 pointer-events-none z-10 relative">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-24 lg:h-32 text-[#171515]"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,36 C360,115 720,0 1080,70 C1220,95 1360,45 1440,55 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── 02. MAIN INTERACTIVE EXPANDING CORRIDOR ── */}
      <section
        className="relative bg-[#171515] text-[#FFFAF3]"
        aria-label="Interactive Safe Corridor Experience"
      >
        {/* Subtle ambient lighting behind resting card */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#F62440]/20 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#FFE5BF]/10 blur-[130px]" />
        </div>

        <ScrollExpand
          src="/night_corridor.jpg"
          alt="Woman walking safely at night in a protected urban corridor"
          title={
            <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl select-none">
              {/* Live Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171515]/90 backdrop-blur-md border border-[#F62440]/40 text-[10px] sm:text-xs font-mono tracking-widest text-[#FFFAF3] uppercase mb-3.5 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F62440] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F62440]" />
                </span>
                <span>9:40 PM • REAL-TIME CORRIDOR SENTINEL</span>
              </div>

              {/* Serif Headline */}
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FFFAF3] leading-[1.1] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                Unlit streets.<br />
                <span className="italic text-[#FFE5BF] font-normal">Never unmonitored.</span>
              </h2>

              {/* Subtitle */}
              <p className="font-sans text-xs sm:text-sm text-[#FFFAF3]/80 mt-3 max-w-sm font-light drop-shadow-md">
                Continuous telemetry, verified safe spots, and automated check-ins.
              </p>
            </div>
          }
          scrollHint={
            <div className="flex flex-col items-center gap-1 text-center text-[#FFFAF3]/80 pointer-events-none select-none">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#FFE5BF] font-medium drop-shadow-sm">
                Scroll to expand corridor view
              </span>
              <span className="text-base animate-bounce text-[#F62440]">↓</span>
            </div>
          }
          startWidth={52}
          startHeight={64}
          startRadius={28}
          endRadius={0}
          mediaZoom={1.35}
          scrollDistance={1.3}
          holdDistance={0.5}
          smoothing={0.12}
          overlayScrim={0.68}
          useWindowScroll={true}
          className="w-full"
        >
          {/* ── EXPANDED FULL-BLEED INTERACTIVE CONSOLE ── */}
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-start justify-center min-h-[80vh]">
            <div className="w-full max-w-xl bg-[#141212]/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
              
              {/* Top Live Status Bar */}
              <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-white/10">
                <div className="inline-flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]" />
                  </span>
                  <span className="font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-[#FFFAF3]">
                    LIVE CORRIDOR TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-mono">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>SENTINEL ACTIVE</span>
                </div>
              </div>

              {/* Clean, Restrained Headline */}
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFAF3] tracking-tight leading-snug mb-2 font-normal">
                Real-Time Corridor Sentinel
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#FFFAF3]/75 leading-relaxed mb-5">
                Continuous spatial awareness, verified 24/7 safe havens, and zero-panic automated check-in verification.
              </p>

              {/* Modern Segmented Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('havens')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'havens'
                      ? 'bg-[#1C1917] text-[#FFFAF3] border border-white/20 shadow-xs'
                      : 'text-[#FFFAF3]/60 hover:text-[#FFFAF3] hover:bg-white/5'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#F62440]" />
                  <span>Safe Havens</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sentry')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'sentry'
                      ? 'bg-[#1C1917] text-[#FFFAF3] border border-white/20 shadow-xs'
                      : 'text-[#FFFAF3]/60 hover:text-[#FFFAF3] hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Route Sentry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sos')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'sos'
                      ? 'bg-[#1C1917] text-[#FFFAF3] border border-white/20 shadow-xs'
                      : 'text-[#FFFAF3]/60 hover:text-[#FFFAF3] hover:bg-white/5'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Silent Alert</span>
                </button>
              </div>

              {/* Dynamic Interactive Tab Content */}
              <div className="bg-black/40 rounded-2xl p-4 border border-white/10 mb-5 transition-all">
                {activeTab === 'havens' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-[#FFE5BF] font-mono">
                      <span>RADAR: 200M SURROUNDINGS</span>
                      <span className="text-[#22C55E]">VERIFIED SAFE SPOTS</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                        <div className="font-sans text-xs font-bold text-[#FFFAF3]">Apollo Pharmacy</div>
                        <div className="font-mono text-[10px] text-[#22C55E] mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                          <span>80m • Open 24/7</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                        <div className="font-sans text-xs font-bold text-[#FFFAF3]">HP Fuel Center</div>
                        <div className="font-mono text-[10px] text-[#22C55E] mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                          <span>140m • Well-Lit</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                        <div className="font-sans text-xs font-bold text-[#FFFAF3]">Police Outpost</div>
                        <div className="font-mono text-[10px] text-[#22C55E] mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                          <span>210m • Staffed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sentry' && (
                  <div className="text-left space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#FFE5BF] font-mono">
                      <span>ON-DEVICE ROUTE DEVIATION ENGINE</span>
                      <span className="text-[#22C55E]">ZERO FALSE ALARM</span>
                    </div>
                    <p className="font-sans text-xs text-[#FFFAF3]/80 leading-relaxed">
                      If an unexpected turn or prolonged pause is observed, SakhiShield quietly initiates an on-device check-in prompt before escalating or alerting guardians.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#22C55E] pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zero-Noise Algorithmic Verification Active</span>
                    </div>
                  </div>
                )}

                {activeTab === 'sos' && (
                  <div className="text-left space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#FFE5BF] font-mono">
                      <span>DISCREET EMERGENCY PROTOCOL</span>
                      <span className="text-[#F62440]">3x VOLUME PRESS</span>
                    </div>
                    <p className="font-sans text-xs text-[#FFFAF3]/80 leading-relaxed">
                      Triple-press the volume or power button without removing your phone from your pocket. Live encrypted coordinates and audio links are silently dispatched to your trusted circle.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#FFE5BF] pt-1">
                      <Zap className="w-3.5 h-3.5 text-[#F62440]" />
                      <span>Encrypted Dispatch Primed & Ready</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/walk-with-me"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F62440] hover:bg-[#D91F38] text-[#FFFAF3] text-xs font-mono font-bold tracking-wider uppercase rounded-full transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Launch Walk With Me</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F62440] hover:bg-[#D91F38] text-[#FFFAF3] text-xs font-mono font-bold tracking-wider uppercase rounded-full transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Start Protected Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <a
                  href="#walk-with-me"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-[#FFFAF3] text-xs font-mono font-medium tracking-wider uppercase rounded-full backdrop-blur-sm border border-white/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FFE5BF]" />
                  <span>Interactive Walk Demo</span>
                </a>
              </div>

            </div>
          </div>
        </ScrollExpand>
      </section>

      {/* ── 03. BOTTOM WAVY TRANSITION: Ink (#171515) to Cream (#FFF2DB) ── */}
      <div className="w-full overflow-hidden leading-none bg-[#171515] -mt-1 pointer-events-none z-10 relative">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-24 lg:h-32 text-[#FFF2DB]"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C320,110 720,10 1080,75 C1220,100 1360,50 1440,65 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default SafeCorridorExpand;
