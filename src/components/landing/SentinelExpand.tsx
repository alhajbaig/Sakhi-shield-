import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Lock, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { ScrollExpand } from '../ui/ScrollExpand';
import { TechText } from '../ui/TechText';
import { useAuth } from '../../lib/AuthContext';

export const SentinelExpand: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative select-none" id="sentinel-showcase">
      {/* ── TOP WAVE TRANSITION: Ivory → Deep Obsidian ── */}
      <div className="w-full overflow-hidden leading-none bg-[#FFFAF3] -mb-1 pointer-events-none z-10 relative">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-24 lg:h-32 text-[#08080A]"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C320,110 720,10 1080,75 C1240,100 1360,50 1440,60 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── EXPANDING STAGE ── */}
      <section className="relative bg-[#08080A] text-[#F8F6F1]" aria-label="Sakhi Sentinel System">
        <ScrollExpand
          useWindowScroll
          startWidth={56}
          startHeight={62}
          startRadius={32}
          endRadius={0}
          scrollDistance={1.3}
          holdDistance={0.4}
          smoothing={0.12}
          overlayScrim={0.55}
          customMedia={
            <div className="relative w-full h-full bg-[#08080A] overflow-hidden">
              {/* ── Deep Midnight Indigo & Cool Ambient Atmosphere ── */}
              <div className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#1a1540]/60 blur-[180px] pointer-events-none" />
              <div className="absolute top-[20%] right-[20%] w-[550px] h-[550px] rounded-full bg-[#0f2847]/50 blur-[160px] pointer-events-none" />
              <div className="absolute bottom-[25%] left-[30%] w-[450px] h-[450px] rounded-full bg-[#1e1338]/40 blur-[140px] pointer-events-none" />
              {/* Warm golden kiss — very subtle */}
              <div className="absolute top-[55%] right-[35%] w-[300px] h-[300px] rounded-full bg-[#C9A84C]/6 blur-[120px] pointer-events-none" />

              {/* ── Refined Geometric Grid (hairline, barely visible) ── */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="sentinel-grid-v2" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#a0a0b0" strokeWidth="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#sentinel-grid-v2)" />
                </svg>
              </div>

              {/* ── Soft Orbital Rings (no radar, just elegance) ── */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                <div className="relative w-[650px] h-[650px] flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#a0a0c0]/40 animate-[spin_180s_linear_infinite]" />
                  <div className="absolute inset-[18%] rounded-full border border-dashed border-[#a0a0c0]/25" />
                  <div className="absolute inset-[38%] rounded-full border border-[#a0a0c0]/20" />
                </div>
              </div>
            </div>
          }
          title={
            <div className="flex flex-col items-center justify-center text-center px-4 max-w-2xl select-none">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[11px] tracking-[0.18em] text-[#F8F6F1]/90 uppercase mb-5 shadow-xl" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A84C]" />
                </span>
                <span className="font-medium">SAKHI SAATHI &middot; AUTONOMOUS SENTINEL</span>
              </div>

              {/* Headline — clean serif */}
              <h2 className="text-3xl sm:text-5xl lg:text-[3.6rem] text-[#F8F6F1] leading-[1.08] tracking-[-0.025em] drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Proactive intelligence.<br />
                <span className="italic text-[#C9A84C]/90 font-normal">Before the emergency.</span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#F8F6F1]/65 mt-4 max-w-md font-light leading-relaxed" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
                Continuous spatial awareness, verified safe havens, and zero-panic automated check-in verification.
              </p>

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-[10px] text-[#F8F6F1]/40 tracking-[0.14em]" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                <span>SHA-256 VERIFIED</span>
                <span className="text-[#C9A84C]/50">&bull;</span>
                <span>ZERO-KNOWLEDGE AES-256</span>
                <span className="text-[#C9A84C]/50">&bull;</span>
                <span>LATENCY &lt; 50MS</span>
              </div>
            </div>
          }
          scrollHint={
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/8 text-xs tracking-[0.16em] text-[#F8F6F1]/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              <span>SCROLL TO REVEAL</span>
              <span className="animate-bounce text-[#C9A84C]/70">↓</span>
            </div>
          }
        >
          {/* ══════════ EXPANDED FULL-BLEED REVEAL ══════════ */}
          <div className="relative w-full max-w-[1100px] mx-auto flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-6 sm:py-10 text-center select-none z-20">
            
            {/* ── Top Status Bar ── */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-2xl mb-5 sm:mb-7" style={{ fontFamily: "'Space Grotesk', monospace" }}>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.14em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-semibold text-[#F8F6F1] tracking-widest">SENTINEL ONLINE</span>
              </div>

              <div className="hidden md:flex items-center gap-4 text-[10px] text-[#F8F6F1]/45 tracking-wider">
                <span>CORRIDORS 2,840+</span>
                <span className="text-[#C9A84C]/40">&bull;</span>
                <span>HAVENS 14,290</span>
                <span className="text-[#C9A84C]/40">&bull;</span>
                <span>38MS LATENCY</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#C9A84C]/80 tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>

            {/* ── TechText Wordmark Centerpiece ── */}
            <div className="w-full h-[130px] sm:h-[170px] md:h-[210px] relative my-1 sm:my-2">
              <TechText
                text="SakhiShield"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight={700}
                fontSize={150}
                letterSpacing={-0.03}
                color="#F8F6F1"
                accentColor="#C9A84C"
                reveal="letter"
                reach={200}
                softness={0.7}
                dashLength={4}
                dashGap={2}
                strokeWidth={1.5}
                specks={18}
                selection={true}
                labels={true}
                draggable={true}
                sweep={true}
                speed={1}
              />
            </div>

            {/* Interactive hint */}
            <p className="text-[10px] tracking-[0.16em] text-[#F8F6F1]/30 uppercase mb-6 sm:mb-8" style={{ fontFamily: "'Space Grotesk', monospace" }}>
              Interactive vector telemetry &middot; hover or drag glyphs
            </p>

            {/* ── 3 Architecture Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left mb-7 sm:mb-9">
              
              {/* Card 1 — Safe Corridors */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] hover:border-[#C9A84C]/30 transition-all duration-500 group">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-[#C9A84C]/15 transition-all duration-300">
                  <Navigation className="w-4.5 h-4.5 text-[#C9A84C]" />
                </div>
                <h3 className="font-semibold text-[15px] text-[#F8F6F1] mb-1.5 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Safe Corridors
                </h3>
                <p className="text-[13px] text-[#F8F6F1]/50 leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Dynamic routing through verified 24/7 lit zones, active fuel stations, and police outposts.
                </p>
                <div className="mt-4 text-[9px] text-[#C9A84C]/50 tracking-[0.18em] font-medium" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  200M RADIUS
                </div>
              </div>

              {/* Card 2 — Silent Sentry */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] hover:border-indigo-400/25 transition-all duration-500 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-indigo-500/15 transition-all duration-300">
                  <Eye className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-[15px] text-[#F8F6F1] mb-1.5 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Silent Sentry
                </h3>
                <p className="text-[13px] text-[#F8F6F1]/50 leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Zero-panic automated check-in verification. Escalates quietly to your trusted circle on deviation.
                </p>
                <div className="mt-4 text-[9px] text-indigo-400/50 tracking-[0.18em] font-medium" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  AUTONOMOUS
                </div>
              </div>

              {/* Card 3 — Evidence Vault */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] hover:border-emerald-400/25 transition-all duration-500 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-emerald-500/15 transition-all duration-300">
                  <Lock className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-[15px] text-[#F8F6F1] mb-1.5 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Evidence Vault
                </h3>
                <p className="text-[13px] text-[#F8F6F1]/50 leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Client-side zero-knowledge encrypted logging with cryptographic timestamping for legal evidence.
                </p>
                <div className="mt-4 text-[9px] text-emerald-400/50 tracking-[0.18em] font-medium" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  SHA-256 PROOF
                </div>
              </div>

            </div>

            {/* ── CTAs ── */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/auth'}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#F8F6F1] hover:bg-white text-[#08080A] text-sm font-semibold rounded-full shadow-lg shadow-white/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#safety-loop"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-[#F8F6F1]/80 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                <span>Explore Architecture</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]/70" />
              </a>
            </div>

          </div>
        </ScrollExpand>
      </section>

      {/* ── BOTTOM WAVE TRANSITION: Obsidian → Cream ── */}
      <div className="w-full overflow-hidden leading-none bg-[#08080A] -mt-1 pointer-events-none z-10 relative">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-24 text-[#FFF2DB]/60"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C360,110 720,20 1080,80 C1220,105 1360,55 1440,65 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default SentinelExpand;
