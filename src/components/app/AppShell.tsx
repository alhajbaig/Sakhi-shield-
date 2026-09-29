import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNavigation } from './MobileNavigation';
import { useApp } from '../../lib/AppContext';
import { AlertOctagon, PhoneCall, ShieldCheck } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title,
  subtitle,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { sosActive, cancelSOS, user } = useApp();

  return (
    <div className="h-screen w-full bg-[#FFFAF3] text-[#1C1917] flex overflow-hidden antialiased">
      
      {/* Desktop Sidebar (Persistent, full length of the screen and pinned) */}
      <Sidebar className="hidden lg:flex shrink-0 h-screen sticky top-0" />

      {/* Mobile Slide-out Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative flex-1 max-w-[280px] w-full bg-[#FFFAF3] h-full shadow-2xl flex flex-col z-10">
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} className="w-full h-full border-r-0" />
          </div>
        </div>
      )}

      {/* Main Content Area (Only this content page scrolls) */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1400px] w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Fullscreen Emergency SOS Overlay Modal when SOS is active */}
      {sosActive && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFAF3] border-4 border-[#F62440] rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#F62440] text-white flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertOctagon className="w-10 h-10" />
            </div>

            <span className="font-mono text-xs font-bold text-[#F62440] uppercase tracking-widest block mb-1">
              HIGH PRIORITY ESCALATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-bold mb-2">
              Emergency SOS Active
            </h2>
            <p className="font-sans text-sm text-[#57534E] mb-6">
              Live coordinates and emergency broadcast dispatched to your trusted contacts:
            </p>

            <div className="space-y-2 text-left mb-6 font-mono text-xs">
              {user.trustedContacts.length > 0 ? (
                user.trustedContacts.map((contact) => (
                <div key={contact.id} className="p-3 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#F62440]" />
                    <span className="font-bold text-[#1C1917]">{contact.name} ({contact.relationship})</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#F62440] text-white rounded font-bold">ALERT SENT</span>
                </div>
              ))
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center text-amber-900">
                  No trusted contacts configured. Please add guardians in your profile.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={cancelSOS}
              className="w-full py-4 bg-[#1C1917] text-[#FFFAF3] rounded-xl font-mono text-sm font-bold hover:bg-[#333] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>I AM SAFE — DEACTIVATE SOS</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
