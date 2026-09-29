// SakhiShield — Settings Master Dashboard
// Manages account profile, security credentials, passkeys, notification chime audio, device permissions, and session access.

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { useApp } from '../../../lib/AppContext';
import { useSettings } from '../hooks/useSettings';
import { useDevicePermissions } from '../hooks/useDevicePermissions';
import { AccountSettingsCard } from './AccountSettingsCard';
import { SecuritySettingsCard } from './SecuritySettingsCard';
import { PasskeyManagerCard } from './PasskeyManagerCard';
import { NotificationSettingsCard } from './NotificationSettingsCard';
import { DevicePermissionsCard } from './DevicePermissionsCard';
import { AppearanceAccessibilityCard } from './AppearanceAccessibilityCard';
import { SessionManagerCard } from './SessionManagerCard';

export const SettingsDashboard: React.FC = () => {
  const { user: authUser } = useAuth();
  const { user, updateUser } = useApp();

  const {
    settings,
    passkeys,
    sessionInfo,
    isLoading,
    isSaving,
    feedback,
    updateSettings,
    registerNewPasskey,
    removePasskey,
    updatePin,
    testChime,
    testSiren,
  } = useSettings(authUser?.id || 'usr_current', user.fullName || authUser?.name || 'User');

  const {
    permissions,
    requesting,
    isLoading: isPermissionsLoading,
    refreshPermissions,
    requestPermission,
  } = useDevicePermissions();

  const handleAccountUpdate = (updates: any) => {
    updateSettings(updates);
    updateUser({
      name: updates.fullName?.split(' ')[0] || user.name,
      fullName: updates.fullName || user.fullName,
      phone: updates.phone !== undefined ? updates.phone : user.phone,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Navigation Breadcrumb + Pipeline Status Badge */}
      <div className="flex items-center justify-between pb-1">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#57534E] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DASHBOARD</span>
        </Link>
        <span className="font-mono text-xs px-2.5 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917] font-bold">
          APP CONFIG PIPELINE
        </span>
      </div>

      {/* 2. Top Summary Banner */}
      <div className="p-5 rounded-2xl border border-[#1C1917]/15 bg-[#FFF2DB]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#FFE5BF] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917] shrink-0">
            <Sliders className="w-6 h-6 text-[#1C1917]" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
              Application Preferences & Security
            </h2>
            <p className="font-sans text-xs text-[#57534E]">
              Configure hardware permissions, sound alerts, biometric passkeys, and account credentials.
            </p>
          </div>
        </div>

        {/* Fact-based Status Pills */}
        <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFAF3] border border-[#1C1917]/15 text-[#1C1917] font-semibold">
            SOUND: <span className="text-emerald-700">{settings.notificationSoundEnabled ? `${settings.soundVolume}%` : 'MUTED'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFAF3] border border-[#1C1917]/15 text-[#1C1917] font-semibold">
            PASSKEYS: <span className="text-emerald-700">{passkeys.length} ACTIVE</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFAF3] border border-[#1C1917]/15 text-[#1C1917] font-semibold">
            CHECKIN: <span className="text-emerald-700">{settings.checkinTimeoutSeconds}s</span>
          </div>
        </div>
      </div>

      {/* 3. Feedback Toast */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-mono font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 4. Core Cards Stack */}
      <div className="space-y-6">
        <AccountSettingsCard
          settings={settings}
          email={authUser?.email || user.email}
          onUpdate={handleAccountUpdate}
          disabled={isLoading || isSaving}
        />

        <SecuritySettingsCard
          onUpdatePin={updatePin}
          disabled={isLoading || isSaving}
        />

        <PasskeyManagerCard
          passkeys={passkeys}
          onRegisterPasskey={(label) => registerNewPasskey(label)}
          onRemovePasskey={removePasskey}
          disabled={isLoading || isSaving}
        />

        <NotificationSettingsCard
          settings={settings}
          onUpdate={updateSettings}
          onTestChime={testChime}
          onTestSiren={testSiren}
          disabled={isLoading || isSaving}
        />

        <DevicePermissionsCard
          permissions={permissions}
          onRequestPermission={requestPermission}
          onRefresh={refreshPermissions}
          requesting={requesting}
          isLoading={isPermissionsLoading}
        />

        <AppearanceAccessibilityCard
          settings={settings}
          onUpdate={updateSettings}
          disabled={isLoading || isSaving}
        />

        <SessionManagerCard
          sessionInfo={sessionInfo}
        />
      </div>
    </div>
  );
};
