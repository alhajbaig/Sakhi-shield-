import React from 'react';

interface AvatarProps {
  name: string;
  initials?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  status?: 'SAFE' | 'ATTENTION' | 'CRITICAL';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  initials = 'A',
  avatarUrl,
  size = 'md',
  showStatus = false,
  status = 'SAFE',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const statusColors = {
    SAFE: 'bg-emerald-600',
    ATTENTION: 'bg-[#D97706]',
    CRITICAL: 'bg-[#F62440]',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border border-[#1C1917]/15`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#1C1917] text-[#FFFAF3] font-mono font-bold flex items-center justify-center border border-[#1C1917]/20 select-none`}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColors[status]}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
