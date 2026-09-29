import React, { useState } from 'react';
import { Copy, Check, Share2, RefreshCw, AlertTriangle, KeyRound } from 'lucide-react';
import type { TrustedCircle } from '../../types/trustedCircle';

interface CircleInviteCardProps {
  circle: TrustedCircle;
  isOwner: boolean;
  onRegenerateCode: () => Promise<string>;
}

export const CircleInviteCard: React.FC<CircleInviteCardProps> = ({
  circle,
  isOwner,
  onRegenerateCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);
  const [regenError, setRegenError] = useState<string | null>(null);

  const inviteMessage = `You've been invited to join my SakhiShield Trusted Circle.\n\nCircle code:\n${circle.invite_code}\n\nJoin through SakhiShield at ${typeof window !== 'undefined' ? window.location.origin : ''}/trusted-circle`;

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(circle.invite_code);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = circle.invite_code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Join my SakhiShield Circle: ${circle.name}`,
          text: inviteMessage,
        });
      } catch (err: any) {
        // Fallback to copy if user aborted or share failed
        if (err.name !== 'AbortError') {
          handleCopyCode();
        }
      }
    } else {
      // Fallback
      handleCopyCode();
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      setRegenError(null);
      await onRegenerateCode();
      setShowRegenConfirm(false);
    } catch (err: any) {
      setRegenError(err?.message || 'Failed to regenerate invitation code.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-[#FFF2DB]/50 rounded-3xl border border-[#FFE5BF] p-5 sm:p-6 text-[#171515] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#FFE5BF] flex items-center justify-center text-[#171515] shrink-0">
            <KeyRound className="w-5 h-5 text-[#F62440]" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#171515]/60">
              Private Invitation Code
            </div>
            <div className="text-sm font-semibold text-[#171515]">
              Share with trusted family or friends
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyCode}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white border border-[#FFE5BF] text-xs font-bold text-[#171515] hover:bg-[#FFF2DB] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            aria-label="Copy invitation code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#171515]/70" />
                <span>COPY CODE</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white border border-[#FFE5BF] text-xs font-bold text-[#171515] hover:bg-[#FFF2DB] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            aria-label="Share invitation via apps"
          >
            <Share2 className="w-3.5 h-3.5 text-[#171515]/70" />
            <span>SHARE</span>
          </button>

          {isOwner && (
            <button
              onClick={() => setShowRegenConfirm(true)}
              className="px-2.5 py-2 rounded-xl bg-white border border-[#FFE5BF] text-xs font-semibold text-[#171515]/70 hover:text-[#F62440] hover:bg-[#FFF2DB] transition-colors"
              title="Regenerate code"
              aria-label="Regenerate code"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Code Display Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-[#FFE5BF] gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#171515]/60 uppercase tracking-widest">
            CODE:
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-widest text-[#171515] select-all">
            {circle.invite_code}
          </span>
        </div>

        <div className="text-[11px] text-[#171515]/60 text-center sm:text-right">
          Mode: <span className="font-semibold text-[#171515]">{circle.join_mode === 'APPROVAL_REQUIRED' ? 'Owner Approval Required' : 'Direct Join'}</span>
        </div>
      </div>

      {/* Regenerate Confirmation Modal/Popover */}
      {showRegenConfirm && (
        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[#171515] text-xs space-y-2.5 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Regenerate Invitation Code?</span>
          </div>
          <p className="text-[#171515]/80 leading-relaxed">
            The previous code will stop working immediately. Existing circle members will remain members, but any unaccepted invites will become invalid.
          </p>
          {regenError && (
            <div className="p-2 bg-red-100 border border-red-200 text-red-700 text-[11px] rounded-lg">
              {regenError}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setShowRegenConfirm(false)}
              disabled={isRegenerating}
              className="px-3 py-1.5 rounded-lg border border-[#FFE5BF] bg-white text-xs font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-3 py-1.5 rounded-lg bg-[#F62440] text-white text-xs font-bold hover:bg-[#dc1d36] transition-colors flex items-center gap-1.5"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Regenerating...</span>
                </>
              ) : (
                <span>Confirm & Regenerate</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
