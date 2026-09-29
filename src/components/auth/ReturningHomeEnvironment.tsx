import React, { useState, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ReturningHomeEnvironmentProps {
  email?: string;
  activeField?: 'email' | 'password' | null;
  isSuccess?: boolean;
}

export const ReturningHomeEnvironment: React.FC<ReturningHomeEnvironmentProps> = ({
  email = '',
  activeField = null,
  isSuccess = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Parallax subtle shift (5-10px)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const yRatio = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      setMouseOffset({
        x: Math.max(-8, Math.min(8, xRatio * 6)),
        y: Math.max(-8, Math.min(8, yRatio * 6)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  const hasEmail = email.trim().length > 3;

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        }}
      >
        {/* Layer 1: Warm peach and cream sanctuary fields */}
        <div className="absolute inset-0">
          {/* Sanctuary glow around HOME */}
          <div
            className={`absolute top-[28%] left-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ${
              isSuccess
                ? 'w-[540px] h-[540px] bg-[#FFE5BF]/80 blur-3xl scale-110'
                : hasEmail
                ? 'w-[440px] h-[440px] bg-[#FFF2DB]/80 blur-2xl scale-100'
                : 'w-[380px] h-[380px] bg-[#FFF2DB]/60 blur-3xl scale-95'
            }`}
          />
          <div className="absolute bottom-[20%] left-[25%] w-[340px] h-[340px] rounded-full bg-[#FFE5BF]/25 blur-3xl" />
        </div>

        {/* Layer 2: Vector Journey System */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 850"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="homeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE5BF" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#FFF2DB" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFFAF3" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="returnRoute" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#171515" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#F62440" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#171515" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Architectural Background Grid & Coordinates */}
          <g className="font-mono text-[9px] fill-[#625B55]/50 tracking-widest">
            <line x1="120" y1="0" x2="120" y2="850" stroke="#171515" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 8" />
            <line x1="380" y1="0" x2="380" y2="850" stroke="#171515" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 8" />
            <line x1="0" y1="360" x2="1000" y2="360" stroke="#171515" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 8" />

            <text x="130" y="70">RETURN_PATH // ESTABLISHED_ENCLAVE</text>
            <text x="130" y="86">GUARDIAN_PEERS: 3 ACTIVE</text>
            <text x="390" y="780">SAFETY CORRIDOR: VERIFIED</text>
          </g>

          {/* Established Return Journey Line from commute towards HOME */}
          {/* Commute Origin: (160, 680), You: (280, 520), Home: (380, 260) */}
          <g className="transition-opacity duration-1000" opacity={hasEntered ? 1 : 0}>
            {/* The calm, established curved path */}
            <path
              d="M 160 680 C 200 620, 240 560, 280 500 C 330 420, 360 340, 380 260"
              stroke="#171515"
              strokeWidth="1.5"
              strokeOpacity="0.12"
              fill="none"
            />

            {/* Glowing return trail when email is recognized or active */}
            <path
              d="M 160 680 C 200 620, 240 560, 280 500 C 330 420, 360 340, 380 260"
              stroke="url(#returnRoute)"
              strokeWidth={hasEmail || isSuccess || activeField === 'email' ? '2.5' : '1.5'}
              strokeDasharray={isSuccess ? 'none' : '4 6'}
              fill="none"
              className="transition-all duration-700"
            />
          </g>

          {/* DESTINATION NODE: HOME (380, 260) */}
          <g
            className="transition-all duration-700"
            style={{
              transform: isSuccess ? 'scale(1.08)' : 'scale(1)',
              transformOrigin: '380px 260px',
            }}
          >
            {/* Glow Aura */}
            <circle cx="380" cy="260" r="80" fill="url(#homeGlow)" />
            <circle
              cx="380"
              cy="260"
              r="46"
              stroke={activeField === 'password' ? '#F62440' : '#171515'}
              strokeWidth={activeField === 'password' ? 1.5 : 1}
              strokeOpacity={activeField === 'password' ? 0.6 : 0.15}
              fill="none"
            />
            <circle cx="380" cy="260" r="16" fill="#171515" stroke="#FFFAF3" strokeWidth="2.5" />
            <circle cx="380" cy="260" r="4" fill="#FFFAF3" />

            <text x="380" y="218" textAnchor="middle" className="font-mono text-[9px] fill-[#625B55] tracking-widest uppercase">
              DESTINATION
            </text>
            <text x="380" y="234" textAnchor="middle" className="font-serif text-xl fill-[#171515] tracking-tight">
              HOME
            </text>
          </g>

          {/* THE TRAVELING HERO BEACON (YOU) */}
          {/* In default state: at (280, 500). When isSuccess is true: glides to (380, 260) */}
          <g
            className="transition-all duration-700 ease-in-out"
            style={{
              transform: isSuccess
                ? 'translate(100px, -240px)'
                : 'translate(0px, 0px)',
            }}
          >
            {/* Safety radius breathing aura */}
            <circle
              cx="280"
              cy="500"
              r="40"
              fill="#F62440"
              fillOpacity="0.12"
              className={prefersReducedMotion ? '' : 'animate-safety-radius'}
            />

            {/* Central node disc */}
            <circle
              cx="280"
              cy="500"
              r="18"
              fill="#171515"
              stroke="#FFFAF3"
              strokeWidth="2.5"
            />

            {/* RED HERO DOT */}
            <circle
              cx="280"
              cy="500"
              r="5"
              fill="#F62440"
              className={prefersReducedMotion ? '' : 'animate-heartbeat'}
            />

            {/* Node Label: YOU */}
            <text
              x="280"
              y="538"
              textAnchor="middle"
              className="font-mono text-[10px] font-bold fill-[#171515] tracking-widest uppercase"
            >
              YOU
            </text>
          </g>

          {/* SAKHI IS WITH YOU Pill Badge */}
          <g
            className="transition-all duration-700"
            opacity={hasEntered ? 1 : 0}
            transform="translate(180, 420)"
          >
            <rect
              x="0"
              y="0"
              width="200"
              height="28"
              rx="14"
              fill="#FFFAF3"
              stroke="#171515"
              strokeWidth="0.75"
              strokeOpacity="0.18"
              className="shadow-xs"
            />
            <circle cx="18" cy="14" r="2.5" fill="#F62440" className="animate-pulse" />
            <text
              x="108"
              y="18"
              textAnchor="middle"
              className="font-mono text-[9px] font-semibold fill-[#171515] tracking-widest uppercase"
            >
              {isSuccess
                ? 'ENTERING YOUR SPACE'
                : hasEmail
                ? 'WELCOME BACK'
                : 'SAKHI IS WITH YOU'}
            </text>
          </g>

          {/* Origin: DAILY COMMUTE (160, 680) */}
          <g opacity={hasEntered ? 1 : 0} className="transition-opacity duration-700">
            <circle cx="160" cy="680" r="5" fill="#FFFAF3" stroke="#171515" strokeWidth="1.25" strokeOpacity="0.4" />
            <circle cx="160" cy="680" r="1.5" fill="#171515" opacity="0.4" />
            <text x="160" y="704" textAnchor="middle" className="font-mono text-[9px] fill-[#625B55] tracking-wider uppercase">
              DAILY COMMUTE
            </text>
          </g>
        </svg>

        {/* Ambient Reassurance */}
        <div className="absolute bottom-8 left-10 hidden xl:flex items-center gap-6 font-mono text-[10px] text-[#625B55]/60 tracking-widest uppercase">
          <div>RETURNING TO YOUR PRIVATE SPACE</div>
          <div>•</div>
          <div>ALL SYSTEMS ENCRYPTED</div>
        </div>
      </div>
    </div>
  );
};
