// SakhiShield — useDevicePermissions Hook

import { useState, useEffect, useCallback } from 'react';
import type { DevicePermissionState, PermissionType } from '../types/settings.types';
import { inspectBrowserPermissions, requestPermission } from '../utils/permissionChecker';

export function useDevicePermissions() {
  const [permissions, setPermissions] = useState<DevicePermissionState[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requesting, setRequesting] = useState<PermissionType | null>(null);

  const refreshPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const perms = await inspectBrowserPermissions();
      setPermissions(perms);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  const handleRequest = async (type: PermissionType) => {
    setRequesting(type);
    try {
      await requestPermission(type);
      await refreshPermissions();
    } finally {
      setRequesting(null);
    }
  };

  return {
    permissions,
    isLoading,
    requesting,
    refreshPermissions,
    requestPermission: handleRequest,
  };
}
