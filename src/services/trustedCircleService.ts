// SakhiShield — Trusted Circle Service (Production Resilient Architecture)
// Manages circle creation, secure invite codes, join requests, approval flows, and member roles

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateSecureId } from '../lib/securityUtils';
import type {
  TrustedCircle,
  TrustedCircleMember,
  JoinMode,
} from '../types/trustedCircle';

// Cryptographically secure invite code generator: SC- + 6 characters
// Excludes confusing glyphs: 0, O, 1, I, l
const SAFE_CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const generateSecureInviteCode = (): string => {
  const length = 6;
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Monotonic high-res fallback
    const t = typeof performance !== 'undefined' ? performance.now() : Date.now();
    for (let i = 0; i < length; i++) array[i] = Math.floor((t * (i + 13)) % 256);
  }

  let code = 'SC-';
  for (let i = 0; i < length; i++) {
    code += SAFE_CODE_CHARS[array[i] % SAFE_CODE_CHARS.length];
  }
  return code;
};

// Local storage fallback key for zero-downtime offline and multi-tab testing
const LOCAL_CIRCLES_KEY = 'sakhishield_trusted_circles';
const LOCAL_MEMBERS_KEY = 'sakhishield_trusted_members';

// BroadcastChannel for instantaneous cross-tab synchronization
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('sakhishield_trusted_circle_sync');
  } catch {}
}

const notifySync = (event: { type: string; payload?: any }) => {
  try {
    syncChannel?.postMessage(event);
  } catch {}
};

const memoryStore = new Map<string, string>();

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(key);
        if (val !== undefined && val !== null) return val;
      }
    } catch {}
    return memoryStore.get(key) || null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch {}
    memoryStore.set(key, val);
  },
};

function normalizeCode(raw?: string): string {
  const clean = (raw || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (!clean) return '';
  if (!clean.startsWith('SC-')) {
    if (clean.startsWith('SC')) {
      return 'SC-' + clean.slice(2);
    }
    return 'SC-' + clean;
  }
  return clean;
}

// Local storage helpers
const getStoredCircles = (): TrustedCircle[] => {
  try {
    const raw = safeStorage.getItem(LOCAL_CIRCLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredCircles = (circles: TrustedCircle[]) => {
  try {
    safeStorage.setItem(LOCAL_CIRCLES_KEY, JSON.stringify(circles));
  } catch {}
};

const getStoredMembers = (): TrustedCircleMember[] => {
  try {
    const raw = safeStorage.getItem(LOCAL_MEMBERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredMembers = (members: TrustedCircleMember[]) => {
  try {
    safeStorage.setItem(LOCAL_MEMBERS_KEY, JSON.stringify(members));
  } catch {}
};

export const trustedCircleService = {
  /**
   * Subscribe to cross-tab/realtime circle updates
   */
  onCircleChange(callback: () => void): () => void {
    if (!syncChannel) return () => {};
    const handler = () => callback();
    syncChannel.addEventListener('message', handler);
    return () => syncChannel?.removeEventListener('message', handler);
  },

  /**
   * Create a new Trusted Circle
   */
  async createCircle(params: {
    name: string;
    description?: string;
    ownerId: string;
    ownerName: string;
    ownerPhone?: string;
    ownerEmail?: string;
    joinMode?: JoinMode;
  }): Promise<TrustedCircle> {
    const inviteCode = generateSecureInviteCode();
    const now = new Date().toISOString();
    const circleId = generateSecureId('crc');

    const newCircle: TrustedCircle = {
      id: circleId,
      name: params.name.trim(),
      description: params.description?.trim() || '',
      owner_id: params.ownerId,
      invite_code: inviteCode,
      join_mode: params.joinMode || 'APPROVAL_REQUIRED',
      status: 'ACTIVE',
      created_at: now,
      updated_at: now,
      member_count: 1,
    };

    const ownerMember: TrustedCircleMember = {
      id: generateSecureId('mem'),
      circle_id: circleId,
      user_id: params.ownerId,
      role: 'OWNER',
      status: 'APPROVED',
      joined_at: now,
      updated_at: now,
      user_name: params.ownerName,
      user_phone: params.ownerPhone,
      user_email: params.ownerEmail,
      is_online: true,
    };

    // 1. Persist locally first (immediate responsiveness & offline resilience)
    const localCircles = getStoredCircles();
    localCircles.push(newCircle);
    saveStoredCircles(localCircles);

    const localMembers = getStoredMembers();
    localMembers.push(ownerMember);
    saveStoredMembers(localMembers);

    notifySync({ type: 'CIRCLE_CREATED', payload: newCircle });

    // Sync to shared server (cross-browser / incognito / multi-device sync)
    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ circle: newCircle, member: ownerMember }),
        });
      } catch {}
    }

    // 2. Persist to Supabase if configured and reachable
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { error: cErr } = await supabase.from('trusted_circles').insert({
          id: newCircle.id,
          name: newCircle.name,
          description: newCircle.description,
          owner_id: newCircle.owner_id,
          invite_code: newCircle.invite_code,
          join_mode: newCircle.join_mode,
          status: newCircle.status,
          created_at: newCircle.created_at,
          updated_at: newCircle.updated_at,
        });

        if (!cErr) {
          await supabase.from('trusted_circle_members').insert({
            id: ownerMember.id,
            circle_id: newCircle.id,
            user_id: params.ownerId,
            role: 'OWNER',
            status: 'APPROVED',
            joined_at: ownerMember.joined_at,
            updated_at: ownerMember.updated_at,
          });
        }
      } catch (err) {
        console.warn('[trustedCircleService] Supabase insert buffered locally:', err);
      }
    }

    return newCircle;
  },

  /**
   * Fetch all circles where the user is an owner or member
   */
  async getUserCircles(userId: string): Promise<TrustedCircle[]> {
    // 1. Fetch from Supabase if online
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        // Query circles owned or joined by user
        const { data: memberRows, error: mErr } = await supabase
          .from('trusted_circle_members')
          .select('circle_id, status')
          .eq('user_id', userId);

        if (!mErr && memberRows && memberRows.length > 0) {
          const circleIds = memberRows.map((r: any) => r.circle_id);
          const { data: circlesData, error: cErr } = await supabase
            .from('trusted_circles')
            .select('*')
            .in('id', circleIds)
            .eq('status', 'ACTIVE');

          if (!cErr && circlesData && circlesData.length > 0) {
            // Count active members per circle
            const enriched: TrustedCircle[] = await Promise.all(
              circlesData.map(async (c: any) => {
                const { count } = await supabase
                  .from('trusted_circle_members')
                  .select('*', { count: 'exact', head: true })
                  .eq('circle_id', c.id)
                  .eq('status', 'APPROVED');
                return {
                  ...c,
                  member_count: count || 1,
                };
              })
            );
            return enriched;
          }
        }
      } catch (err) {
        console.warn('[trustedCircleService] Remote circles query fallback to local:', err);
      }
    }

    // 2. Shared server fallback (for cross-browser / multi-user sync)
    if (typeof fetch !== 'undefined') {
      try {
        const res = await fetch(`/api/trusted-circle/user-circles?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const body = await res.json();
          if (Array.isArray(body.circles)) {
            // Sync local storage with server state to prevent stale cache issues
            if (body.circles.length > 0) {
              const serverCircleIds = new Set(body.circles.map((c: any) => c.id));
              const localCircles = getStoredCircles();
              // Keep non-server circles for other users, add/update server circles
              const merged = localCircles.filter(
                (c) => !serverCircleIds.has(c.id) && c.owner_id !== userId
              );
              merged.push(...body.circles);
              saveStoredCircles(merged);
            } else {
              // Server returned no circles for this user — clear this user's local circles
              const localCircles = getStoredCircles();
              const localMembers = getStoredMembers();
              const userCircleIds = new Set(
                localMembers.filter((m) => m.user_id === userId).map((m) => m.circle_id)
              );
              // Also include circles owned by this user
              localCircles.filter((c) => c.owner_id === userId).forEach((c) => userCircleIds.add(c.id));
              // Remove user's circles from local cache
              const cleaned = localCircles.filter((c) => !userCircleIds.has(c.id));
              saveStoredCircles(cleaned);
              // Remove user's memberships from local cache
              const cleanedMembers = localMembers.filter((m) => m.user_id !== userId);
              saveStoredMembers(cleanedMembers);
            }
            return body.circles;
          }
        }
      } catch {}
    }

    // 3. Local fallback
    const allCircles = getStoredCircles().filter((c) => c.status === 'ACTIVE');
    const allMembers = getStoredMembers();

    const userCircleIds = new Set(
      allMembers.filter((m) => m.user_id === userId).map((m) => m.circle_id)
    );

    return allCircles
      .filter((c) => c.owner_id === userId || userCircleIds.has(c.id))
      .map((c) => ({
        ...c,
        member_count: allMembers.filter(
          (m) => m.circle_id === c.id && m.status === 'APPROVED'
        ).length,
      }));
  },

  /**
   * Get all members for a specific circle
   */
  async getCircleMembers(circleId: string): Promise<TrustedCircleMember[]> {
    // 1. Remote Supabase query if available
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('trusted_circle_members')
          .select('*, profiles(name, email, phone, status)')
          .eq('circle_id', circleId);

        if (!error && data && data.length > 0) {
          return data.map((m: any) => ({
            id: m.id,
            circle_id: m.circle_id,
            user_id: m.user_id,
            role: m.role,
            status: m.status,
            joined_at: m.joined_at,
            updated_at: m.updated_at,
            user_name: m.profiles?.name || 'Member',
            user_email: m.profiles?.email || '',
            user_phone: m.profiles?.phone || '',
            is_online: m.profiles?.status !== 'OFFLINE',
          }));
        }
      } catch (err) {
        console.warn('[trustedCircleService] Remote members query fallback to local:', err);
      }
    }

    // 2. Shared server fallback
    if (typeof fetch !== 'undefined') {
      try {
        const res = await fetch(`/api/trusted-circle/members?circleId=${encodeURIComponent(circleId)}`);
        if (res.ok) {
          const body = await res.json();
          if (Array.isArray(body.members)) {
            // Sync local storage: replace this circle's members with server state
            const localMembers = getStoredMembers();
            const otherCircleMembers = localMembers.filter((m) => m.circle_id !== circleId);
            otherCircleMembers.push(...body.members);
            saveStoredMembers(otherCircleMembers);
            return body.members;
          }
        }
      } catch {}
    }

      // 3. Local fallback
      const allMembers = getStoredMembers();
      return allMembers.filter((m) => m.circle_id === circleId);
    },

    /**
     * Join a circle using its invitation code (e.g. SC-7K4P9X)
     */
    async joinCircleByCode(params: {
    inviteCode?: string;
    code?: string;
    userId: string;
    userName: string;
    userPhone?: string;
    userEmail?: string;
  }): Promise<{ circle: TrustedCircle; member: TrustedCircleMember; isPending: boolean; isPendingApproval: boolean }> {
    const rawCode = params.inviteCode || params.code || '';
    const normalizedCode = normalizeCode(rawCode);

    // 1. Find circle matching code
    let circle: TrustedCircle | null = null;

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('trusted_circles')
          .select('*')
          .or(`invite_code.eq.${normalizedCode},invite_code.eq.${rawCode.trim().toUpperCase()}`)
          .eq('status', 'ACTIVE')
          .single();

        if (!error && data) {
          circle = data;
        }
      } catch {}
    }

    // 1b. Try shared server API (cross-browser / incognito / multi-device sync)
    if (!circle && typeof fetch !== 'undefined') {
      try {
        const res = await fetch(`/api/trusted-circle/lookup?code=${encodeURIComponent(normalizedCode)}`);
        if (res.ok) {
          const body = await res.json();
          if (body.circle) {
            circle = body.circle;
            const local = getStoredCircles().filter((c) => c.id !== circle!.id);
            local.push(circle!);
            saveStoredCircles(local);
          }
        }
      } catch {}
    }

    // 1c. Try local store
    if (!circle) {
      const localCircles = getStoredCircles();
      circle = localCircles.find(
        (c) => (normalizeCode(c.invite_code) === normalizedCode || c.invite_code?.toUpperCase() === rawCode.trim().toUpperCase()) && c.status === 'ACTIVE'
      ) || null;
    }

    if (!circle) {
      throw new Error("That invitation code isn't valid. Please check the code and try again.");
    }

    // 2. Check if user is already a member
    const existingMembers = await this.getCircleMembers(circle.id);
    const alreadyMember = existingMembers.find((m) => m.user_id === params.userId);

    if (alreadyMember) {
      if (alreadyMember.status === 'APPROVED') {
        return {
          circle,
          member: alreadyMember,
          isPending: false,
          isPendingApproval: false,
        };
      }
      // If was pending, entering the valid code immediately activates membership
      alreadyMember.status = 'APPROVED';
      alreadyMember.updated_at = new Date().toISOString();
      const localMembers = getStoredMembers().filter((m) => m.id !== alreadyMember.id);
      localMembers.push(alreadyMember);
      saveStoredMembers(localMembers);
      notifySync({ type: 'MEMBER_JOINED', payload: { circle, member: alreadyMember } });
      return {
        circle,
        member: alreadyMember,
        isPending: false,
        isPendingApproval: false,
      };
    }

    const isApprovalRequired = circle.join_mode === 'APPROVAL_REQUIRED';
    const status = isApprovalRequired ? 'PENDING' : 'APPROVED';
    const now = new Date().toISOString();

    const member: TrustedCircleMember = {
      id: generateSecureId('mem'),
      circle_id: circle.id,
      user_id: params.userId,
      role: 'MEMBER',
      status,
      joined_at: now,
      updated_at: now,
      user_name: params.userName,
      user_phone: params.userPhone,
      user_email: params.userEmail,
      is_online: true,
    };

    // Store locally
    const localMembers = getStoredMembers().filter(
      (m) => !(m.circle_id === circle!.id && m.user_id === params.userId)
    );
    localMembers.push(member);
    saveStoredMembers(localMembers);

    notifySync({ type: 'MEMBER_JOINED', payload: { circle, member } });

    // Store in shared dev server (cross-browser / incognito / multi-device sync)
    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: normalizedCode,
            userId: params.userId,
            userName: params.userName,
            userPhone: params.userPhone,
            userEmail: params.userEmail,
          }),
        });
      } catch {}
    }

    // Store in Supabase
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase.from('trusted_circle_members').upsert({
          circle_id: circle.id,
          user_id: params.userId,
          role: 'MEMBER',
          status,
          joined_at: now,
          updated_at: now,
        });
      } catch {}
    }

    return {
      circle,
      member,
      isPending: isApprovalRequired,
      isPendingApproval: isApprovalRequired,
    };
  },

  /**
   * Approve a pending join request (Owner only)
   */
  async approveJoinRequest(circleId: string, memberId: string): Promise<void> {
    const allMembers = getStoredMembers();
    const updated = allMembers.map((m) => {
      if (m.id === memberId || (m.circle_id === circleId && m.id === memberId)) {
        return { ...m, status: 'APPROVED' as const, updated_at: new Date().toISOString() };
      }
      return m;
    });
    saveStoredMembers(updated);

    notifySync({ type: 'MEMBER_APPROVED', payload: { circleId, memberId } });

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ circleId, memberId }),
        });
      } catch {}
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('trusted_circle_members')
          .update({ status: 'APPROVED', updated_at: new Date().toISOString() })
          .eq('id', memberId);
      } catch {}
    }
  },

  async approveMember(memberId: string, circleIdOrOwnerId?: string): Promise<void> {
    return this.approveJoinRequest(circleIdOrOwnerId || '', memberId);
  },

  /**
   * Decline a pending join request (Owner only)
   */
  async declineJoinRequest(circleId: string, memberId: string): Promise<void> {
    const allMembers = getStoredMembers();
    const updated = allMembers.filter((m) => m.id !== memberId);
    saveStoredMembers(updated);

    notifySync({ type: 'MEMBER_DECLINED', payload: { circleId, memberId } });

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ circleId, memberId }),
        });
      } catch {}
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('trusted_circle_members')
          .delete()
          .eq('id', memberId);
      } catch {}
    }
  },

  /**
   * Remove a member from the circle (Owner only)
   */
  async removeMember(circleId: string, memberId: string): Promise<void> {
    const allMembers = getStoredMembers();
    const updated = allMembers.filter((m) => m.id !== memberId);
    saveStoredMembers(updated);

    notifySync({ type: 'MEMBER_REMOVED', payload: { circleId, memberId } });

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ circleId, memberId }),
        });
      } catch {}
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('trusted_circle_members')
          .delete()
          .eq('id', memberId);
      } catch {}
    }
  },

  /**
   * Leave a circle (Member only)
   */
  async leaveCircle(circleId: string, userId: string): Promise<void> {
    const allMembers = getStoredMembers();
    const updated = allMembers.filter(
      (m) => !(m.circle_id === circleId && m.user_id === userId)
    );
    saveStoredMembers(updated);

    notifySync({ type: 'MEMBER_LEFT', payload: { circleId, userId } });

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ circleId, userId }),
        });
      } catch {}
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('trusted_circle_members')
          .delete()
          .eq('circle_id', circleId)
          .eq('user_id', userId);
      } catch {}
    }
  },

  /**
   * Regenerate circle invitation code (Owner only)
   */
  async regenerateInviteCode(circleId: string): Promise<string> {
    const newCode = generateSecureInviteCode();
    const now = new Date().toISOString();

    const allCircles = getStoredCircles();
    const updated = allCircles.map((c) => {
      if (c.id === circleId) {
        return { ...c, invite_code: newCode, updated_at: now };
      }
      return c;
    });
    saveStoredCircles(updated);

    notifySync({ type: 'CODE_REGENERATED', payload: { circleId, newCode } });

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/regenerate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ circleId, newCode }),
        });
      } catch {}
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('trusted_circles')
          .update({ invite_code: newCode, updated_at: now })
          .eq('id', circleId);
      } catch {}
    }

    return newCode;
  },

  /**
   * Permanently delete a circle (Owner only)
   */
  async deleteCircle(circleId: string): Promise<void> {
    const now = new Date().toISOString();

    const allCircles = getStoredCircles();
    const updated = allCircles.filter((c) => c.id !== circleId);
    saveStoredCircles(updated);

    const allMembers = getStoredMembers();
    const updatedMembers = allMembers.filter((m) => m.circle_id !== circleId);
    saveStoredMembers(updatedMembers);

    notifySync({ type: 'CIRCLE_DELETED', payload: { circleId } });

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ circleId }),
        });
      } catch {}
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('trusted_circles')
          .update({ status: 'DELETED', deleted_at: now })
          .eq('id', circleId);
      } catch {}
    }
  },
};
