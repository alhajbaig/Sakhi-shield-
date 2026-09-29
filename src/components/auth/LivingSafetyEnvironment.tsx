import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LivingSafetyEnvironmentProps {
  activeField?: 'name' | 'email' | 'phone' | 'password' | 'confirmPassword' | null;
  enteredName?: string;
  isPasswordConfirmed?: boolean;
  isSuccess?: boolean;
}

export const LivingSafetyEnvironment: React.FC<LivingSafetyEnvironmentProps> = ({
  activeField,
  enteredName = '',
  isPasswordConfirmed = false,
  isSuccess = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [hasAssembled, setHasAssembled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Entrance "Assembling Your Space" sequence (approx 1.5 - 2s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAssembled(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Subtle mouse movement parallax on desktop (5-12px)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const yRatio = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      setMouseOffset({
        x: Math.max(-10, Math.min(10, xRatio * 8)),
        y: Math.max(-10, Math.min(10, yRatio * 8)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Derive dynamic label for the center anchor
  const displayName = enteredName.trim()
    ? enteredName.trim().split(' ')[0].toUpperCase()
    : 'YOU';

  // Dynamic context message based on field focus
  const getContextMessage = () => {
    if (isSuccess) return 'SAKHI IS WITH YOU';
    if (isPasswordConfirmed) return 'SPACE READY';
    if (activeField === 'name') return enteredName.trim() ? `Nice to meet you, ${enteredName.trim().split(' ')[0]}` : 'Nice to meet you.';
    if (activeField === 'email') return 'YOUR SPACE';
    if (activeField === 'password') return 'PRIVATE SPACE';
    if (activeField === 'confirmPassword') return 'SEALING SAFE PERIMETER';
    if (activeField === 'phone') return 'GUARDIAN CHANNEL';
    return 'SAFE SPACE ACTIVE';
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Dynamic Parallax Container */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        }}
      >
        {/* Layer 1: Soft Peach & Cream Ambient Geometric Fields */}
        <div className="absolute inset-0">
          {/* Central Safety Aura */}
          <div
            className={`absolute top-1/2 left-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ${
              isPasswordConfirmed || isSuccess
                ? 'w-[520px] h-[520px] bg-[#FFE5BF]/70 blur-3xl scale-105'
                : activeField
                ? 'w-[460px] h-[460px] bg-[#FFF2DB]/80 blur-2xl scale-100'
                : 'w-[400px] h-[400px] bg-[#FFF2DB]/60 blur-3xl scale-95'
            }`}
          />

          {/* Secondary atmospheric contour field */}
          <div className="absolute top-[18%] left-[20%] w-[380px] h-[380px] rounded-full bg-[#FFE5BF]/30 blur-3xl" />
          <div className="absolute bottom-[12%] left-[45%] w-[420px] h-[420px] rounded-full bg-[#FFF2DB]/50 blur-3xl" />
        </div>

        {/* Layer 2: Main Vector Journey System (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 850"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Subtle radial gradients */}
            <radialGradient id="safetyAuraGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE5BF" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#FFF2DB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFAF3" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#171515" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#171515" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#171515" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="activeRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F62440" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#F62440" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#171515" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Subtle Abstract Geographic Contours */}
          <g className="transition-opacity duration-1000" opacity={hasAssembled ? '0.75' : '0'}>
            <path
              d="M -50 220 C 150 180, 280 290, 480 240 C 680 190, 820 280, 1050 210"
              stroke="#171515"
              strokeWidth="0.75"
              strokeOpacity="0.08"
              fill="none"
            />
            <path
              d="M -50 380 C 180 340, 310 460, 520 400 C 730 340, 850 440, 1050 370"
              stroke="#171515"
              strokeWidth="0.75"
              strokeOpacity="0.06"
              fill="none"
            />
            <path
              d="M -50 560 C 140 510, 260 620, 490 570 C 720 520, 830 630, 1050 560"
              stroke="#171515"
              strokeWidth="0.75"
              strokeOpacity="0.07"
              fill="none"
            />
          </g>

          {/* Architectural Coordinate Lines & Faint System Marks */}
          <g className="font-mono text-[9px] fill-[#625B55]/50 tracking-widest select-none">
            <line x1="80" y1="0" x2="80" y2="850" stroke="#171515" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 8" />
            <line x1="380" y1="0" x2="380" y2="850" stroke="#171515" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 8" />
            <line x1="0" y1="420" x2="1000" y2="420" stroke="#171515" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 8" />

            <text x="90" y="70">LAT 28°36'N  LON 77°12'E</text>
            <text x="90" y="86">PERIMETER_ENCRYPTED // SHA-256</text>
            <text x="390" y="790">SACRED RADIUS: 400M ACTIVE</text>
            <text x="390" y="806">CONTINUOUS_COMPANION_v2</text>
          </g>

          {/* Dynamic Living Route: weaving through the space */}
          <g className="transition-all duration-700">
            {/* Base living route curve */}
            <path
              d="M 60 140 Q 220 200, 380 420 T 780 720"
              stroke="url(#routeGrad)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray={hasAssembled ? 'none' : '6 6'}
              className="transition-all duration-1000"
            />

            {/* Active illuminated path on user interaction */}
            {(activeField || isPasswordConfirmed || isSuccess) && (
              <path
                d="M 60 140 Q 220 200, 380 420 T 780 720"
                stroke="url(#activeRouteGrad)"
                strokeWidth="2"
                fill="none"
                className="transition-all duration-700"
              />
            )}
          </g>

          {/* Center Coordinates: Center Hero is at (380, 420) */}

          {/* Safety Field: Peach Protective Aura Disc */}
          <circle
            cx="380"
            cy="420"
            r={isPasswordConfirmed || isSuccess ? 180 : activeField ? 150 : 125}
            fill="url(#safetyAuraGrad)"
            className="transition-all duration-700 ease-out"
          />

          {/* Concentric Thin Orbit Geometry */}
          <g className="transition-all duration-700">
            {/* Outer Protective Perimeter */}
            <circle
              cx="380"
              cy="420"
              r={isPasswordConfirmed ? 160 : 145}
              stroke="#171515"
              strokeWidth={isPasswordConfirmed ? '1.5' : '1'}
              strokeOpacity={isPasswordConfirmed ? '0.35' : '0.12'}
              strokeDasharray={isPasswordConfirmed ? 'none' : '4 6'}
              fill="none"
              className="transition-all duration-700"
            />

            {/* Inner Intimate Orbit */}
            <circle
              cx="380"
              cy="420"
              r="75"
              stroke={activeField === 'password' || isPasswordConfirmed ? '#F62440' : '#171515'}
              strokeWidth={activeField === 'password' || isPasswordConfirmed ? '1.5' : '0.75'}
              strokeOpacity={activeField === 'password' || isPasswordConfirmed ? '0.5' : '0.15'}
              fill="none"
              className="transition-all duration-500"
            />
          </g>

          {/* Dynamic Connection Threads to Surrounding Nodes */}
          {/* Thread 1: To Trusted Circle (Top Left: 190, 240) */}
          <path
            d="M 380 420 Q 270 330, 190 240"
            stroke={activeField === 'phone' ? '#F62440' : '#171515'}
            strokeWidth={activeField === 'phone' ? 2 : 1}
            strokeOpacity={activeField === 'phone' ? 0.7 : 0.18}
            strokeDasharray={activeField === 'phone' ? 'none' : '3 4'}
            fill="none"
            className="transition-all duration-500"
          />

          {/* Thread 2: To Walk With Me (Top Right: 560, 250) */}
          <path
            d="M 380 420 Q 480 320, 560 250"
            stroke={activeField === 'name' ? '#F62440' : '#171515'}
            strokeWidth={activeField === 'name' ? 2 : 1}
            strokeOpacity={activeField === 'name' ? 0.7 : 0.18}
            strokeDasharray={activeField === 'name' ? 'none' : '3 4'}
            fill="none"
            className="transition-all duration-500"
          />

          {/* Thread 3: To Safety Copilot / Decisions (Bottom Left: 180, 590) */}
          <path
            d="M 380 420 Q 260 520, 180 590"
            stroke={activeField === 'email' ? '#F62440' : '#171515'}
            strokeWidth={activeField === 'email' ? 2 : 1}
            strokeOpacity={activeField === 'email' ? 0.7 : 0.18}
            strokeDasharray={activeField === 'email' ? 'none' : '3 4'}
            fill="none"
            className="transition-all duration-500"
          />

          {/* Thread 4: To Private Story Vault (Bottom Right: 570, 580) */}
          <path
            d="M 380 420 Q 490 510, 570 580"
            stroke={activeField === 'password' || isPasswordConfirmed ? '#F62440' : '#171515'}
            strokeWidth={activeField === 'password' || isPasswordConfirmed ? 2 : 1}
            strokeOpacity={activeField === 'password' || isPasswordConfirmed ? 0.7 : 0.18}
            strokeDasharray={activeField === 'password' || isPasswordConfirmed ? 'none' : '3 4'}
            fill="none"
            className="transition-all duration-500"
          />

          {/* SATELLITE NODES (Refined delicate geometric anchors, NOT heavy cards) */}
          {/* Node 1: TRUSTED CIRCLE */}
          <g
            className="transition-transform duration-500 cursor-default"
            style={{
              transform: activeField === 'phone' ? 'scale(1.08)' : 'scale(1)',
              transformOrigin: '190px 240px',
            }}
          >
            <circle
              cx="190"
              cy="240"
              r="6"
              fill={activeField === 'phone' ? '#FFE5BF' : '#FFFAF3'}
              stroke={activeField === 'phone' ? '#F62440' : '#171515'}
              strokeWidth="1.5"
            />
            <circle cx="190" cy="240" r="2" fill={activeField === 'phone' ? '#F62440' : '#171515'} />
            <text x="190" y="218" textAnchor="middle" className="font-mono text-[9px] fill-[#625B55] tracking-widest uppercase">
              YOUR PEOPLE
            </text>
            <text x="190" y="260" textAnchor="middle" className="font-sans text-[11px] font-semibold fill-[#171515] tracking-tight">
              Trusted Circle
            </text>
          </g>

          {/* Node 2: WALK WITH ME */}
          <g
            className="transition-transform duration-500 cursor-default"
            style={{
              transform: activeField === 'name' ? 'scale(1.08)' : 'scale(1)',
              transformOrigin: '560px 250px',
            }}
          >
            <circle
              cx="560"
              cy="250"
              r="6"
              fill={activeField === 'name' ? '#FFE5BF' : '#FFFAF3'}
              stroke={activeField === 'name' ? '#F62440' : '#171515'}
              strokeWidth="1.5"
            />
            <circle cx="560" cy="250" r="2" fill={activeField === 'name' ? '#F62440' : '#171515'} />
            <text x="560" y="228" textAnchor="middle" className="font-mono text-[9px] fill-[#625B55] tracking-widest uppercase">
              YOUR JOURNEY
            </text>
            <text x="560" y="270" textAnchor="middle" className="font-sans text-[11px] font-semibold fill-[#171515] tracking-tight">
              Walk With Me
            </text>
          </g>

          {/* Node 3: SAFETY COPILOT */}
          <g
            className="transition-transform duration-500 cursor-default"
            style={{
              transform: activeField === 'email' ? 'scale(1.08)' : 'scale(1)',
              transformOrigin: '180px 590px',
            }}
          >
            <circle
              cx="180"
              cy="590"
              r="6"
              fill={activeField === 'email' ? '#FFE5BF' : '#FFFAF3'}
              stroke={activeField === 'email' ? '#F62440' : '#171515'}
              strokeWidth="1.5"
            />
            <circle cx="180" cy="590" r="2" fill={activeField === 'email' ? '#F62440' : '#171515'} />
            <text x="180" y="570" textAnchor="middle" className="font-mono text-[9px] fill-[#625B55] tracking-widest uppercase">
              YOUR SPACE
            </text>
            <text x="180" y="610" textAnchor="middle" className="font-sans text-[11px] font-semibold fill-[#171515] tracking-tight">
              Safety Copilot
            </text>
          </g>

          {/* Node 4: INCIDENT VAULT */}
          <g
            className="transition-transform duration-500 cursor-default"
            style={{
              transform: activeField === 'password' || isPasswordConfirmed ? 'scale(1.08)' : 'scale(1)',
              transformOrigin: '570px 580px',
            }}
          >
            <circle
              cx="570"
              cy="580"
              r="6"
              fill={activeField === 'password' || isPasswordConfirmed ? '#FFE5BF' : '#FFFAF3'}
              stroke={activeField === 'password' || isPasswordConfirmed ? '#F62440' : '#171515'}
              strokeWidth="1.5"
            />
            <circle cx="570" cy="580" r="2" fill={activeField === 'password' || isPasswordConfirmed ? '#F62440' : '#171515'} />
            <text x="570" y="560" textAnchor="middle" className="font-mono text-[9px] fill-[#625B55] tracking-widest uppercase">
              PRIVATE ENCLAVE
            </text>
            <text x="570" y="600" textAnchor="middle" className="font-sans text-[11px] font-semibold fill-[#171515] tracking-tight">
              Incident Vault
            </text>
          </g>

          {/* ======================================================== */}
          {/* THE HERO RED POINT & CENTRAL SAFETY SANCTUARY AT (380, 420) */}
          {/* ======================================================== */}
          
          {/* Outer Breathing Pulse Halo */}
          <circle
            cx="380"
            cy="420"
            r="44"
            fill="#F62440"
            fillOpacity="0.12"
            className={prefersReducedMotion ? '' : 'animate-safety-radius'}
          />

          {/* Center User Disc */}
          <circle
            cx="380"
            cy="420"
            r="20"
            fill="#171515"
            stroke="#FFFAF3"
            strokeWidth="3"
            className="shadow-md"
          />

          {/* THE RED HERO DOT: SakhiShield's Heart */}
          <circle
            cx="380"
            cy="420"
            r="5.5"
            fill="#F62440"
            className={prefersReducedMotion ? '' : 'animate-heartbeat'}
          />

          {/* Dynamic Responsive Center Label: YOU or typed name */}
          <text
            x="380"
            y="464"
            textAnchor="middle"
            className="font-mono text-[11px] font-bold fill-[#171515] tracking-[0.2em] uppercase select-none transition-all duration-300"
          >
            {displayName}
          </text>

          {/* Dynamic Emotional Pill Badge above the center point */}
          <g className="transition-all duration-500">
            <rect
              x="280"
              y="342"
              width="200"
              height="26"
              rx="13"
              fill="#FFFAF3"
              stroke="#171515"
              strokeWidth="0.75"
              strokeOpacity="0.15"
              className="shadow-xs"
            />
            <circle
              cx="296"
              cy="355"
              r="2.5"
              fill={isPasswordConfirmed || isSuccess ? '#059669' : '#F62440'}
              className="animate-pulse"
            />
            <text
              x="386"
              y="359"
              textAnchor="middle"
              className="font-mono text-[9px] font-semibold fill-[#171515] tracking-widest uppercase select-none"
            >
              {getContextMessage()}
            </text>
          </g>
        </svg>

        {/* Ambient Subtle Compass and Journey Data in bottom-left */}
        <div className="absolute bottom-8 left-10 hidden xl:flex items-center gap-6 font-mono text-[10px] text-[#625B55]/60 tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#171515]/30" />
            <span>ENCRYPTED PROTOCOL</span>
          </div>
          <div>•</div>
          <div>ZERO PERSISTENT TRACKING</div>
          <div>•</div>
          <div>SAFE SPACE SANCTUARY</div>
        </div>
      </div>
    </div>
  );
};
