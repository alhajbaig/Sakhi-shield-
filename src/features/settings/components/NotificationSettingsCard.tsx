// SakhiShield — Notification Sounds & Safety Alerts Settings Card

import React from 'react';
import { Volume2, VolumeX, Bell, AlertOctagon, Play } from 'lucide-react';
import type { UserSettings, CheckInTimeoutSeconds } from '../types/settings.types';
import { CHECKIN_TIMEOUT_OPTIONS } from '../constants/settings.constants';

interface NotificationSettingsCardProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
  onTestChime: () => void;
  onTestSiren: () => void;
  disabled?: boolean;
}

export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  settings,
  onUpdate,
  onTestChime,
  onTestSiren,
  disabled,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            AUDIBLE & SYSTEM TELEMETRY
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Notification Sounds & Alerts
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle 1: Notification Sounds */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono text-xs font-bold text-[#1C1917]">
              Notification Sound Chimes
            </div>
            <p className="font-sans text-xs text-[#57534E] leading-relaxed max-w-xl">
              Plays a gentle synthesized chime when routine check-ins, circle approvals, or journey milestones occur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onTestChime}
              disabled={disabled || !settings.notificationSoundEnabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFAF3] border border-[#1C1917]/20 rounded-lg font-mono text-[11px] font-bold text-[#1C1917] hover:bg-[#FFF2DB] transition-colors cursor-pointer disabled:opacity-40"
              title="Test notification chime sound"
            >
              <Play className="w-3.5 h-3.5" />
              <span>TEST CHIME</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.notificationSoundEnabled}
                onChange={(e) => onUpdate({ notificationSoundEnabled: e.target.checked })}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1C1917]/20 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C1917]" />
            </label>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-[#1C1917]">Audible Alert Master Volume</span>
            <span className="font-bold text-[#1C1917]">{settings.soundVolume}%</span>
          </div>

          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-[#78716C] shrink-0" />
            <input
              type="range"
              min={0}
              max={100}
              value={settings.soundVolume}
              onChange={(e) => onUpdate({ soundVolume: Number(e.target.value) })}
              disabled={disabled || !settings.notificationSoundEnabled}
              className="w-full accent-[#1C1917] cursor-pointer"
            />
            <Volume2 className="w-4 h-4 text-[#1C1917] shrink-0" />
          </div>
        </div>

        {/* Toggle 2: Emergency Audible Siren */}
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#F62440]">
                Emergency SOS Audible Siren
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F62440] text-white">
                HIGH PRIORITY
              </span>
            </div>
            <p className="font-sans text-xs text-[#57534E] leading-relaxed max-w-xl">
              Emits a high-intensity dual-tone siren upon confirmed SOS beacon activation or missed second check-in escalation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onTestSiren}
              disabled={disabled || !settings.emergencyAudibleSiren}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFAF3] border border-red-300 rounded-lg font-mono text-[11px] font-bold text-[#F62440] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
              title="Test 1-second emergency siren burst"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>TEST SIREN</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.emergencyAudibleSiren}
                onChange={(e) => onUpdate({ emergencyAudibleSiren: e.target.checked })}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1C1917]/20 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F62440]" />
            </label>
          </div>
        </div>

        {/* Check-in Timeout Selection */}
        <div className="space-y-2 pt-2 border-t border-[#1C1917]/10">
          <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block">
            Walk With Me Check-in Verification Countdown
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {CHECKIN_TIMEOUT_OPTIONS.map((opt) => {
              const isSelected = settings.checkinTimeoutSeconds === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onUpdate({ checkinTimeoutSeconds: opt.value as CheckInTimeoutSeconds })}
                  disabled={disabled}
                  className={`p-3 rounded-xl border text-left font-mono text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold shadow-2xs'
                      : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E] hover:bg-[#FFF2DB]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
