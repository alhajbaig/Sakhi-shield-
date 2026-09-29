// SakhiShield — Targeted Data Deletion Modal

import React, { useState } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface DataDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteTarget: (target: 'GPS_ONLY' | 'INCIDENTS_ONLY' | 'FULL_CACHE') => Promise<void>;
}

export const DataDeletionModal: React.FC<DataDeletionModalProps> = ({
  isOpen,
  onClose,
  onDeleteTarget,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'GPS_ONLY' | 'INCIDENTS_ONLY' | 'FULL_CACHE'>('GPS_ONLY');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteTarget(selectedTarget);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFAF3] border border-[#F62440]/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#F62440]">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#F62440] font-bold block">
              TARGETED PURGE
            </span>
            <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
              Purge Stored Data
            </h3>
          </div>
        </div>

        <p className="font-sans text-xs text-[#57534E] leading-relaxed">
          Select the specific data category you wish to immediately erase from this device and associated transient storage buffers.
        </p>

        {/* Options */}
        <div className="space-y-2 font-mono text-xs">
          {[
            {
              id: 'GPS_ONLY',
              label: 'Ephemeral GPS Telemetry & Active Sessions',
              desc: 'Clears all cached journey breadcrumbs, corridor coordinates, and active walk checkpoints.',
            },
            {
              id: 'INCIDENTS_ONLY',
              label: 'Local Incident Vault & Evidence Cache',
              desc: 'Clears locally cached incident drafts, evidence metadata, and verification logs.',
            },
            {
              id: 'FULL_CACHE',
              label: 'Full Local Application Reset',
              desc: 'Wipes all local state, privacy preferences, and cached safety sessions from this browser.',
            },
          ].map((item) => (
            <label
              key={item.id}
              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                selectedTarget === item.id
                  ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917]'
                  : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E]'
              }`}
            >
              <input
                type="radio"
                name="deletionTarget"
                checked={selectedTarget === item.id}
                onChange={() => setSelectedTarget(item.id as any)}
                className="mt-1"
              />
              <div className="space-y-0.5">
                <div className="font-bold">{item.label}</div>
                <div className="font-sans text-[11px] text-[#78716C] leading-tight">
                  {item.desc}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Confirmation check */}
        <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs font-sans text-red-900">
          <AlertTriangle className="w-4 h-4 text-[#F62440] shrink-0 mt-0.5" />
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded text-[#F62440]"
            />
            <span className="font-semibold">
              I understand this action is permanent and cannot be undone.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-[#1C1917]/20 rounded-xl font-mono text-xs font-bold text-[#57534E] hover:text-[#1C1917] cursor-pointer"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!confirmed || isDeleting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F62440] text-white rounded-xl font-mono text-xs font-bold hover:bg-[#d91d35] transition-colors cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'PURGING...' : 'EXECUTE PURGE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
