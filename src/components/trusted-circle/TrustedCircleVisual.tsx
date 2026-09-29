// SakhiShield — Trusted Circle Visual Component (Sections 70, 72)
// Radial protective network graph: Central 'YOU' node connected to trusted circle members with live telemetry

import React from 'react';
import type { TrustedCircleMember, TrustedCircleAlert } from '../../types/trustedCircle';

interface TrustedCircleVisualProps {
  currentUserName: string;
  members: TrustedCircleMember[];
  activeAlert?: TrustedCircleAlert | null;
  className?: string;
}

export const TrustedCircleVisual: React.FC<TrustedCircleVisualProps> = ({
  currentUserName,
  members,
  activeAlert,
  className = '',
}) => {
  const isAlertActive = Boolean(activeAlert && activeAlert.status !== 'RESOLVED');

  // SVG viewBox center
  const cx = 200;
  const cy = 200;
  const radius = 130;

  // Layout members along a radial perimeter
  const memberNodes = members.map((member, idx) => {
    const total = Math.max(1, members.length);
    const angle = (idx * 2 * Math.PI) / total - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    // Check member's alert status if alert is active
    const recip = activeAlert?.recipients?.find((r) => r.user_id === member.user_id);
    const isAcked = recip?.status === 'ACKNOWLEDGED';
    const isSeen = recip?.status === 'SEEN';

    return {
      ...member,
      x,
      y,
      isAcked,
      isSeen,
    };
  });

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-[420px] aspect-square overflow-visible drop-shadow-sm"
      >
        <defs>
          {/* Subtle radial background gradient */}
          <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={isAlertActive ? '#F62440' : '#FFE5BF'}
              stopOpacity={isAlertActive ? '0.15' : '0.4'}
            />
            <stop
              offset="100%"
              stopColor={isAlertActive ? '#F62440' : '#FFF2DB'}
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* Ambient Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="url(#circleGlow)"
          stroke={isAlertActive ? '#F62440' : '#171515'}
          strokeWidth="1.5"
          strokeDasharray={isAlertActive ? '4 4' : '3 6'}
          strokeOpacity={isAlertActive ? '0.6' : '0.2'}
          className={isAlertActive ? 'animate-spin-slow' : ''}
        />

        {/* Inner Safety Perimeter */}
        <circle
          cx={cx}
          cy={cy}
          r={radius * 0.55}
          fill="none"
          stroke={isAlertActive ? '#F62440' : '#171515'}
          strokeWidth="1"
          strokeOpacity={isAlertActive ? '0.3' : '0.1'}
        />

        {/* Connection Lines from Center to Members */}
        {memberNodes.map((node) => (
          <line
            key={`line-${node.id}`}
            x1={cx}
            y1={cy}
            x2={node.x}
            y2={node.y}
            stroke={
              isAlertActive
                ? node.isAcked
                  ? '#059669' // Emerald for acknowledged
                  : '#F62440' // Red for waiting
                : '#171515'
            }
            strokeWidth={isAlertActive ? (node.isAcked ? '2.5' : '2') : '1.5'}
            strokeOpacity={isAlertActive ? '0.75' : '0.2'}
            strokeDasharray={isAlertActive && !node.isAcked ? '4 3' : undefined}
          />
        ))}

        {/* Center Node: YOU */}
        <g transform={`translate(${cx}, ${cy})`}>
          {isAlertActive && (
            <circle
              r="40"
              fill="#F62440"
              opacity="0.25"
              className="animate-ping"
            />
          )}

          <circle
            r="32"
            fill={isAlertActive ? '#F62440' : '#171515'}
            stroke="#FFFAF3"
            strokeWidth="3.5"
            className="shadow-md"
          />

          <text
            textAnchor="middle"
            dy="-4"
            fill="#FFFAF3"
            fontSize="12"
            fontFamily="Space Grotesk, monospace"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            YOU
          </text>
          <text
            textAnchor="middle"
            dy="12"
            fill="#FFE5BF"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="600"
          >
            {isAlertActive ? 'ALERT' : currentUserName.split(' ')[0]}
          </text>
        </g>

        {/* Member Nodes */}
        {memberNodes.map((node) => {
          const initials = (node.user_name || 'Member')
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          let nodeFill = '#FFFAF3';
          let nodeStroke = '#171515';
          let statusText = node.role === 'OWNER' ? 'Owner' : 'Guardian';

          if (isAlertActive) {
            if (node.isAcked) {
              nodeFill = '#ECFDF5';
              nodeStroke = '#059669';
              statusText = 'ACKNOWLEDGED';
            } else if (node.isSeen) {
              nodeFill = '#EFF6FF';
              nodeStroke = '#2563EB';
              statusText = 'SEEN';
            } else {
              nodeFill = '#FEF2F2';
              nodeStroke = '#F62440';
              statusText = 'NOTIFIED';
            }
          }

          return (
            <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
              {/* Outer halo */}
              <circle
                r="25"
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth={isAlertActive ? '2.5' : '1.5'}
                className="shadow-sm transition-all"
              />

              {/* Initials */}
              <text
                textAnchor="middle"
                dy="4"
                fill="#171515"
                fontSize="11"
                fontFamily="Space Grotesk, monospace"
                fontWeight="bold"
              >
                {initials}
              </text>

              {/* Status indicator dot */}
              <circle
                cx="16"
                cy="-16"
                r="4.5"
                fill={
                  isAlertActive
                    ? node.isAcked
                      ? '#059669'
                      : '#F62440'
                    : node.is_online
                    ? '#059669'
                    : '#78716C'
                }
                stroke="#FFFAF3"
                strokeWidth="1.5"
              />

              {/* Member Name Label beneath node */}
              <text
                textAnchor="middle"
                dy="38"
                fill="#171515"
                fontSize="11"
                fontFamily="Manrope, sans-serif"
                fontWeight="bold"
              >
                {(node.user_name || 'Member').split(' ')[0]}
              </text>

              <text
                textAnchor="middle"
                dy="48"
                fill={isAlertActive && node.isAcked ? '#059669' : '#78716C'}
                fontSize="8"
                fontFamily="Space Grotesk, monospace"
                fontWeight="600"
                letterSpacing="0.04em"
              >
                {statusText}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
