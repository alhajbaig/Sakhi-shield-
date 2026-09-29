// Walk With Me - Safety Haptics & Audible Notification Utility
// Uses Vibration API and Web Audio API with strict permission/autoplay safety guards

export const triggerSafetyChime = (): void => {
  // 1. Vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([250, 100, 250, 100, 400]);
    } catch {
      // Ignore vibration error
    }
  }

  // 2. Audible notification tone via Web Audio API
  if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Autoplay or audio context permission restricted — degrade gracefully
    }
  }
};

export const triggerEmergencySiren = (): void => {
  // 1. Heavy Emergency Vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([400, 150, 400, 150, 600]);
    } catch {
      // Ignore
    }
  }

  // 2. High-urgency warble siren tone
  if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Degrade gracefully
    }
  }
};

