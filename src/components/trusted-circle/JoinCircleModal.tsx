import React, { useState, useEffect, useRef } from 'react';
import { X, KeyRound, Loader2, CheckCircle2, Clock } from 'lucide-react';
import type { TrustedCircle } from '../../types/trustedCircle';

interface JoinCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => Promise<{ circle: TrustedCircle; isPending: boolean }>;
}

export const JoinCircleModal: React.FC<JoinCircleModalProps> = ({
  isOpen,
  onClose,
  onJoin,
}) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    circle: TrustedCircle;
    isPending: boolean;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setSuccessInfo(null);
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep it clean: uppercase, no spaces, letters/numbers/hyphens only
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCode(val);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (!cleanCode) {
      setError('Please enter a circle invitation code.');
      return;
    }

    // Seamlessly normalize prefix if omitted by user
    if (!cleanCode.startsWith('SC-')) {
      if (cleanCode.startsWith('SC')) {
        cleanCode = 'SC-' + cleanCode.slice(2);
      } else {
        cleanCode = 'SC-' + cleanCode;
      }
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await onJoin(cleanCode);
      setSuccessInfo(res);
      // Auto-close on direct approval after brief delay
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err?.message || "That circle code isn't valid. Please verify and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-circle-title"
    >
      <div className="relative w-full max-w-md bg-[#FFFAF3] rounded-3xl border border-[#FFE5BF] shadow-2xl p-6 sm:p-8 text-[#171515] overflow-hidden">
        {/* Top Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#171515]" />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF2DB] border border-[#FFE5BF] flex items-center justify-center text-[#171515]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="join-circle-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#171515]"
                style={{ fontFamily: 'DM Serif Display, serif' }}
              >
                Join a Trusted Circle
              </h2>
              <p className="text-xs sm:text-sm text-[#171515]/70">
                Enter the private code shared with you.
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

        {/* Success Feedback */}
        {successInfo ? (
          <div className="py-6 text-center space-y-3">
            {successInfo.isPending ? (
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
            ) : (
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            <h3 className="text-lg font-bold text-[#171515]">
              {successInfo.isPending ? 'Request Submitted' : `Joined ${successInfo.circle.name}`}
            </h3>
            <p className="text-xs text-[#171515]/70 max-w-xs mx-auto">
              {successInfo.isPending
                ? 'Your request is waiting for approval from the circle owner.'
                : 'You are now an active guardian in this Trusted Circle.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#171515]/70 mb-1.5">
                Invitation Code
              </label>
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={handleInputChange}
                placeholder="SC-7K4P9X"
                disabled={isSubmitting}
                maxLength={14}
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#FFE5BF] focus:outline-none focus:ring-2 focus:ring-[#171515] text-base font-mono font-bold tracking-widest text-center text-[#171515] placeholder-[#171515]/30 uppercase transition-all disabled:opacity-50"
                required
              />
              <p className="mt-1.5 text-[11px] text-[#171515]/60 text-center">
                Format: <span className="font-mono font-medium">SC-XXXXXX</span> (case-insensitive)
              </p>
            </div>

            <div className="p-3 bg-[#FFF2DB]/60 rounded-xl border border-[#FFE5BF]/60 text-[11px] text-[#171515]/70 leading-relaxed">
              <span className="font-semibold text-[#171515]">Consensual Network:</span> You will only be alerted if a member triggers an active emergency or explicit help call.
            </div>

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
                disabled={isSubmitting || !code.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#171515] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-black transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CHECKING CODE...</span>
                  </>
                ) : (
                  <span>JOIN CIRCLE →</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
