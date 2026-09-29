// SakhiShield — Custom Hook: useTrustedCircle
// Manages circle state, member lists, join approval queues, and invite codes

import { useState, useEffect, useCallback, useRef } from 'react';
import { trustedCircleService } from '../services/trustedCircleService';
import type {
  TrustedCircle,
  TrustedCircleMember,
  JoinMode,
} from '../types/trustedCircle';

export interface UseTrustedCircleReturn {
  circle: TrustedCircle | null;
  members: TrustedCircleMember[];
  pendingRequests: TrustedCircleMember[];
  isLoading: boolean;
  error: string | null;
  isOwner: boolean;
  createCircle: (name: string, description?: string, joinMode?: JoinMode) => Promise<TrustedCircle>;
  joinCircle: (code: string) => Promise<{ circle: TrustedCircle; isPending: boolean }>;
  approveMember: (memberId: string) => Promise<void>;
  declineMember: (memberId: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  leaveCircle: () => Promise<void>;
  regenerateCode: () => Promise<string>;
  deleteCircle: () => Promise<void>;
  refreshCircle: () => Promise<void>;
}

export const useTrustedCircle = (
  userId: string | undefined,
  userName: string = 'User',
  userPhone?: string,
  userEmail?: string
): UseTrustedCircleReturn => {
  const [circle, setCircle] = useState<TrustedCircle | null>(null);
  const [members, setMembers] = useState<TrustedCircleMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const loadData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const circles = await trustedCircleService.getUserCircles(userId);
      if (!mountedRef.current) return;

      if (circles.length > 0) {
        const primaryCircle = circles[0];
        setCircle(primaryCircle);
        const circleMembers = await trustedCircleService.getCircleMembers(primaryCircle.id);
        if (mountedRef.current) {
          setMembers(circleMembers);
        }
      } else {
        setCircle(null);
        setMembers([]);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || 'Unable to load your Trusted Circle.');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    mountedRef.current = true;
    loadData();

    // Listen to real-time / cross-tab updates
    const unsub = trustedCircleService.onCircleChange(() => {
      loadData();
    });

    // Auto-sync polling every 2s ensures cross-window, incognito & cross-device updates sync in real time
    const pollInterval = setInterval(() => {
      loadData();
    }, 2000);

    return () => {
      mountedRef.current = false;
      unsub();
      clearInterval(pollInterval);
    };
  }, [loadData]);

  const isOwner = Boolean(circle && userId && circle.owner_id === userId);
  const pendingRequests = members.filter((m) => m.status === 'PENDING');

  const createCircle = useCallback(
    async (name: string, description?: string, joinMode: JoinMode = 'APPROVAL_REQUIRED'): Promise<TrustedCircle> => {
      if (!userId) throw new Error('Authentication required to create a circle.');
      setIsLoading(true);
      try {
        const created = await trustedCircleService.createCircle({
          name,
          description,
          ownerId: userId,
          ownerName: userName,
          ownerPhone: userPhone,
          ownerEmail: userEmail,
          joinMode,
        });
        await loadData();
        return created;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, userName, userPhone, userEmail, loadData]
  );

  const joinCircle = useCallback(
    async (code: string): Promise<{ circle: TrustedCircle; isPending: boolean }> => {
      if (!userId) throw new Error('Authentication required to join a circle.');
      setIsLoading(true);
      try {
        const result = await trustedCircleService.joinCircleByCode({
          inviteCode: code,
          userId,
          userName,
          userPhone,
          userEmail,
        });
        await loadData();
        return { circle: result.circle, isPending: result.isPendingApproval };
      } finally {
        setIsLoading(false);
      }
    },
    [userId, userName, userPhone, userEmail, loadData]
  );

  const approveMember = useCallback(
    async (memberId: string) => {
      if (!circle) return;
      await trustedCircleService.approveJoinRequest(circle.id, memberId);
      await loadData();
    },
    [circle, loadData]
  );

  const declineMember = useCallback(
    async (memberId: string) => {
      if (!circle) return;
      await trustedCircleService.declineJoinRequest(circle.id, memberId);
      await loadData();
    },
    [circle, loadData]
  );

  const removeMember = useCallback(
    async (memberId: string) => {
      if (!circle) return;
      await trustedCircleService.removeMember(circle.id, memberId);
      await loadData();
    },
    [circle, loadData]
  );

  const leaveCircle = useCallback(async () => {
    if (!circle || !userId) return;
    // Immediately clear UI state before async operation
    const circleIdToLeave = circle.id;
    setCircle(null);
    setMembers([]);
    setError(null);

    try {
      await trustedCircleService.leaveCircle(circleIdToLeave, userId);
      // Small delay to ensure server-side JSON write is flushed before next poll
      await new Promise((r) => setTimeout(r, 300));
      await loadData();
    } catch (err: any) {
      // If leave fails, reload to restore accurate state
      await loadData();
    }
  }, [circle, userId, loadData]);

  const regenerateCode = useCallback(async (): Promise<string> => {
    if (!circle) throw new Error('No active circle');
    const newCode = await trustedCircleService.regenerateInviteCode(circle.id);
    setCircle((prev) => (prev ? { ...prev, invite_code: newCode } : null));
    return newCode;
  }, [circle]);

  const deleteCircle = useCallback(async () => {
    if (!circle) return;
    // Immediately clear UI state before async operation
    const circleIdToDelete = circle.id;
    setCircle(null);
    setMembers([]);
    setError(null);

    try {
      await trustedCircleService.deleteCircle(circleIdToDelete);
      // Small delay to ensure server-side JSON write is flushed before next poll
      await new Promise((r) => setTimeout(r, 300));
      await loadData();
    } catch (err: any) {
      // If delete fails, reload to restore accurate state
      await loadData();
    }
  }, [circle, loadData]);

  return {
    circle,
    members: members.filter((m) => m.status === 'APPROVED'),
    pendingRequests,
    isLoading,
    error,
    isOwner,
    createCircle,
    joinCircle,
    approveMember,
    declineMember,
    removeMember,
    leaveCircle,
    regenerateCode,
    deleteCircle,
    refreshCircle: loadData,
  };
};
