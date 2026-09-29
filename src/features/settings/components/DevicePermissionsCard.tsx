// SakhiShield — Device Permissions Inspector Component

import React from 'react';
import { Smartphone, RefreshCw, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { DevicePermissionState, PermissionType } from '../types/settings.types';

interface DevicePermissionsCardProps {
  permissions: DevicePermissionState[];
  onRequestPermission: (type: PermissionType) => void;
  onRefresh: () => void;
  requesting: PermissionType | null;
  isLoading: boolean;
}

export const DevicePermissionsCard: React.FC<DevicePermissionsCardProps> = ({
  permissions,
  onRequestPermission,
  onRefresh,
  requesting,
  isLoading,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1C1917]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
              HARDWARE & OS CAPABILITIES
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
              Device Permissions
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="p-2 border border-[#1C1917]/15 rounded-lg text-[#57534E] hover:text-[#1C1917] hover:bg-[#FFF2DB] transition-colors cursor-pointer"
          title="Refresh hardware permission states"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <p className="font-sans text-xs text-[#57534E] leading-relaxed">
        SakhiShield inspects native browser permission APIs. We never ask for permissions unless strictly required to safeguard your transit or record evidence.
      </p>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {permissions.map((perm) => {
          const isGranted = perm.status === 'granted';
          const isDenied = perm.status === 'denied';
          const isPrompt = perm.status === 'prompt';
          const isBusy = requesting === perm.permission;

          return (
            <div
              key={perm.permission}
              className="p-4 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/40 flex flex-col justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-[#1C1917]">{perm.label}</span>
                  {isGranted ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>GRANTED</span>
                    </span>
                  ) : isDenied ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-red-800 bg-red-100 border border-red-300 px-2 py-0.5 rounded">
                      <XCircle className="w-3 h-3 text-red-600" />
                      <span>DENIED</span>
                    </span>
                  ) : isPrompt ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>NOT PROMPTED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-neutral-800 bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded">
                      <HelpCircle className="w-3 h-3 text-neutral-600" />
                      <span>UNAVAILABLE</span>
                    </span>
                  )}
                </div>

                <p className="font-sans text-[11px] text-[#57534E] leading-relaxed">
                  {perm.description}
                </p>
              </div>

              {!isGranted && perm.status !== 'unavailable' && (
                <div className="pt-2 border-t border-[#1C1917]/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onRequestPermission(perm.permission)}
                    disabled={isBusy}
                    className="px-3 py-1.5 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-[10px] font-bold hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? 'REQUESTING...' : 'REQUEST ACCESS'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
