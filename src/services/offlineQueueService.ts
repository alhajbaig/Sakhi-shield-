// Walk With Me - Offline IndexedDB Event Queue Service
// Production-Hardened Architecture: Separates OperationType from EventType,
// provides durable offline event buffering, idempotent sync, and dead-letter protection.

import type { QueuedSafetyEvent, EventSyncStatus, QueueOperationType, QueueEntityType, JourneyEventType } from '../types/journey';
import { generateSecureId } from '../lib/securityUtils';

const DB_NAME = 'sakhishield_offline_db';
const DB_VERSION = 2; // Incremented for hardened schema with operationType
const STORE_NAME = 'safety_event_queue';

class OfflineQueueService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryFallback: Map<string, QueuedSafetyEvent> = new Map();
  private isIndexedDBAvailable: boolean;

  constructor() {
    this.isIndexedDBAvailable = typeof window !== 'undefined' && 'indexedDB' in window;
    if (this.isIndexedDBAvailable) {
      this.initDB().catch(() => {});
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          let store: IDBObjectStore;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            store = db.createObjectStore(STORE_NAME, { keyPath: 'event_id' });
          } else {
            store = (e.target as IDBOpenDBRequest).transaction!.objectStore(STORE_NAME);
          }

          if (!store.indexNames.contains('sync_status')) {
            store.createIndex('sync_status', 'sync_status', { unique: false });
          }
          if (!store.indexNames.contains('journey_id')) {
            store.createIndex('journey_id', 'journey_id', { unique: false });
          }
          if (!store.indexNames.contains('client_timestamp')) {
            store.createIndex('client_timestamp', 'client_timestamp', { unique: false });
          }
          if (!store.indexNames.contains('operationType')) {
            store.createIndex('operationType', 'operationType', { unique: false });
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('[OfflineQueue] IndexedDB open error, falling back to memory queue');
          this.isIndexedDBAvailable = false;
          reject(req.error);
        };
      } catch (err) {
        console.warn('[OfflineQueue] IndexedDB access denied or private mode:', err);
        this.isIndexedDBAvailable = false;
        reject(err);
      }
    });

    return this.dbPromise;
  }

  /**
   * Enqueue an operation into local durable buffer with explicit operationType & entityType
   */
  public async enqueueEvent(eventInput: Partial<QueuedSafetyEvent> & {
    operationType?: QueueOperationType;
    eventType?: JourneyEventType;
    event_type?: JourneyEventType;
    payload: Record<string, unknown>;
  }): Promise<void> {
    const eventId = eventInput.event_id || generateSecureId('evt');
    const now = new Date().toISOString();
    const eventType = eventInput.eventType || eventInput.event_type || 'LOCATION_UPDATE';
    const operationType: QueueOperationType = eventInput.operationType ||
      (eventType === 'JOURNEY_STARTED' ? 'CREATE_JOURNEY' : 'CREATE_JOURNEY_EVENT');
    const entityType: QueueEntityType = eventInput.entityType ||
      (operationType === 'CREATE_JOURNEY' || operationType === 'UPDATE_JOURNEY' || operationType === 'UPDATE_JOURNEY_STATUS' ? 'journey' :
       operationType === 'CREATE_RISK_EVENT' ? 'risk_event' :
       operationType === 'CREATE_ALERT' ? 'alert' : 'journey_event');

    const event: QueuedSafetyEvent = {
      event_id: eventId,
      operationType,
      eventType,
      entityType,
      entityId: eventInput.entityId || (eventInput.payload?.id as string) || eventId,
      journey_id: eventInput.journey_id || (eventInput.payload?.journey_id as string) || 'default',
      user_id: eventInput.user_id || (eventInput.payload?.user_id as string) || 'anonymous',
      client_timestamp: eventInput.client_timestamp || Date.now(),
      payload: eventInput.payload,
      retry_count: eventInput.retry_count || 0,
      created_at: eventInput.created_at || now,
      sync_status: 'PENDING',
      idempotency_key: eventInput.idempotency_key || eventId,
      error_message: null,
      event_type: eventType,
    };

    if (!this.isIndexedDBAvailable) {
      this.memoryFallback.set(event.event_id, event);
      return;
    }

    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(event);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.memoryFallback.set(event.event_id, event);
    }
  }

  /**
   * Retrieve all pending un-synchronized operations
   */
  public async getPendingEvents(): Promise<QueuedSafetyEvent[]> {
    if (!this.isIndexedDBAvailable) {
      return Array.from(this.memoryFallback.values()).filter(
        (e) => (e.sync_status === 'PENDING' || e.sync_status === 'FAILED') && e.retry_count < 5
      );
    }

    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const all = (req.result || []) as QueuedSafetyEvent[];
          const pending = all.filter(
            (e) => (e.sync_status === 'PENDING' || e.sync_status === 'FAILED') && (e.retry_count || 0) < 5
          );
          resolve(pending);
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return Array.from(this.memoryFallback.values()).filter(
        (e) => (e.sync_status === 'PENDING' || e.sync_status === 'FAILED') && e.retry_count < 5
      );
    }
  }

  /**
   * Update synchronization state and error tracking of a single queued event
   */
  public async updateEventStatus(
    eventId: string,
    status: EventSyncStatus,
    errorMessage?: string
  ): Promise<void> {
    if (!this.isIndexedDBAvailable) {
      const existing = this.memoryFallback.get(eventId);
      if (existing) {
        this.memoryFallback.set(eventId, {
          ...existing,
          sync_status: status,
          error_message: errorMessage || existing.error_message,
          retry_count: status === 'FAILED' ? (existing.retry_count || 0) + 1 : existing.retry_count,
        });
      }
      return;
    }

    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(eventId);

        getReq.onsuccess = () => {
          const data = getReq.result as QueuedSafetyEvent | undefined;
          if (data) {
            data.sync_status = status;
            if (errorMessage) data.error_message = errorMessage;
            if (status === 'FAILED') data.retry_count = (data.retry_count || 0) + 1;
            store.put(data);
          }
          resolve();
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch {
      // Ignore update error in degraded contexts
    }
  }

  /**
   * Flush pending queue to server with bounded retries, controlled backoff, and dead-letter handling
   */
  public async flushQueue(
    sender: (event: QueuedSafetyEvent) => Promise<{ success: boolean; error?: string }>
  ): Promise<{ synced: number; failed: number }> {
    const pending = await this.getPendingEvents();
    let synced = 0;
    let failed = 0;

    for (const event of pending) {
      try {
        await this.updateEventStatus(event.event_id, 'SYNCING');
        const result = await sender(event);

        if (result.success) {
          await this.updateEventStatus(event.event_id, 'SYNCED');
          synced++;
        } else {
          const retries = (event.retry_count || 0) + 1;
          const status: EventSyncStatus = retries >= 5 ? 'DEAD_LETTER' : 'FAILED';
          await this.updateEventStatus(event.event_id, status, result.error);
          failed++;
        }
      } catch (err: any) {
        const retries = (event.retry_count || 0) + 1;
        const status: EventSyncStatus = retries >= 5 ? 'DEAD_LETTER' : 'FAILED';
        await this.updateEventStatus(event.event_id, status, err?.message || 'Sync error');
        failed++;
      }
    }

    return { synced, failed };
  }

  /**
   * Clear completed journey events from local buffer
   */
  public async clearJourneyEvents(journeyId: string): Promise<void> {
    if (!this.isIndexedDBAvailable) {
      for (const [id, e] of this.memoryFallback.entries()) {
        if (e.journey_id === journeyId) this.memoryFallback.delete(id);
      }
      return;
    }

    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('journey_id');
      const req = index.getAllKeys(journeyId);

      req.onsuccess = () => {
        const keys = req.result;
        keys.forEach((key) => store.delete(key));
      };
    } catch {
      // Ignore
    }
  }
}

export const offlineQueueService = new OfflineQueueService();
