import React from 'react';
import { useApp } from '../../lib/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { useTrustedCircle } from '../../hooks/useTrustedCircle';
import { useTrustedCircleAlerts } from '../../hooks/useTrustedCircleAlerts';
import { Users, ChevronRight, AlertOctagon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrustedCircle: React.FC = () => {
  const { user } = useApp();
  const { user: authUser } = useAuth();
  const { circle, members } = useTrustedCircle(authUser?.id);
  const { outgoingAlert } = useTrustedCircleAlerts(authUser?.id, authUser?.name || 'User');

  const activeMembersCount = members.filter((m) => m.status === 'APPROVED').length;

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1C1917]" />
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
              TRUSTED CIRCLE
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#78716C]">
            {circle ? `${activeMembersCount} GUARDIANS` : `${user.trustedContacts.length} ACTIVE`}
          </span>
        </div>

        {/* Active Emergency Alert Banner (Section 73) */}
        {outgoingAlert && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-5 h-5 text-[#F62440] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#F62440] uppercase tracking-wide">
                  ACTIVE SAFETY ALERT
                </div>
                <div className="text-[11px] text-red-800">
                  Trusted Circle notified.
                </div>
              </div>
            </div>
            <Link
              to="/trusted-circle"
              className="px-3 py-1 bg-[#F62440] text-white rounded-lg text-xs font-bold hover:bg-[#dc1d36] transition-colors"
            >
              VIEW ALERT →
            </Link>
          </div>
        )}

        <div className="space-y-2.5">
          {circle ? (
            /* Circle Card */
            <div className="p-4 bg-[#FFF2DB]/60 border border-[#FFE5BF] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#171515] flex items-center gap-2">
                    <span>{circle.name}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-xs text-[#171515]/60 mt-0.5">
                    {activeMembersCount} verified member{activeMembersCount === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#171515]/50 uppercase">CODE</div>
                  <div className="font-mono text-xs font-extrabold text-[#171515]">{circle.invite_code}</div>
                </div>
              </div>

              {/* Members preview */}
              <div className="flex items-center gap-1.5 pt-1">
                {members.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    title={m.user_name || 'Member'}
                    className="w-7 h-7 rounded-full bg-[#171515] text-[#FFFAF3] text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-xs"
                  >
                    {(m.user_name || 'M').charAt(0).toUpperCase()}
                  </div>
                ))}
                {members.length > 4 && (
                  <div className="w-7 h-7 rounded-full bg-[#FFE5BF] text-[#171515] text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    +{members.length - 4}
                  </div>
                )}
              </div>
            </div>
          ) : user.trustedContacts.length === 0 ? (
            <div className="py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-[#FFF2DB] border border-[#1C1917]/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-[#78716C]" />
              </div>
              <p className="font-sans text-xs text-[#57534E] mb-3">
                No trusted circle created yet.
                <br />
                Build a private network of people you trust.
              </p>
              <Link
                to="/trusted-circle"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F62440] text-white rounded-lg text-xs font-mono font-bold hover:bg-[#dc1d36] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>BUILD TRUSTED CIRCLE</span>
              </Link>
            </div>
          ) : (
            user.trustedContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 bg-[#FFF2DB]/60 border border-[#1C1917]/10 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold flex items-center justify-center">
                    {contact.name[0]}
                  </div>
                  <div>
                    <div className="font-sans text-xs sm:text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
                      <span>{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="font-mono text-[9px] px-1.5 py-0.2 bg-[#FFE5BF] border border-[#1C1917]/20 rounded font-bold text-[#1C1917]">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-[#57534E]">
                      {contact.relationship} • {contact.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{contact.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1C1917]/10 mt-4 flex items-center justify-between">
        <Link
          to="/trusted-circle"
          className="font-mono text-xs font-bold text-[#1C1917] hover:text-[#F62440] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>VIEW CIRCLE</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        <span className="font-mono text-[10px] text-[#78716C]">DISCREET NOTIFICATIONS</span>
      </div>
    </div>
  );
};
