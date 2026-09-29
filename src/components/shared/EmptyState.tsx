import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon,
  className = '',
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-xl border border-dashed border-[#1C1917]/20 bg-[#FFF2DB]/40 text-center flex flex-col items-center justify-center ${className}`}>
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-[#1C1917]/5 flex items-center justify-center text-[#1C1917] mb-3">
          <Icon className="w-5 h-5 text-[#57534E]" />
        </div>
      )}
      <h4 className="font-serif text-lg text-[#1C1917] font-bold mb-1">
        {title}
      </h4>
      <p className="font-sans text-xs sm:text-sm text-[#57534E] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
