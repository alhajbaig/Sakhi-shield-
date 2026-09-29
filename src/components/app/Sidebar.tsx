import React, { useLayoutEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Navigation,
  Sparkles,
  ShieldCheck,
  LockKeyhole,
  Users,
  Clock3,
  UserRound,
  Shield,
  Settings,
  CircleHelp,
  ChevronRight,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';
import { gsap } from 'gsap';
import { useApp } from '../../lib/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { Avatar } from '../shared/Avatar';
import './Sidebar.css';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

interface NavItemDef {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  num: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLElement>(null);

  const handleSignOut = async () => {
    await logout();
    onNavigate?.();
    navigate('/', { replace: true });
  };

  const mainNav: NavItemDef[] = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, num: '01' },
    { label: 'Walk With Me', href: '/walk-with-me', icon: Navigation, num: '02' },
    { label: 'Safety Copilot', href: '/safety-copilot', icon: Sparkles, num: '03' },
    { label: 'Digital Safety', href: '/digital-safety', icon: ShieldCheck, num: '04' },
    { label: 'Incident Vault', href: '/incident-vault', icon: LockKeyhole, num: '05' },
  ];

  const safetyNav: NavItemDef[] = [
    { label: 'Trusted Circle', href: '/trusted-circle', icon: Users, num: '06' },
    { label: 'Safety History', href: '/safety-history', icon: Clock3, num: '07' },
  ];

  const accountNav: NavItemDef[] = [
    { label: 'Profile', href: '/profile', icon: UserRound, num: '08' },
    { label: 'Privacy & Security', href: '/privacy-settings', icon: Shield, num: '09' },
    { label: 'Settings', href: '/settings', icon: Settings, num: '10' },
  ];

  // GSAP Staggered Entrance (Directly adapted from React Bits StaggeredMenu)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance for headers
      gsap.fromTo(
        '.sm-stagger-title',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }
      );

      // Masked roll-up for navigation items (signature React Bits Staggered entrance)
      gsap.fromTo(
        '.sm-stagger-label',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: 'power4.out', delay: 0.05 }
      );

      // Micro bounce entrance for icons
      gsap.fromTo(
        '.sm-stagger-icon',
        { scale: 0.65, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, stagger: 0.03, ease: 'back.out(1.7)', delay: 0.05 }
      );
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  const renderNavItem = (item: NavItemDef) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;

    return (
      <div key={item.href} className="sm-item-wrap">
        <Link
          to={item.href}
          onClick={onNavigate}
          className={`sm-nav-item ${isActive ? 'is-active' : ''}`}
          aria-current={isActive ? 'page' : undefined}
        >
          {/* Active crimson indicator beacon */}
          {isActive ? (
            <span className="sm-active-beacon" aria-hidden="true" />
          ) : (
            <span className="w-1.5 h-1.5 shrink-0" aria-hidden="true" />
          )}

          {/* Micro-animated icon */}
          <span className="sm-item-icon sm-stagger-icon">
            <Icon className="w-4 h-4" />
          </span>

          {/* Masked staggered label */}
          <span className="overflow-hidden leading-tight flex-1">
            <span className="sm-item-label sm-stagger-label">
              {item.label}
            </span>
          </span>

          {/* React Bits inspired numeric index counter */}
          <span className="sm-item-num" aria-hidden="true">
            {item.num}
          </span>
        </Link>
      </div>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar-container w-[260px] bg-[#FFFAF3] border-r border-[#1C1917]/15 flex flex-col h-screen sticky top-0 select-none ${className}`}
    >
      {/* Top Header & Brand */}
      <div className="shrink-0 p-5 border-b border-[#1C1917]/10 flex items-center justify-between">
        <Link to="/dashboard" className="sm-brand-link flex items-center gap-2.5 group">
          <div className="sm-brand-mark w-2.5 h-2.5 bg-[#F62440] rounded-xs transform rotate-45 shadow-xs" />
          <span className="font-mono text-sm tracking-[0.2em] font-bold text-[#1C1917] uppercase group-hover:text-[#F62440] transition-colors">
            SAKHISHIELD
          </span>
        </Link>
        <Link
          to="/"
          title="View Landing Page"
          className="sm-site-link"
        >
          <span>SITE</span>
          <ArrowUpRight className="sm-site-arrow w-3 h-3" />
        </Link>
      </div>

      {/* Navigation Sections (Flex-1 scrollable area with Sibling Focus Dimming) */}
      <div className="flex-1 p-3 space-y-6 overflow-y-auto">
        {/* Main Group */}
        <div>
          <div className="sm-section-title sm-stagger-title px-3 pb-1.5">
            MAIN
          </div>
          <div className="sm-nav-list" role="list">
            {mainNav.map(renderNavItem)}
          </div>
        </div>

        {/* Your Safety Group */}
        <div>
          <div className="sm-section-title sm-stagger-title px-3 pb-1.5">
            YOUR SAFETY
          </div>
          <div className="sm-nav-list" role="list">
            {safetyNav.map(renderNavItem)}
          </div>
        </div>

        {/* Account Group */}
        <div>
          <div className="sm-section-title sm-stagger-title px-3 pb-1.5">
            ACCOUNT
          </div>
          <div className="sm-nav-list" role="list">
            {accountNav.map(renderNavItem)}
          </div>
        </div>

        {/* Help & Safety Resources */}
        <div className="pt-2 border-t border-[#1C1917]/10">
          <div className="sm-item-wrap">
            <Link
              to="/help"
              onClick={onNavigate}
              className="sm-nav-item text-xs text-[#78716C] hover:text-[#1C1917]"
            >
              <span className="w-1.5 h-1.5 shrink-0" aria-hidden="true" />
              <span className="sm-item-icon sm-stagger-icon">
                <CircleHelp className="w-4 h-4" />
              </span>
              <span className="overflow-hidden leading-tight flex-1">
                <span className="sm-item-label sm-stagger-label font-normal text-xs text-[#78716C]">
                  Help & Safety Resources
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Profile Mini Card (Pinned at bottom) */}
      <div className="shrink-0 p-3 border-t border-[#1C1917]/10 bg-[#FFF2DB]/40 space-y-1">
        <Link
          to="/profile"
          onClick={onNavigate}
          className="sm-profile-card flex items-center justify-between p-2.5 rounded-lg cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Avatar
              name={user.name}
              initials={user.initials}
              size="sm"
              showStatus
              status={user.status === 'SAFE' ? 'SAFE' : 'CRITICAL'}
            />
            <div>
              <div className="font-sans text-xs font-bold text-[#1C1917] group-hover:text-[#F62440] transition-colors">
                {user.name}
              </div>
              <div className="font-mono text-[10px] text-[#78716C] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>{user.status}</span>
              </div>
            </div>
          </div>

          <ChevronRight className="sm-profile-chevron w-4 h-4 text-[#78716C] transition-transform duration-200" />
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-sans text-[#78716C] hover:text-[#F62440] hover:bg-red-50 transition-colors cursor-pointer group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="group-hover:translate-x-0.5 transition-transform">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
