import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CircleHelp, AlertOctagon, Menu } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { Avatar } from '../shared/Avatar';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  title,
  subtitle,
}) => {
  const { user, triggerSOS, cancelSOS, sosActive } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayTitle = title || `${getGreeting()}, ${user.name}`;
  const displaySubtitle = subtitle || 'Your sovereign safety overview';

  return (
    <header className="h-16 md:h-18 bg-[#FFFAF3]/95 backdrop-blur-md border-b border-[#1C1917]/10 px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* Left: Mobile Menu Trigger + Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-[#1C1917] hover:bg-[#1C1917]/10 rounded-lg cursor-pointer transition-colors"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg sm:text-xl md:text-2xl text-[#1C1917] font-bold leading-tight">
              {displayTitle}
            </h1>
            {sosActive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F62440] text-white border border-red-600 shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>EMERGENCY SOS ACTIVE</span>
              </span>
            ) : user.activeJourney ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100/90 text-amber-900 border border-amber-300 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                <span>WALK IN PROGRESS • {user.activeJourney.destination}</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>SAB THEEK HAI</span>
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-[#57534E] hidden sm:block">
            {displaySubtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick actions & Profile avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Quick Emergency SOS Button (Always reachable) */}
        {sosActive ? (
          <button
            type="button"
            onClick={cancelSOS}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1917] text-[#FFFAF3] border border-[#F62440] rounded-lg text-xs font-mono font-bold hover:bg-[#F62440] transition-colors cursor-pointer shadow-xs animate-pulse"
            title="Cancel Emergency SOS (Stand Down)"
          >
            <AlertOctagon className="w-4 h-4 text-[#F62440]" />
            <span className="inline">CANCEL SOS</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={triggerSOS}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F62440] text-[#FFFAF3] rounded-lg text-xs font-mono font-bold hover:bg-[#d91d35] transition-colors cursor-pointer shadow-xs"
            title="Trigger Emergency SOS"
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        )}

        {/* Notifications Icon with dot */}
        <button
          type="button"
          className="relative p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFF2DB] rounded-lg transition-colors cursor-pointer"
          title="Notifications"
          onClick={() => alert('All systems normal. 0 unread alerts.')}
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 border border-white" />
        </button>

        {/* Help Link */}
        <Link
          to="/help"
          className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFF2DB] rounded-lg transition-colors cursor-pointer hidden sm:block"
          title="Safety FAQ & Help"
        >
          <CircleHelp className="w-5 h-5" />
        </Link>

        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 border-l border-[#1C1917]/15 hover:opacity-90 transition-opacity cursor-pointer"
          title="Go to Profile"
        >
          <Avatar
            name={user.name}
            initials={user.initials}
            size="sm"
            showStatus
            status={user.status === 'SAFE' ? 'SAFE' : 'CRITICAL'}
          />
        </Link>

      </div>

    </header>
  );
};
