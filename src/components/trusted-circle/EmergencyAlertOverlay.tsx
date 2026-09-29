// SakhiShield — Full-Screen Emergency Alert Overlay (Sections 39, 43, 76, 85)
// Heavy, flashy, unmissable critical alert viewport with siren control and urgent response options

import React, { useEffect, useRef, useState } from 'react';
import {
  AlertOctagon,
  MapPin,
  CheckCircle,
  Volume2,
  VolumeX,
  Phone,
  PhoneCall,
  ExternalLink,
  Flame,
  Siren,
} from 'lucide-react';
import type { TrustedCircleAlert } from '../../types/trustedCircle';

interface EmergencyAlertOverlayProps {
  alert: TrustedCircleAlert;
  isAudioPlaying: boolean;
  isAutoplayBlocked: boolean;
  onAcknowledge: () => void | Promise<void>;
  onUnlockAudio: () => void;
}

export const EmergencyAlertOverlay: React.FC<EmergencyAlertOverlayProps> = ({
  alert,
  isAudioPlaying,
  isAutoplayBlocked,
  onAcknowledge,
  onUnlockAudio,
}) => {
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [flashState, setFlashState] = useState(false);
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  // Live timer & haptic vibration
  useEffect(() => {
    primaryButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    // Start timer from alert created_at
    const startMs = new Date(alert.created_at).getTime();
    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    };
    updateElapsed();
    const timer = setInterval(updateElapsed, 1000);

    // Flash state toggle for extra visual urgency
    const flashInterval = setInterval(() => {
      setFlashState((prev) => !prev);
    }, 800);

    // Haptic vibration pulse for mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([600, 200, 600, 200, 1000]);
      const vibInterval = setInterval(() => {
        navigator.vibrate([600, 200, 600, 200, 1000]);
      }, 4000);
      return () => {
        clearInterval(timer);
        clearInterval(flashInterval);
        clearInterval(vibInterval);
        document.body.style.overflow = '';
      };
    }

    // Intercept escape key — critical alerts MUST NOT be dismissed accidentally
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      clearInterval(flashInterval);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [alert.created_at]);

  const formattedTime = new Date(alert.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formatElapsed = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    if (min > 0) return `${min}m ${sec}s`;
    return `${sec}s`;
  };

  const hasLocation = Boolean(alert.location_shared && alert.latitude && alert.longitude);
  const recipientRecord = alert.recipients?.[0];
  const targetPhone = recipientRecord?.user_phone;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="emergency-alert-title"
      aria-describedby="emergency-alert-description"
      className="fixed inset-0 z-[9999] animate-emergency-strobe animate-emergency-bg text-[#FFFAF3] flex flex-col justify-between p-4 sm:p-8 md:p-12 overflow-y-auto select-none"
      style={{
        background: flashState
          ? 'linear-gradient(135deg, #120003 0%, #2a0008 40%, #120003 100%)'
          : 'linear-gradient(135deg, #0a0001 0%, #1a0004 40%, #0a0001 100%)',
      }}
    >
      {/* Top Hazard Warning Strobe Bar — Red/Amber alternating */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden"
        style={{
          background: flashState
            ? 'linear-gradient(90deg, #F62440 0%, #f59e0b 25%, #F62440 50%, #f59e0b 75%, #F62440 100%)'
            : 'linear-gradient(90deg, #f59e0b 0%, #F62440 25%, #f59e0b 50%, #F62440 75%, #f59e0b 100%)',
        }}
      >
        {/* Animated sweep flash */}
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-emergency-flash" />
      </div>

      {/* Bottom Strobe Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{
          background: flashState
            ? 'linear-gradient(90deg, #f59e0b 0%, #F62440 50%, #f59e0b 100%)'
            : 'linear-gradient(90deg, #F62440 0%, #f59e0b 50%, #F62440 100%)',
        }}
      />

      {/* Top Banner & Siren Control */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between border-b border-red-500/30 pb-4 pt-3">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl bg-[#F62440] flex items-center justify-center text-white shrink-0 animate-bounce"
            style={{
              boxShadow: flashState
                ? '0 0 40px #F62440, 0 0 80px rgba(246,36,64,0.4)'
                : '0 0 25px #F62440, 0 0 50px rgba(246,36,64,0.3)',
            }}
          >
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-mono text-xs uppercase tracking-widest text-[#F62440] font-black animate-emergency-glow"
              >
                🚨 CRITICAL SAFETY ALERT 🚨
              </span>
              <span
                className="px-2.5 py-1 rounded-full border-2 text-[11px] font-mono font-black tabular-nums"
                style={{
                  borderColor: flashState ? '#f59e0b' : '#F62440',
                  color: flashState ? '#fbbf24' : '#fca5a5',
                  backgroundColor: flashState ? 'rgba(245,158,11,0.15)' : 'rgba(246,36,64,0.15)',
                }}
              >
                ⏱ {formatElapsed(elapsedSeconds)} AGO
              </span>
            </div>
            <span className="font-mono text-xs text-[#A8A29E]">
              TRUSTED CIRCLE DISPATCH • {formattedTime}
            </span>
          </div>
        </div>

        {/* Siren status badge / Unmute trigger */}
        <div>
          {isAutoplayBlocked ? (
            <button
              type="button"
              onClick={onUnlockAudio}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-mono text-xs font-black flex items-center gap-2 animate-pulse transition-all cursor-pointer"
              style={{ boxShadow: '0 0 25px rgba(245,158,11,0.7)' }}
            >
              <VolumeX className="w-4 h-4 text-black" />
              <span>🔊 TAP TO PLAY SIREN</span>
            </button>
          ) : isAudioPlaying ? (
            <div
              className="px-3.5 py-2 bg-red-950/90 border-2 border-[#F62440] text-red-200 rounded-xl font-mono text-xs font-bold flex items-center gap-2"
              style={{ boxShadow: '0 0 20px rgba(246,36,64,0.6)' }}
            >
              <Volume2 className="w-4 h-4 text-[#F62440] animate-pulse" />
              <span className="animate-pulse">🔴 SIREN ACTIVE</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Flashy Core Alert Content */}
      <div className="max-w-3xl w-full mx-auto my-auto py-6 sm:py-8 text-center space-y-6">
        {/* Urgent Pulsating Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs sm:text-sm font-mono font-black uppercase tracking-wider animate-pulse"
          style={{
            background: flashState
              ? 'linear-gradient(135deg, rgba(246,36,64,0.4) 0%, rgba(245,158,11,0.3) 100%)'
              : 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(246,36,64,0.4) 100%)',
            border: `2px solid ${flashState ? '#F62440' : '#f59e0b'}`,
            color: flashState ? '#fca5a5' : '#fde68a',
            boxShadow: `0 0 25px ${flashState ? 'rgba(246,36,64,0.4)' : 'rgba(245,158,11,0.4)'}`,
          }}
        >
          <Flame className="w-5 h-5 animate-bounce" style={{ color: flashState ? '#F62440' : '#f59e0b' }} />
          <span>⚠️ IN DANGER • CHECK IMMEDIATELY ⚠️</span>
        </div>

        <div>
          <h1
            id="emergency-alert-title"
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-3 animate-emergency-glow"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            {alert.triggered_by_user_name || 'Circle Member'}
          </h1>
          <p
            id="emergency-alert-description"
            className="font-sans text-lg sm:text-2xl text-red-100 font-bold max-w-xl mx-auto leading-relaxed"
          >
            Has triggered an urgent <span className="text-[#F62440] underline decoration-wavy decoration-2 underline-offset-4">EMERGENCY SOS</span>!
            <br />
            <span className="text-amber-300 animate-pulse">They need immediate help right now!</span>
          </p>
        </div>

        {/* Transmitted Message Glow Box */}
        <div
          className="p-5 sm:p-6 rounded-3xl border-2 text-left space-y-2 max-w-xl mx-auto backdrop-blur-md"
          style={{
            background: flashState ? 'rgba(60,0,10,0.6)' : 'rgba(40,0,6,0.6)',
            borderColor: flashState ? '#F62440' : 'rgba(246,36,64,0.5)',
            boxShadow: `0 0 ${flashState ? '40px' : '20px'} rgba(246,36,64,0.25)`,
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono text-red-300 font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Siren className="w-3.5 h-3.5 animate-pulse" />
              EMERGENCY TRANSMISSION
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-black"
              style={{
                background: flashState ? 'rgba(246,36,64,0.3)' : 'rgba(245,158,11,0.3)',
                color: flashState ? '#fca5a5' : '#fde68a',
              }}
            >
              SEVERITY: CRITICAL
            </span>
          </div>
          <p className="font-mono text-base sm:text-lg text-white font-black leading-snug">
            "{alert.message || '🚨 CRITICAL SOS: I am in danger! Please check on me immediately!'}"
          </p>
        </div>

        {/* Location Box */}
        {hasLocation ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFE5BF] text-[#171515] flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-6 h-6 text-[#F62440] animate-bounce" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#A8A29E] uppercase font-bold block">
                  LIVE GPS COORDINATES
                </span>
                <span className="font-mono text-xs sm:text-sm text-white font-bold">
                  {alert.latitude?.toFixed(5)}° N, {alert.longitude?.toFixed(5)}° E
                  {alert.location_accuracy ? ` (±${Math.round(alert.location_accuracy)}m)` : ''}
                </span>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#FFE5BF] hover:bg-white text-[#171515] rounded-xl text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <span>VIEW IN GOOGLE MAPS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl max-w-xl mx-auto text-xs text-[#A8A29E] font-mono flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5 animate-pulse" />
            GPS Location acquisition in progress...
          </div>
        )}

        {/* Emergency Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-2">
          {targetPhone ? (
            <a
              href={`tel:${targetPhone}`}
              className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              style={{ boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}
            >
              <Phone className="w-4 h-4" />
              <span>CALL {alert.triggered_by_user_name?.toUpperCase() || 'MEMBER'}</span>
            </a>
          ) : (
            <a
              href="tel:112"
              className="py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>CALL POLICE / 112</span>
            </a>
          )}

          <a
            href="tel:1091"
            className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-[#F62440]" />
            <span>WOMEN HELPLINE 1091</span>
          </a>
        </div>
      </div>

      {/* Heavy Bottom Primary Action Footer */}
      <div className="max-w-3xl w-full mx-auto pt-4 border-t border-red-500/30 space-y-3">
        <button
          ref={primaryButtonRef}
          type="button"
          disabled={isAcknowledging}
          onClick={async () => {
            setIsAcknowledging(true);
            try {
              await onAcknowledge();
            } finally {
              setIsAcknowledging(false);
            }
          }}
          className="w-full py-5 sm:py-6 bg-[#F62440] hover:bg-[#d91d35] disabled:opacity-60 active:scale-[0.99] text-white rounded-3xl font-mono text-base sm:text-lg font-black transition-all flex items-center justify-center gap-3 cursor-pointer"
          style={{
            boxShadow: flashState
              ? '0 0 60px rgba(246,36,64,0.9), 0 0 120px rgba(246,36,64,0.4)'
              : '0 0 40px rgba(246,36,64,0.7), 0 0 80px rgba(246,36,64,0.3)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          {isAcknowledging ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>ACKNOWLEDGING & STOPPING SIREN...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-7 h-7" />
              <span>I'M CHECKING NOW — ACKNOWLEDGE ALERT</span>
            </>
          )}
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#A8A29E] pt-1">
          <span>ACKNOWLEDGEMENT STOPS SIREN & NOTIFIES THE ENTIRE CIRCLE</span>
          <span className="text-red-400 font-bold animate-pulse">SAKHISHIELD EMERGENCY DISPATCH</span>
        </div>
      </div>
    </div>
  );
};
