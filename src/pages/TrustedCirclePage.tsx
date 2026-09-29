import React, { useState } from 'react';
import { AppShell } from '../components/app/AppShell';
import { useAuth } from '../lib/AuthContext';
import { useTrustedCircle } from '../hooks/useTrustedCircle';
import { useTrustedCircleAlerts } from '../hooks/useTrustedCircleAlerts';
import { TrustedCircleVisual } from '../components/trusted-circle/TrustedCircleVisual';
import { CircleInviteCard } from '../components/trusted-circle/CircleInviteCard';
import { CircleMembersList } from '../components/trusted-circle/CircleMembersList';
import { CreateCircleModal } from '../components/trusted-circle/CreateCircleModal';
import { JoinCircleModal } from '../components/trusted-circle/JoinCircleModal';
import { ActiveAlertBanner } from '../components/trusted-circle/ActiveAlertBanner';
import {
  Shield,
  Plus,
  KeyRound,
  Bell,
  Lock,
  MapPin,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const TrustedCirclePage: React.FC = () => {
  const { user } = useAuth();
  const {
    circle,
    members,
    pendingRequests,
    isLoading,
    error,
    isOwner,
    createCircle,
    joinCircle,
    approveMember,
    declineMember,
    removeMember,
    leaveCircle,
    regenerateCode,
    deleteCircle,
    refreshCircle,
  } = useTrustedCircle(user?.id, user?.name, user?.phone, user?.email);

  const { outgoingAlert, resolveAlert, shareLocationForAlert } = useTrustedCircleAlerts(
    user?.id,
    user?.name || 'User'
  );

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Privacy toggles
  const [shareLocationOnEmergency, setShareLocationOnEmergency] = useState(true);
  const [routineUpdates, setRoutineUpdates] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }
  };

  return (
    <AppShell
      title="Trusted Circle"
      subtitle="Your people, when it matters. Private & consensual safety network."
    >
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        {/* Active Emergency Alert Banner (Person in danger feedback) */}
        {outgoingAlert && (
          <ActiveAlertBanner
            alert={outgoingAlert}
            onResolve={async () => {
              await resolveAlert(outgoingAlert.id);
            }}
            onShareLocation={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    shareLocationForAlert(
                      outgoingAlert.id,
                      pos.coords.latitude,
                      pos.coords.longitude,
                      pos.coords.accuracy
                    );
                  },
                  (err) => {
                    console.warn('Geolocation error:', err);
                  }
                );
              }
            }}
          />
        )}

        {/* Loading State */}
        {isLoading && !circle ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#171515]/20 border-t-[#F62440] rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest font-mono text-[#171515]/60">
              Loading your Trusted Circle...
            </p>
          </div>
        ) : error && !circle ? (
          /* Error State */
          <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-red-800">We couldn't load your circle</h3>
            <p className="text-xs text-red-700/80 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => refreshCircle()}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        ) : !circle ? (
          /* Empty State (Section 06) */
          <div className="space-y-6">
            <div className="bg-[#FFF2DB]/60 rounded-3xl border border-[#FFE5BF] p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-[#FFFAF3] border border-[#FFE5BF] shadow-sm flex items-center justify-center text-[#F62440] mx-auto">
                <Shield className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#171515]/60">
                  YOUR SAFETY
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171515]"
                  style={{ fontFamily: 'DM Serif Display, serif' }}
                >
                  You don't have a Trusted Circle yet.
                </h2>
                <p className="text-xs sm:text-sm text-[#171515]/70 leading-relaxed">
                  Create one for the people you want beside you when safety matters, or enter an invitation code to join someone who trusts you.
                </p>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F62440] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#dc1d36] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>CREATE A CIRCLE</span>
                </button>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-[#FFE5BF] text-[#171515] text-xs sm:text-sm font-bold shadow-sm hover:bg-[#FFF2DB] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <KeyRound className="w-4 h-4 text-[#171515]/70" />
                  <span>JOIN A CIRCLE</span>
                </button>
              </div>
            </div>

            {/* Privacy Architecture Notice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#FFE5BF]/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF2DB] flex items-center justify-center text-[#171515]">
                  <Lock className="w-4 h-4 text-[#F62440]" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171515]">
                  Private & Consensual
                </h4>
                <p className="text-xs text-[#171515]/70 leading-relaxed">
                  Only the specific individuals you invite can join. No public discovery, search directories, or social networks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#FFE5BF]/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF2DB] flex items-center justify-center text-[#171515]">
                  <MapPin className="w-4 h-4 text-[#F62440]" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171515]">
                  Event-Based Location
                </h4>
                <p className="text-xs text-[#171515]/70 leading-relaxed">
                  Never continuous tracking. Location is only captured and transmitted during an explicit SOS or active safety escalation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#FFE5BF]/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF2DB] flex items-center justify-center text-[#171515]">
                  <Bell className="w-4 h-4 text-[#F62440]" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171515]">
                  Emergency Priority
                </h4>
                <p className="text-xs text-[#171515]/70 leading-relaxed">
                  Guardians receive high-priority alerts with real-time multi-recipient acknowledgement telemetry.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Active Circle View */
          <div className="space-y-6 sm:space-y-8">
            {/* Top Bar with Circle Info and Action buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-3xl border border-[#FFE5BF] shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#171515]/50">
                    Trusted Circle
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    ACTIVE
                  </span>
                  {isOwner && (
                    <span className="px-2 py-0.5 rounded-full bg-[#171515] text-white text-[10px] font-bold">
                      OWNER
                    </span>
                  )}
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171515]"
                  style={{ fontFamily: 'DM Serif Display, serif' }}
                >
                  {circle.name}
                </h2>
                {circle.description && (
                  <p className="text-xs text-[#171515]/70">{circle.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-[#FFE5BF] bg-[#FFF2DB]/60 text-xs font-bold text-[#171515] hover:bg-[#FFF2DB] transition-all flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#171515]/70" />
                  <span>Join Another</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#F62440] text-white text-xs font-bold shadow-sm hover:bg-[#dc1d36] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Circle</span>
                </button>
              </div>
            </div>

            {/* Radial Visual (Section 70) */}
            <TrustedCircleVisual
              currentUserName={user?.name || 'You'}
              members={members}
              activeAlert={outgoingAlert}
            />

            {/* Circle Invite Code Card */}
            <CircleInviteCard
              circle={circle}
              isOwner={isOwner}
              onRegenerateCode={regenerateCode}
            />

            {/* Members & Join Requests List */}
            <CircleMembersList
              members={members}
              pendingRequests={pendingRequests}
              currentUserId={user?.id || ''}
              isOwner={isOwner}
              onApprove={approveMember}
              onDecline={declineMember}
              onRemove={removeMember}
              onLeave={leaveCircle}
              onDeleteCircle={deleteCircle}
            />

            {/* Privacy & Notification Settings Panel (Section 37, 80) */}
            <div className="bg-white rounded-3xl border border-[#FFE5BF] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#171515]">
                    Safety & Notification Controls
                  </h3>
                  <p className="text-xs text-[#171515]/60 mt-0.5">
                    Configure how your device communicates with your Trusted Circle.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-[#FFF2DB] flex items-center justify-center text-[#F62440]">
                  <Bell className="w-4 h-4" />
                </div>
              </div>

              {/* Notification Permission Card (Section 37) */}
              {notificationPermission !== 'granted' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-900">
                      Enable Emergency Browser Notifications
                    </div>
                    <div className="text-[11px] text-amber-800/80">
                      Trusted Circle alerts help the people you choose know when you need them, even if SakhiShield is running in the background.
                    </div>
                  </div>
                  <button
                    onClick={requestNotificationPermission}
                    className="shrink-0 px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 transition-colors shadow-sm"
                  >
                    ENABLE SAFETY ALERTS
                  </button>
                </div>
              )}

              {/* Toggles */}
              <div className="divide-y divide-[#FFE5BF]/50">
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[#171515]">
                      Emergency Location Transmission
                    </div>
                    <div className="text-[11px] text-[#171515]/60">
                      Transmit real-time GPS coordinates to circle members strictly when SOS or high-risk alert is active.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareLocationOnEmergency}
                    onChange={(e) => setShareLocationOnEmergency(e.target.checked)}
                    className="w-4 h-4 accent-[#F62440] cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[#171515]">
                      Routine Journey Milestones
                    </div>
                    <div className="text-[11px] text-[#171515]/60">
                      Send gentle notifications when starting or safely completing scheduled Walk With Me journeys.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={routineUpdates}
                    onChange={(e) => setRoutineUpdates(e.target.checked)}
                    className="w-4 h-4 accent-[#F62440] cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FFF2DB]/60 rounded-xl text-[11px] text-[#171515]/70 leading-relaxed">
                <span className="font-semibold text-[#171515]">Privacy Policy:</span> Trusted Circle members only receive safety information you choose to share. Being in a circle never gives anyone continuous access to your location, private incidents, or evidence vault.
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create Circle */}
        <CreateCircleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={async (name, desc, mode) => {
            const res = await createCircle(name, desc, mode);
            await refreshCircle();
            return res;
          }}
        />

        {/* Modal: Join Circle */}
        <JoinCircleModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoin={async (code) => {
            const res = await joinCircle(code);
            await refreshCircle();
            return res;
          }}
        />
      </div>
    </AppShell>
  );
};

export default TrustedCirclePage;
