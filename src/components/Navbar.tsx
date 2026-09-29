import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StaggeredMenu } from './ui/StaggeredMenu';
import { useAuth } from '../lib/AuthContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Sentinel', href: '#sentinel-showcase' },
    { label: 'How it works', href: '#safety-loop' },
    { label: 'Walk With Me', href: '#walk-with-me' },
    { label: 'Safety Copilot', href: '#safety-copilot' },
    { label: 'Digital Safety', href: '#digital-safety' },
    { label: 'Privacy', href: '#privacy-story' },
  ];

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to top', link: '#' },
    { label: 'Sentinel HUD', ariaLabel: 'Autonomous safety sentinel', link: '#sentinel-showcase' },
    { label: 'How It Works', ariaLabel: 'Core safety loop', link: '#safety-loop' },
    { label: 'Walk With Me', ariaLabel: 'Live companion simulation', link: '#walk-with-me' },
    { label: 'Safety Copilot', ariaLabel: 'Contextual AI guidance', link: '#safety-copilot' },
    { label: 'Digital Safety', ariaLabel: 'Cyber threat telemetry', link: '#digital-safety' },
    { label: 'Incident Vault', ariaLabel: 'Private evidence storage', link: '#incident-vault' },
    { label: 'Privacy Sovereignty', ariaLabel: 'Zero-knowledge governance', link: '#privacy-story' },
  ];

  const socialItems = isAuthenticated
    ? [
        { label: '112 Police Emergency', link: 'tel:112' },
        { label: '1091 Women Helpline', link: 'tel:1091' },
        { label: 'Open Dashboard', link: '/dashboard' },
        { label: 'Your Profile', link: '/profile' },
      ]
    : [
        { label: '112 Police Emergency', link: 'tel:112' },
        { label: '1091 Women Helpline', link: 'tel:1091' },
        { label: 'Sign In', link: '/login' },
        { label: 'Get Started', link: '/signup' },
      ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FFFAF3]/95 backdrop-blur-md border-b border-[#171515]/10 py-2.5 shadow-xs'
          : 'bg-[#FFFAF3]/80 backdrop-blur-xs py-3.5 border-b border-[#171515]/5'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <a
          href="#"
          data-cursor="pointer"
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          aria-label="SakhiShield Home"
        >
          <div className="w-2.5 h-2.5 bg-[#F62440] rounded-full animate-heartbeat" />
          <span className="font-mono text-sm sm:text-base font-bold tracking-[0.16em] text-[#171515] uppercase">
            SAKHISHIELD
          </span>
        </a>

        {/* Center: Editorial Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-cursor="pointer"
              className="font-sans text-xs lg:text-sm text-[#625B55] hover:text-[#171515] transition-colors font-medium py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions + StaggeredMenu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#171515] hover:bg-[#F62440] text-[#FFFAF3] text-xs font-mono font-bold tracking-wider uppercase rounded-full transition-all shadow-xs cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>DASHBOARD</span>
              <span>→</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex font-sans text-xs lg:text-sm text-[#625B55] hover:text-[#171515] transition-colors font-medium py-1"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                data-cursor="pointer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#171515] hover:bg-[#F62440] text-[#FFFAF3] text-xs font-mono font-semibold tracking-wider uppercase rounded-full transition-colors"
              >
                <span>Get started</span>
                <span>→</span>
              </Link>
            </>
          )}

          {/* StaggeredMenu component from React Bits */}
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            colors={['#FFE5BF', '#F62440', '#171515']}
            accentColor="#F62440"
            menuButtonColor="#171515"
            openMenuButtonColor="#FFFAF3"
            changeMenuColorOnOpen={true}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
