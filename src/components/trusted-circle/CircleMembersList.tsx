import React, { useState } from 'react';
import {
  Phone,
  UserX,
  LogOut,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Clock,
  Trash2,
} from 'lucide-react';
import type { TrustedCircleMember } from '../../types/trustedCircle';

interface CircleMembersListProps {
  members: TrustedCircleMember[];
  pendingRequests: TrustedCircleMember[];
  currentUserId: string;
  isOwner: boolean;
  onApprove: (memberId: string) => Promise<void>;
  onDecline: (memberId: string) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
  onLeave: () => Promise<void>;
  onDeleteCircle: () => Promise<void>;
}

export const CircleMembersList: React.FC<CircleMembersListProps> = ({
  members,
  pendingRequests,
  currentUserId,
  isOwner,
  onApprove,
  onDecline,
  onRemove,
  onLeave,
  onDeleteCircle,
}) => {
  // Confirmations
  const [memberToRemove, setMemberToRemove] = useState<TrustedCircleMember | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const activeMembers = members.filter((m) => m.status === 'APPROVED');

  const handleApprove = async (memberId: string) => {
    try {
      setActionLoadingId(memberId);
      await onApprove(memberId);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDecline = async (memberId: string) => {
    try {
      setActionLoadingId(memberId);
      await onDecline(memberId);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    try {
      setActionLoadingId(memberToRemove.id);
      await onRemove(memberToRemove.id);
      setMemberToRemove(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmLeave = async () => {
    try {
      setActionLoadingId('leave');
      await onLeave();
      setShowLeaveConfirm(false);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoadingId('delete');
      await onDeleteCircle();
      setShowDeleteConfirm(false);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Pending Join Requests Section (Only if Owner and requests exist) */}
      {isOwner && pendingRequests.length > 0 && (
        <div className="bg-amber-50/80 rounded-3xl border border-amber-200/80 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900">
              Join Requests ({pendingRequests.length})
            </h3>
          </div>

          <div className="divide-y divide-amber-200/60">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-800">
                    {(req.user_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#171515]">
                      {req.user_name || 'Anonymous User'}
                    </div>
                    <div className="text-xs text-[#171515]/60">
                      {req.user_email || 'Wants to join your circle'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecline(req.id)}
                    disabled={actionLoadingId === req.id}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={actionLoadingId === req.id}
                    className="px-4 py-1.5 rounded-xl bg-[#F62440] text-white text-xs font-bold shadow-sm hover:bg-[#dc1d36] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoadingId === req.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>APPROVING...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>APPROVE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Active Circle Members */}
      <div className="bg-white rounded-3xl border border-[#FFE5BF] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#171515] flex items-center gap-2">
              <span>Circle Members</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFF2DB] text-[11px] font-semibold text-[#171515]">
                {activeMembers.length}
              </span>
            </h3>
            <p className="text-xs text-[#171515]/60">
              Only these verified people will be notified during safety emergencies.
            </p>
          </div>

          {!isOwner && (
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Circle</span>
            </button>
          )}
        </div>

        {/* Member list */}
        <div className="divide-y divide-[#FFE5BF]/40">
          {activeMembers.map((member) => {
            const isMe = member.user_id === currentUserId;
            const isMemberOwner = member.role === 'OWNER';

            return (
              <div
                key={member.id}
                className="py-3.5 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      isMemberOwner
                        ? 'bg-[#171515] text-[#FFFAF3]'
                        : 'bg-[#FFF2DB] text-[#171515] border border-[#FFE5BF]'
                    }`}
                  >
                    {(member.user_name || 'U').charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171515]">
                        {member.user_name || 'Member'}
                      </span>
                      {isMe && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-[#FFF2DB] text-[#171515]/80">
                          You
                        </span>
                      )}
                      {isMemberOwner ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#171515] text-white">
                          Owner
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-[#171515]/50">
                          Guardian
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#171515]/60 mt-0.5">
                      {member.user_phone ? (
                        <a
                          href={`tel:${member.user_phone}`}
                          className="flex items-center gap-1 hover:text-[#F62440] transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{member.user_phone}</span>
                        </a>
                      ) : member.user_email ? (
                        <span>{member.user_email}</span>
                      ) : (
                        <span>Verified contact</span>
                      )}

                      <span className="flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.is_online !== false ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-[11px]">
                          {member.is_online !== false ? 'Available' : 'Offline'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Owner controls */}
                {isOwner && !isMe && (
                  <button
                    onClick={() => setMemberToRemove(member)}
                    className="p-2 rounded-xl text-[#171515]/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title={`Remove ${member.user_name || 'member'}`}
                    aria-label={`Remove ${member.user_name || 'member'}`}
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Owner Circle Danger Zone (Delete Circle) */}
        {isOwner && (
          <div className="pt-6 mt-6 border-t border-[#FFE5BF]/60 flex items-center justify-between text-xs">
            <span className="text-[#171515]/60">Circle Administration</span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Circle</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL: Remove Member Confirmation */}
      {memberToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-[#FFFAF3] rounded-3xl border border-[#FFE5BF] p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-300 text-red-700 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171515]">
                Remove {memberToRemove.user_name || 'this member'}?
              </h3>
              <p className="text-xs text-[#171515]/70 mt-1">
                They will immediately stop receiving your safety alerts and lose access to this circle.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMemberToRemove(null)}
                disabled={Boolean(actionLoadingId)}
                className="px-4 py-2 rounded-xl border border-[#FFE5BF] text-xs font-semibold hover:bg-[#FFF2DB]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={Boolean(actionLoadingId)}
                className="px-4 py-2 rounded-xl bg-[#F62440] text-white text-xs font-bold hover:bg-[#dc1d36] transition-colors flex items-center gap-1.5"
              >
                {actionLoadingId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Remove Member</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Leave Circle Confirmation */}
      {showLeaveConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-[#FFFAF3] rounded-3xl border border-[#FFE5BF] p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171515]">
                Leave this Trusted Circle?
              </h3>
              <p className="text-xs text-[#171515]/70 mt-1">
                You will no longer receive emergency alerts from this circle or be able to assist members.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                disabled={actionLoadingId === 'leave'}
                className="px-4 py-2 rounded-xl border border-[#FFE5BF] text-xs font-semibold hover:bg-[#FFF2DB]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                disabled={actionLoadingId === 'leave'}
                className="px-4 py-2 rounded-xl bg-[#171515] text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5"
              >
                {actionLoadingId === 'leave' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Leave Circle</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Circle Confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-[#FFFAF3] rounded-3xl border border-[#FFE5BF] p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-300 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-600">
                Permanently Delete Circle?
              </h3>
              <p className="text-xs text-[#171515]/70 mt-1">
                This will remove the circle and all active guardian links. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={actionLoadingId === 'delete'}
                className="px-4 py-2 rounded-xl border border-[#FFE5BF] text-xs font-semibold hover:bg-[#FFF2DB]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoadingId === 'delete'}
                className="px-4 py-2 rounded-xl bg-[#F62440] text-white text-xs font-bold hover:bg-[#dc1d36] transition-colors flex items-center gap-1.5"
              >
                {actionLoadingId === 'delete' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Delete Circle</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
