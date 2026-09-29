import React from 'react';
import { useApp } from '../../lib/AppContext';
import { Avatar } from '../shared/Avatar';
import { Mail, Phone } from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* User Identity info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <Avatar
            name={user.name}
            initials={user.initials}
            size="lg"
            showStatus
            status={user.status === 'SAFE' ? 'SAFE' : 'CRITICAL'}
          />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-bold">
                {user.fullName}
              </h2>
              <span className="font-mono text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                VERIFIED ID
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 font-mono text-xs text-[#57534E]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#78716C]" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#78716C]" />
                {user.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completeness Box (calm, non-gamified) */}
        <div className="p-4 bg-[#FFF2DB] rounded-xl border border-[#1C1917]/15 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-bold text-[#1C1917]">PROFILE COMPLETION</span>
            <span className="font-bold text-[#F62440]">{user.profileCompleteness}%</span>
          </div>

          <div className="w-full h-2 bg-white rounded-full overflow-hidden mb-2 border border-[#1C1917]/10">
            <div
              className="h-full bg-[#1C1917] rounded-full"
              style={{ width: `${user.profileCompleteness}%` }}
            />
          </div>

          <p className="font-sans text-[11px] text-[#57534E]">
            Missing: <span className="font-semibold text-[#1C1917]">{user.missingField}</span>
          </p>
        </div>

      </div>
    </div>
  );
};
