import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  actionHref,
  onActionClick,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 mb-4 border-b border-[#1C1917]/10 gap-2 ${className}`}>
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
          {title}
        </h3>
        {subtitle && (
          <p className="font-sans text-xs text-[#57534E] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && (
        actionHref ? (
          <a
            href={actionHref}
            className="font-mono text-xs font-bold text-[#1C1917] hover:text-[#F62440] transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{actionText}</span>
            <span>→</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onActionClick}
            className="font-mono text-xs font-bold text-[#1C1917] hover:text-[#F62440] transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{actionText}</span>
            <span>→</span>
          </button>
        )
      )}
    </div>
  );
};
