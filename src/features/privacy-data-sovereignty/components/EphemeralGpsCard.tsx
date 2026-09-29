// SakhiShield — Ephemeral GPS & Spatial Retention Component

import React from 'react';
import { Navigation, Clock, Trash2, Check, AlertCircle } from 'lucide-react';
import type { PrivacyPreferences, GpsRetentionWindow, LocationPrivacyMode } from '../types/privacy.types';
import { GPS_RETENTION_OPTIONS, LOCATION_PRIVACY_OPTIONS } from '../constants/privacy.constants';

interface EphemeralGpsCardProps {
  preferences: PrivacyPreferences;
  onUpdate: (updates: Partial<PrivacyPreferences>) => void;
  onPurge: () => void;
  isPurging: boolean;
  disabled?: boolean;
}

export const EphemeralGpsCard: React.FC<EphemeralGpsCardProps> = ({
  preferences,
  onUpdate,
  onPurge,
  isPurging,
  disabled,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
              SPATIAL TELEMETRY
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
              Ephemeral GPS Windows
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onPurge}
          disabled={disabled || isPurging}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FFF2DB] border border-[#1C1917]/20 rounded-lg text-xs font-mono font-bold text-[#1C1917] hover:bg-[#FFE5BF] transition-colors cursor-pointer disabled:opacity-50"
          title="Manually purge all expired GPS points and inactive session corridors right now"
        >
          <Trash2 className="w-3.5 h-3.5 text-[#F62440]" />
          <span>{isPurging ? 'PURGING...' : 'PURGE EXPIRED GPS NOW'}</span>
        </button>
      </div>

      {/* Retention Horizon Selector */}
      <div className="space-y-2">
        <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block">
          GPS Coordinates Retention Window
        </label>
        <p className="font-sans text-xs text-[#57534E]">
          Defines the maximum lifetime of spatial breadcrumbs stored locally or in transient transit buffers during Walk With Me journeys.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {GPS_RETENTION_OPTIONS.map((opt) => {
            const isSelected = preferences.gpsRetention === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdate({ gpsRetention: opt.id as GpsRetentionWindow })}
                disabled={disabled}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] shadow-2xs font-semibold'
                    : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E] hover:bg-[#FFF2DB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#F62440]" />}
                </div>
                <span className="font-sans text-[11px] leading-tight text-[#78716C]">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spatial Obfuscation Mode */}
      <div className="space-y-2 pt-2 border-t border-[#1C1917]/10">
        <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block">
          Live Coordinate Precision Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {LOCATION_PRIVACY_OPTIONS.map((opt) => {
            const isSelected = preferences.locationMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdate({ locationMode: opt.id as LocationPrivacyMode })}
                disabled={disabled}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] shadow-2xs font-semibold'
                    : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E] hover:bg-[#FFF2DB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#F62440]" />}
                </div>
                <span className="font-sans text-[11px] leading-tight text-[#78716C]">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-3 bg-[#FFF2DB]/60 border border-[#1C1917]/10 rounded-xl text-xs font-mono text-[#57534E] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#78716C]" />
          <span>
            {preferences.lastPurgeTimestamp
              ? `Last telemetry purge: ${new Date(preferences.lastPurgeTimestamp).toLocaleString()}`
              : 'Auto-purge cycle initialized on session finish'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>ZERO CONTINUOUS TRACKING</span>
        </div>
      </div>
    </div>
  );
};
