import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Navigation, Sparkles, LockKeyhole, UserRound } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Walk', href: '/walk-with-me', icon: Navigation },
    { label: 'Copilot', href: '/safety-copilot', icon: Sparkles },
    { label: 'Vault', href: '/incident-vault', icon: LockKeyhole },
    { label: 'Profile', href: '/profile', icon: UserRound },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFAF3] border-t border-[#1C1917]/15 py-2 px-3 flex items-center justify-around shadow-md select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-[#F62440] font-bold' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="font-sans text-[11px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
