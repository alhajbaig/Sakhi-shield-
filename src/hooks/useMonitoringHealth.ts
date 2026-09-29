// Walk With Me - Custom Hook: useMonitoringHealth
// Subscribes to continuous system monitoring health signals

import { useState, useEffect } from 'react';
import { monitoringHealthService } from '../services/monitoringHealthService';
import type { MonitoringHealthStatus } from '../types/safety';

export const useMonitoringHealth = (): MonitoringHealthStatus => {
  const [health, setHealth] = useState<MonitoringHealthStatus>(() =>
    monitoringHealthService.getStatus()
  );

  useEffect(() => {
    const unsubscribe = monitoringHealthService.subscribe((status) => {
      setHealth(status);
    });
    return unsubscribe;
  }, []);

  return health;
};
