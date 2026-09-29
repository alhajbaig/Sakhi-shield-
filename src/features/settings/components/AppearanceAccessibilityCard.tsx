// SakhiShield — Appearance & Accessibility Settings Component

import React from 'react';
import { Eye, Contrast, FastForward, Type, Lock } from 'lucide-react';
import type { UserSettings, FontScale } from '../types/settings.types';

interface AppearanceAccessibilityCardProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
  disabled?: boolean;
}

export const AppearanceAccessibilityCard: React.FC<AppearanceAccessibilityCardProps> = ({
  settings,
  onUpdate,
  disabled,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C1917]/10">
        <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
            VISUAL & ERGONOMIC PREFERENCES
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
            Appearance & Accessibility
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Visual Theme: Frozen Warm Sand Theme */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1C1917]">
                Visual Theme Architecture
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFE5BF] border border-[#1C1917]/15 text-[#1C1917]">
                WARM SAND (CANONICAL)
              </span>
            </div>
            <p className="font-sans text-xs text-[#57534E] leading-relaxed max-w-xl">
              The high-legibility warm sand and deep obsidian contrast palette is locked across the platform to ensure immediate visual comprehension during distress.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-lg font-mono text-[11px] text-[#78716C] shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>THEME FROZEN</span>
          </div>
        </div>

        {/* Toggle 1: High Contrast */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Contrast className="w-4 h-4 text-[#1C1917]" />
              <span className="font-mono text-xs font-bold text-[#1C1917]">
                High Contrast Borders & Outlines
              </span>
            </div>
            <p className="font-sans text-xs text-[#57534E] leading-relaxed max-w-xl">
              Strengthens card borders and focus outlines for enhanced outdoor visibility under direct sunlight.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => onUpdate({ highContrast: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1C1917]/20 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C1917]" />
          </label>
        </div>

        {/* Toggle 2: Reduced Motion */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FastForward className="w-4 h-4 text-[#1C1917]" />
              <span className="font-mono text-xs font-bold text-[#1C1917]">
                Reduced Motion & Pulse Effects
              </span>
            </div>
            <p className="font-sans text-xs text-[#57534E] leading-relaxed max-w-xl">
              Disables non-essential pulse animations, radar sweeps, and staggered entrance transitions.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => onUpdate({ reduceMotion: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1C1917]/20 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C1917]" />
          </label>
        </div>

        {/* Font Scale Selection */}
        <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 space-y-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#1C1917]" />
            <span className="font-mono text-xs font-bold text-[#1C1917]">
              Dashboard Typography Scale
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 max-w-sm pt-1">
            {[
              { id: 'NORMAL', label: 'Standard Typography' },
              { id: 'LARGE', label: 'Large Legibility' },
            ].map((opt) => {
              const isSelected = settings.fontScale === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdate({ fontScale: opt.id as FontScale })}
                  disabled={disabled}
                  className={`p-2.5 rounded-lg border font-mono text-xs text-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold shadow-2xs'
                      : 'border-[#1C1917]/15 bg-[#FFFAF3] text-[#57534E] hover:bg-[#FFF2DB]'
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
