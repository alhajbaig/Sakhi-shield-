// SakhiShield — Create Incident Modal Component
// Allows opening an incident record with category, severity, notes, and optional journey context.

import React, { useState } from 'react';
import type { IncidentCategory, IncidentSeverity } from '../types';
import { INCIDENT_CATEGORIES_CONFIG, INCIDENT_SEVERITY_CONFIG } from '../constants/incidentVault.constants';
import { X, LockKeyhole, AlertCircle } from 'lucide-react';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    title: string;
    description: string;
    category: IncidentCategory;
    severity: IncidentSeverity;
    locationName?: string;
    notes?: string;
  }) => Promise<void>;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('HARASSMENT');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        locationName: locationName.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create incident record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FFFAF3] rounded-2xl border border-[#1C1917]/20 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1C1917]/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1C1917] text-[#FFFAF3] flex items-center justify-center">
              <LockKeyhole className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                Record New Safety Incident
              </h2>
              <p className="font-mono text-[10px] text-[#78716C]">
                ENCRYPTED LOCAL & RLS PRIVATE VAULT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#1C1917]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 pr-1 flex-1">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
              INCIDENT TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unsolicited tailing from metro exit..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1C1917]/20 bg-white font-sans text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#1C1917]/20 bg-white font-sans text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              >
                {Object.entries(INCIDENT_CATEGORIES_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
                SEVERITY
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#1C1917]/20 bg-white font-sans text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              >
                {Object.entries(INCIDENT_SEVERITY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label} ({key})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
              LOCATION (OPTIONAL)
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Green Park Metro Station, Gate 2"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1C1917]/20 bg-white font-sans text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
              DETAILED DESCRIPTION *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, individuals involved, or actions taken..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#1C1917]/20 bg-white font-sans text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917] leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-[#1C1917] mb-1">
              CONFIDENTIAL NOTES
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional personal notes, witness info, or badge IDs..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1C1917]/20 bg-white font-sans text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#1C1917]/20 font-mono text-xs font-bold text-[#57534E] hover:bg-[#FAF6F0]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'CREATING...' : 'CREATE INCIDENT RECORD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
