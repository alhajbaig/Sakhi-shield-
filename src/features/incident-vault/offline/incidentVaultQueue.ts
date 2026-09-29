// SakhiShield — Incident Vault Offline Sync Queue
// Enables offline creation of incident drafts and queues mutations for automatic replay when connectivity returns.

import { INCIDENT_VAULT_CONFIG } from '../constants/incidentVault.constants';

export interface QueuedVaultOperation {
  id: string;
  operationType: 'CREATE_INCIDENT' | 'UPDATE_INCIDENT' | 'DELETE_INCIDENT';
  entityId: string;
  payload: any;
  createdAt: string;
  retryCount: number;
}

export class IncidentVaultQueue {
  private getQueue(): QueuedVaultOperation[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(INCIDENT_VAULT_CONFIG.offline.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: QueuedVaultOperation[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(INCIDENT_VAULT_CONFIG.offline.storageKey, JSON.stringify(queue));
    } catch {}
  }

  public enqueue(op: Omit<QueuedVaultOperation, 'id' | 'createdAt' | 'retryCount'>): void {
    const queue = this.getQueue();
    // Idempotency: avoid enqueuing duplicate operations on same entity
    const existingIdx = queue.findIndex((q) => q.entityId === op.entityId && q.operationType === op.operationType);
    const item: QueuedVaultOperation = {
      ...op,
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    if (existingIdx >= 0) {
      queue[existingIdx] = item;
    } else {
      queue.push(item);
    }
    this.saveQueue(queue);
  }

  public peek(): QueuedVaultOperation[] {
    return this.getQueue();
  }

  public dequeue(id: string): void {
    const queue = this.getQueue().filter((item) => item.id !== id);
    this.saveQueue(queue);
  }

  public incrementRetry(id: string): void {
    const queue = this.getQueue().map((item) => {
      if (item.id === id) {
        return { ...item, retryCount: item.retryCount + 1 };
      }
      return item;
    });
    this.saveQueue(queue);
  }

  public clear(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(INCIDENT_VAULT_CONFIG.offline.storageKey);
  }
}

export const incidentVaultQueue = new IncidentVaultQueue();
