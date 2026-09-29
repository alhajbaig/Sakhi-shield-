import React, { useState } from 'react';
import { AppShell } from '../components/app/AppShell';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { PersonalInformation } from '../components/profile/PersonalInformation';
import { SafetyInformation } from '../components/profile/SafetyInformation';
import { ProfilePreferences } from '../components/profile/ProfilePreferences';
import { User, Users, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'safety' | 'privacy'>('all');

  return (
    <AppShell title="Your Profile" subtitle="Manage your identity and trusted safety information">
      <div className="space-y-6 sm:space-y-8">
        
        {/* Back Link to Dashboard */}
        <div className="flex items-center justify-between pb-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO SAFETY OVERVIEW</span>
          </Link>
          <span className="font-mono text-xs text-[#78716C]">
            IDENTITY & PERMISSION SOVEREIGNTY
          </span>
        </div>

        {/* Top Profile Summary Header */}
        <ProfileHeader />

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Navigation / Category Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="p-4 sm:p-5 rounded-2xl border border-[#1C1917]/15 bg-[#FFF2DB]/50">
              <div className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold mb-3">
                PROFILE SECTIONS
              </div>

              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Information', icon: User },
                  { id: 'personal', label: 'Personal Information', icon: User },
                  { id: 'safety', label: 'Trusted Safety Network', icon: Users },
                  { id: 'privacy', label: 'Privacy & Data Controls', icon: Shield },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-sans flex items-center gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold shadow-xs'
                          : 'border-transparent text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFFAF3]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#1C1917]" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-[#1C1917]/10 text-xs font-mono text-[#78716C]">
                NO PUBLIC PROFILE • ENCRYPTED
              </div>
            </div>
          </div>

          {/* Right Column: Information Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            {(activeTab === 'all' || activeTab === 'personal') && (
              <PersonalInformation />
            )}

            {(activeTab === 'all' || activeTab === 'safety') && (
              <SafetyInformation />
            )}

            {(activeTab === 'all' || activeTab === 'privacy') && (
              <ProfilePreferences />
            )}

          </div>

        </div>

      </div>
    </AppShell>
  );
};

export default ProfilePage;
