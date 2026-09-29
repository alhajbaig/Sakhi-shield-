// Walk With Me - Multi-Tab Leader Election Coordinator
// Guarantees only ONE browser tab runs active hardware GPS watching per journey

import { generateSecureId } from '../lib/securityUtils';

type TabRole = 'LEADER' | 'PASSIVE';

interface LeaderMessage {
  type: 'HEARTBEAT' | 'CLAIM_LEADERSHIP' | 'RELEASE_LEADERSHIP' | 'SYNC_STATE';
  tabId: string;
  timestamp: number;
  payload?: Record<string, unknown>;
}

class JourneyLeaderCoordinator {
  private channel: BroadcastChannel | null = null;
  private tabId: string;
  private role: TabRole = 'LEADER';
  private hasEstablishedLeadership = false;
  private lastLeaderHeartbeat = 0;
  private heartbeatInterval: number | null = null;
  private checkInterval: number | null = null;
  private onRoleChangeCallbacks: Set<(role: TabRole) => void> = new Set();
  private beforeUnloadHandler: (() => void) | null = null;

  constructor() {
    this.tabId = generateSecureId('tab');
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('sakhishield_journey_leader');
        this.channel.onmessage = (e) => this.handleMessage(e.data);
      } catch {
        // Fallback for environments blocking BroadcastChannel
      }
    }
  }

  public getRole(): TabRole {
    return this.role;
  }

  public isLeader(): boolean {
    return this.role === 'LEADER';
  }

  public onRoleChange(callback: (role: TabRole) => void): () => void {
    this.onRoleChangeCallbacks.add(callback);
    callback(this.role);
    return () => this.onRoleChangeCallbacks.delete(callback);
  }

  public startCoordination(): void {
    if (!this.channel) return;

    // Probe for existing leader
    this.channel.postMessage({
      type: 'CLAIM_LEADERSHIP',
      tabId: this.tabId,
      timestamp: Date.now(),
    } as LeaderMessage);

    // After 600ms without receiving a heartbeat from an existing leader, establish leadership
    setTimeout(() => {
      if (this.role === 'LEADER') {
        this.hasEstablishedLeadership = true;
      }
    }, 600);

    // Heartbeat every 2 seconds
    this.heartbeatInterval = window.setInterval(() => {
      if (this.role === 'LEADER') {
        this.channel?.postMessage({
          type: 'HEARTBEAT',
          tabId: this.tabId,
          timestamp: Date.now(),
        } as LeaderMessage);
      }
    }, 2000);

    // Watch for leader loss (failover promotion)
    this.checkInterval = window.setInterval(() => {
      if (this.role === 'PASSIVE') {
        const elapsed = Date.now() - this.lastLeaderHeartbeat;
        if (elapsed > 5000) {
          // Leader died or was closed, promote this tab
          this.setRole('LEADER');
          this.hasEstablishedLeadership = true;
          this.channel?.postMessage({
            type: 'CLAIM_LEADERSHIP',
            tabId: this.tabId,
            timestamp: Date.now(),
          } as LeaderMessage);
        }
      }
    }, 2500);

    this.beforeUnloadHandler = () => this.release();
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  public release(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.role === 'LEADER' && this.channel) {
      this.channel.postMessage({
        type: 'RELEASE_LEADERSHIP',
        tabId: this.tabId,
        timestamp: Date.now(),
      } as LeaderMessage);
    }

    this.hasEstablishedLeadership = false;

    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      this.beforeUnloadHandler = null;
    }
  }

  private handleMessage(msg: LeaderMessage): void {
    if (msg.tabId === this.tabId) return;

    switch (msg.type) {
      case 'HEARTBEAT':
        this.lastLeaderHeartbeat = Date.now();
        if (this.role === 'LEADER') {
          // If we haven't established leadership yet, yield immediately to existing active leader
          if (!this.hasEstablishedLeadership) {
            this.setRole('PASSIVE');
          } else if (msg.tabId < this.tabId) {
            // Deterministic tie-breaker if two established leaders conflict
            this.setRole('PASSIVE');
          }
        }
        break;

      case 'CLAIM_LEADERSHIP':
        if (this.role === 'LEADER') {
          // Reply immediately with heartbeat to assert active leadership to new tab
          this.channel?.postMessage({
            type: 'HEARTBEAT',
            tabId: this.tabId,
            timestamp: Date.now(),
          } as LeaderMessage);
        }
        break;

      case 'RELEASE_LEADERSHIP':
        // Previous leader explicitly stepped down
        this.setRole('LEADER');
        this.hasEstablishedLeadership = true;
        break;
    }
  }

  private setRole(newRole: TabRole): void {
    if (this.role !== newRole) {
      this.role = newRole;
      this.onRoleChangeCallbacks.forEach((cb) => cb(newRole));
    }
  }
}

export const journeyLeaderCoordinator = new JourneyLeaderCoordinator();
