// SakhiShield — Emergency Audio Manager
// High-priority audible emergency siren with Web Audio API, autoplay policy detection, and haptics

class EmergencyAudioManager {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private isAudioPlaying = false;
  private isBlockedByAutoplay = false;
  private activeAlertId: string | null = null;
  private vibrationInterval: any = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    return this.audioCtx;
  }

  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  public isAutoplayBlocked(): boolean {
    return this.isBlockedByAutoplay;
  }

  public getActiveAlertId(): string | null {
    return this.activeAlertId;
  }

  /**
   * Start high-urgency emergency siren tone.
   * Returns true if audio started successfully, false if blocked by browser autoplay policy.
   */
  public async playSiren(alertId: string): Promise<boolean> {
    // Duplicate audio protection: if already playing this alert, do not restart
    if (this.isAudioPlaying && this.activeAlertId === alertId) {
      return true;
    }

    this.stopSiren();
    this.activeAlertId = alertId;

    const ctx = this.getAudioContext();
    if (!ctx) {
      return false;
    }

    // Handle browser autoplay policy
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        this.isBlockedByAutoplay = true;
        return false;
      }
    }

    if (ctx.state === 'suspended') {
      this.isBlockedByAutoplay = true;
      return false;
    }

    try {
      // 1. Create main sound oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // 2. Create LFO for two-tone emergency warble (waa-waa warble at 2.5Hz between 800Hz and 1150Hz)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      lfo.frequency.setValueAtTime(2.5, ctx.currentTime); // 2.5 oscillations per second
      lfoGain.gain.setValueAtTime(175, ctx.currentTime); // +/- 175 Hz depth around 975Hz

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(975, ctx.currentTime);

      // Safe, prominent volume with smooth fade-in
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc.start();

      this.oscillator = osc;
      this.gainNode = gain;
      this.lfo = lfo;
      this.lfoGain = lfoGain;
      this.isAudioPlaying = true;
      this.isBlockedByAutoplay = false;

      // 3. Vibration Haptic pulses
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([400, 200, 400, 200, 600]);
          if (this.vibrationInterval) clearInterval(this.vibrationInterval);
          this.vibrationInterval = setInterval(() => {
            if (this.isAudioPlaying) {
              navigator.vibrate([400, 200, 400, 200, 600]);
            }
          }, 2500);
        } catch {}
      }

      return true;
    } catch (err) {
      console.warn('[EmergencyAudioManager] Autoplay blocked or AudioContext error:', err);
      this.isBlockedByAutoplay = true;
      return false;
    }
  }

  /**
   * User interaction unlocker: when user taps anywhere on the alert UI, resume and play
   */
  public async unlockAndPlay(alertId: string): Promise<boolean> {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }
    return this.playSiren(alertId);
  }

  /**
   * Stop emergency siren and release audio nodes immediately
   */
  public stopSiren(): void {
    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch {}
    }

    if (this.gainNode && this.audioCtx) {
      try {
        this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      } catch {}
    }

    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {}
      this.oscillator = null;
    }

    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch {}
      this.lfo = null;
    }

    if (this.lfoGain) {
      try {
        this.lfoGain.disconnect();
      } catch {}
      this.lfoGain = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }

    this.isAudioPlaying = false;
    this.isBlockedByAutoplay = false;
    this.activeAlertId = null;
  }
}

export const emergencyAudioManager = new EmergencyAudioManager();
