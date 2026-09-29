// SakhiShield — Active Alert Banner for Person in Danger (Sections 50, 51, 52, 86)
// Provides real-time acknowledgement feedback and "I'M SAFE" resolution controls

import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, Clock, ShieldCheck, Users, MapPin } from 'lucide-react';
import type { TrustedCircleAlert } from '../../types/trustedCircle';

interface ActiveAlertBannerProps {
  alert: TrustedCircleAlert;
  onResolve: () => void | Promise<void>;
  onShareLocation?: () => void;
}

export const ActiveAlertBanner: React.FC<ActiveAlertBannerProps> = ({
  alert,
  onResolve,
  onShareLocation,
}) => {
  const [showConfirmResolve, setShowConfirmResolve] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const formattedTime = new Date(alert.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const acknowledgedCount = alert.recipients?.filter(
    (r) => r.status === 'ACKNOWLEDGED'
  ).length || 0;

  const totalRecipients = alert.recipients?.length || 0;

  return (
    <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#F62440] bg-[#FFF2DB] shadow-lg animate-fadeIn space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C1917]/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F62440] text-white flex items-center justify-center shrink-0 animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#F62440] uppercase tracking-wider">
                SAFETY ALERT ACTIVE
              </span>
              <span className="font-mono text-[10px] text-[#78716C] bg-white px-2 py-0.5 rounded border border-[#1C1917]/10">
                {formattedTime}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
              Your Trusted Circle Has Been Notified
            </h3>
          </div>
        </div>

        {/* Actions CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {onShareLocation && (
            <button
              type="button"
              onClick={onShareLocation}
              className="px-4 py-2.5 bg-white border border-[#1C1917]/20 hover:bg-[#FFF2DB] text-[#1C1917] rounded-xl font-mono text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F62440]" />
              <span>SHARE LOCATION</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowConfirmResolve(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-mono text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>I'M SAFE — RESOLVE</span>
          </button>
        </div>
      </div>

      {/* Real-time Recipient Delivery Matrix (Sections 51, 52) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#78716C]">
          <span className="flex items-center gap-1.5 uppercase font-bold text-[#1C1917]">
            <Users className="w-3.5 h-3.5 text-[#F62440]" />
            Guardian Response Telemetry
          </span>
          <span className="font-bold text-[#1C1917]">
            {acknowledgedCount} of {totalRecipients} ACKNOWLEDGED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {alert.recipients && alert.recipients.length > 0 ? (
            alert.recipients.map((recip) => {
              const isAcked = recip.status === 'ACKNOWLEDGED';
              const isSeen = recip.status === 'SEEN';

              return (
                <div
                  key={recip.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    isAcked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : isSeen
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-[#1C1917]/15 text-[#57534E]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-sans font-bold text-xs truncate block text-[#1C1917]">
                      {recip.user_name || 'Guardian'}
                    </span>
                    <span className="font-mono text-[10px] opacity-75">
                      {isAcked
                        ? 'Responded'
                        : isSeen
                        ? 'Viewed Alert'
                        : 'Alert Dispatched'}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono font-bold">
                    {isAcked ? (
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACK'D
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        WAITING
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-3 bg-white/60 border border-[#1C1917]/10 rounded-xl text-xs font-mono text-[#78716C] text-center">
              Alert dispatched to circle members.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Resolve */}
      {showConfirmResolve && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFAF3] border border-[#1C1917]/20 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="font-serif text-2xl font-bold text-[#1C1917]">
              Mark Yourself Safe?
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
              This will mark the safety alert as resolved across your Trusted Circle.
              Guardians will be notified that you are safe.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isResolving}
                onClick={() => setShowConfirmResolve(false)}
                className="flex-1 py-2.5 border border-[#1C1917]/20 text-[#1C1917] rounded-xl text-xs font-mono font-bold hover:bg-[#FFF2DB] cursor-pointer disabled:opacity-50"
              >
                KEEP ALERT ACTIVE
              </button>
              <button
                type="button"
                disabled={isResolving}
                onClick={async () => {
                  setIsResolving(true);
                  try {
                    await onResolve();
                  } finally {
                    setShowConfirmResolve(false);
                    setIsResolving(false);
                  }
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isResolving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>RESOLVING...</span>
                  </>
                ) : (
                  <span>YES, I'M SAFE</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
