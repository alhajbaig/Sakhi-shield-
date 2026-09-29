import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'emergency';
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  description,
  icon: Icon,
  variant = 'secondary',
  onClick,
  href,
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-[#1C1917] text-[#FFFAF3] hover:bg-[#333] border-[#1C1917]',
    secondary: 'bg-[#FFFAF3] text-[#1C1917] hover:bg-[#FFF2DB] border-[#1C1917]/20',
    emergency: 'bg-[#F62440] text-[#FFFAF3] hover:bg-[#d91d35] border-[#F62440]',
  };

  const content = (
    <div className="flex items-center gap-3 w-full">
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <div className="text-left flex-1">
        <div className="font-mono text-xs sm:text-sm font-bold tracking-wide">{label}</div>
        {description && <div className="text-[11px] opacity-80 mt-0.5 font-sans font-normal">{description}</div>}
      </div>
    </div>
  );

  const baseClasses = `p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};
