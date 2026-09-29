import React from 'react';

interface StatusBadgeProps {
  status: 'SAFE' | 'ATTENTION' | 'HIGH_RISK' | 'CRITICAL' | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const configs: Record<string, { dot: string; text: string; bg: string; border: string }> = {
    SAFE: {
      dot: 'bg-emerald-600',
      text: 'text-emerald-950 font-bold',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    ATTENTION: {
      dot: 'bg-amber-600',
      text: 'text-amber-950 font-bold',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    HIGH_RISK: {
      dot: 'bg-[#F62440]',
      text: 'text-[#F62440] font-bold',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    CRITICAL: {
      dot: 'bg-[#F62440]',
      text: 'text-white font-bold',
      bg: 'bg-[#F62440]',
      border: 'border-[#F62440]',
    },
  };

  const current = configs[status] || configs['SAFE'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.border} ${current.text} font-mono tracking-wide ${sizeClasses} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${current.dot}`} />
      <span>{status.replace('_', ' ')}</span>
    </span>
  );
};
