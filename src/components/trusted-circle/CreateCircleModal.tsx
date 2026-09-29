import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, Lock, UserCheck, Loader2 } from 'lucide-react';
import type { JoinMode, TrustedCircle } from '../../types/trustedCircle';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string, joinMode?: JoinMode) => Promise<TrustedCircle>;
}

export const CreateCircleModal: React.FC<CreateCircleModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joinMode, setJoinMode] = useState<JoinMode>('APPROVAL_REQUIRED');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setJoinMode('APPROVAL_REQUIRED');
      setError(null);
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please provide a name for your Trusted Circle.');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Circle name must be at least 2 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreate(trimmedName, description.trim() || undefined, joinMode);
      onClose();
    } catch (err: any) {
      setError(err?.message || "We couldn't create the circle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-circle-title"
    >
      <div className="relative w-full max-w-lg bg-[#FFFAF3] rounded-3xl border border-[#FFE5BF] shadow-2xl p-6 sm:p-8 text-[#171515] overflow-hidden">
        {/* Top Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F62440]" />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF2DB] border border-[#FFE5BF] flex items-center justify-center text-[#F62440]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="create-circle-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#171515]"
                style={{ fontFamily: 'DM Serif Display, serif' }}
              >
                Create a Trusted Circle
              </h2>
              <p className="text-xs sm:text-sm text-[#171515]/70">
                Choose the people who will know when safety matters.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-[#171515]/50 hover:text-[#171515] hover:bg-[#FFF2DB] transition-colors disabled:opacity-40"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#171515]/70 mb-1.5">
              Circle Name <span className="text-[#F62440]">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Family, Close Friends, Roommates"
              disabled={isSubmitting}
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#FFE5BF] focus:outline-none focus:ring-2 focus:ring-[#F62440] text-sm text-[#171515] placeholder-[#171515]/30 transition-all disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#171515]/70 mb-1.5">
              Optional Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Emergency safety guardian circle"
              disabled={isSubmitting}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#FFE5BF] focus:outline-none focus:ring-2 focus:ring-[#F62440] text-sm text-[#171515] placeholder-[#171515]/30 transition-all disabled:opacity-50"
            />
          </div>

          {/* Join Mode Selection */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#171515]/70 mb-2">
              Membership Approval
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setJoinMode('APPROVAL_REQUIRED')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  joinMode === 'APPROVAL_REQUIRED'
                    ? 'bg-[#FFF2DB] border-[#F62440] ring-1 ring-[#F62440]'
                    : 'bg-white border-[#FFE5BF] hover:bg-[#FFF2DB]/50'
                }`}
              >
                <Lock className={`w-4 h-4 mt-0.5 shrink-0 ${joinMode === 'APPROVAL_REQUIRED' ? 'text-[#F62440]' : 'text-[#171515]/50'}`} />
                <div>
                  <div className="text-xs font-bold text-[#171515]">Require Approval</div>
                  <div className="text-[11px] text-[#171515]/70">You approve every member before they join. (Recommended)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setJoinMode('OPEN')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  joinMode === 'OPEN'
                    ? 'bg-[#FFF2DB] border-[#F62440] ring-1 ring-[#F62440]'
                    : 'bg-white border-[#FFE5BF] hover:bg-[#FFF2DB]/50'
                }`}
              >
                <UserCheck className={`w-4 h-4 mt-0.5 shrink-0 ${joinMode === 'OPEN' ? 'text-[#F62440]' : 'text-[#171515]/50'}`} />
                <div>
                  <div className="text-xs font-bold text-[#171515]">Direct Join</div>
                  <div className="text-[11px] text-[#171515]/70">Anyone with your private code joins immediately.</div>
                </div>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-[#FFF2DB]/60 rounded-xl border border-[#FFE5BF]/60 text-[11px] text-[#171515]/70 leading-relaxed">
            <span className="font-semibold text-[#171515]">Privacy Guarantee:</span> Creating a circle never activates continuous tracking. Members only receive alerts when an emergency or explicit help action is triggered.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#FFE5BF] text-xs font-semibold text-[#171515]/80 hover:bg-[#FFF2DB] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#F62440] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#dc1d36] transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>CREATING YOUR CIRCLE...</span>
                </>
              ) : (
                <span>CREATE CIRCLE →</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
