// Walk With Me - Continuous Monitoring Health Service
// Evaluates system capability across GPS, Network, Database, Push, Visibility, and Device

import type {
  MonitoringHealthStatus,
  OverallMonitoringState,
  GPSHealth,
  NetworkHealth,
  DatabaseHealth,
  NotificationHealth,
  ServiceWorkerHealth,
  AppVisibility,
  DeviceCapability,
} from '../types/safety';

type HealthListener = (status: MonitoringHealthStatus) => void;

class MonitoringHealthService {
  private listeners: Set<HealthListener> = new Set();
  private status: MonitoringHealthStatus;
  private onlineHandler: (() => void) | null = null;
  private offlineHandler: (() => void) | null = null;
  private visibilityHandler: (() => void) | null = null;
  private isInitialized = false;

  constructor() {
    this.status = {
      overall: 'FULL',
      gps: 'GOOD',
      network: typeof navigator !== 'undefined' && !navigator.onLine ? 'OFFLINE' : 'ONLINE',
      map: 'HEALTHY',
      database: 'HEALTHY',
      notifications: 'AVAILABLE',
      serviceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? 'ACTIVE' : 'UNSUPPORTED',
      visibility: typeof document !== 'undefined' && document.visibilityState === 'hidden' ? 'BACKGROUND' : 'VISIBLE',
      device: this.detectDevice(),
      userMessage: 'Monitoring active',
      lastChecked: Date.now(),
    };
  }

  /**
   * Lazily attach global event listeners only when the first subscriber connects.
   * This avoids holding background references when no one is listening.
   */
  private ensureInitialized(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    this.onlineHandler = () => this.updateNetwork('ONLINE');
    this.offlineHandler = () => this.updateNetwork('OFFLINE');
    this.visibilityHandler = () => {
      this.updateVisibility(document.visibilityState === 'visible' ? 'VISIBLE' : 'BACKGROUND');
    };

    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  /**
   * Detach global event listeners when no subscribers remain.
   */
  private maybeCleanup(): void {
    if (this.listeners.size > 0 || !this.isInitialized) return;
    this.isInitialized = false;

    if (this.onlineHandler) window.removeEventListener('online', this.onlineHandler);
    if (this.offlineHandler) window.removeEventListener('offline', this.offlineHandler);
    if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.onlineHandler = null;
    this.offlineHandler = null;
    this.visibilityHandler = null;
  }

  public getStatus(): MonitoringHealthStatus {
    return { ...this.status };
  }

  public subscribe(listener: HealthListener): () => void {
    this.ensureInitialized();
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
      this.maybeCleanup();
    };
  }

  // --- Subsystem Updates ---

  public updateGPS(health: GPSHealth): void {
    this.status.gps = health;
    this.recomputeOverall();
  }

  public updateNetwork(health: NetworkHealth): void {
    this.status.network = health;
    this.recomputeOverall();
  }

  public updateDatabase(health: DatabaseHealth): void {
    this.status.database = health;
    this.recomputeOverall();
  }

  public updateNotifications(health: NotificationHealth): void {
    this.status.notifications = health;
    this.recomputeOverall();
  }

  public updateVisibility(visibility: AppVisibility): void {
    this.status.visibility = visibility;
    this.recomputeOverall();
  }

  public updateServiceWorker(health: ServiceWorkerHealth): void {
    this.status.serviceWorker = health;
    this.recomputeOverall();
  }

  private detectDevice(): DeviceCapability {
    if (typeof navigator === 'undefined') return 'DESKTOP';
    const ua = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'TABLET';
    if (/mobile|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'MOBILE';
    return 'DESKTOP';
  }

  private recomputeOverall(): void {
    let overall: OverallMonitoringState = 'FULL';
    let userMessage = 'Monitoring active';

    if (this.status.gps === 'UNAVAILABLE') {
      overall = 'LIMITED';
      userMessage = 'Location signal temporarily unavailable — retrying lock';
    } else if (this.status.gps === 'POOR' || this.status.gps === 'DEGRADED') {
      overall = 'DEGRADED';
      userMessage = 'Location accuracy reduced — filtering position signals';
    }

    if (this.status.network === 'OFFLINE') {
      overall = overall === 'LIMITED' ? 'LIMITED' : 'OFFLINE';
      userMessage = 'Connection lost — monitoring and queuing locally';
    } else if (this.status.database === 'BUFFERED_LOCAL') {
      if (overall === 'FULL') overall = 'DEGRADED';
      userMessage = 'Cloud sync buffered — events saved securely on-device';
    }

    if (this.status.visibility === 'BACKGROUND') {
      if (overall === 'FULL') overall = 'DEGRADED';
      userMessage = 'Screen in background — browser may limit periodic GPS checks';
    }

    this.status = {
      ...this.status,
      overall,
      userMessage,
      lastChecked: Date.now(),
    };

    this.notifyListeners();
  }

  private notifyListeners(): void {
    const current = this.getStatus();
    this.listeners.forEach((listener) => listener(current));
  }
}

export const monitoringHealthService = new MonitoringHealthService();
