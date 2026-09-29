// SakhiShield — Web Audio API Synthesizer
// Provides synthesized tones for notification chime and emergency siren tests with zero asset dependencies.

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Plays a synthesized gentle notification chime
 */
export function playNotificationChime(volumePercent: number = 80): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    const gainNode = ctx.createGain();
    const normalizedVol = Math.max(0, Math.min(1, volumePercent / 100)) * 0.3; // safe max gain
    gainNode.gain.setValueAtTime(normalizedVol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    // Two-tone bell harmonic
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.15); // E6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, ctx.currentTime); // A4

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);

    osc1.stop(ctx.currentTime + 0.65);
    osc2.stop(ctx.currentTime + 0.65);

    return true;
  } catch (err) {
    console.warn('[AudioSynthesizer] Unable to synthesize chime:', err);
    return false;
  }
}

/**
 * Plays a brief 1-second synthesized emergency alert siren preview
 */
export function playEmergencySirenPreview(volumePercent: number = 80): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    const gainNode = ctx.createGain();
    const normalizedVol = Math.max(0, Math.min(1, volumePercent / 100)) * 0.4;
    gainNode.gain.setValueAtTime(normalizedVol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';

    // Warbling dual-tone pitch modulation
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.linearRampToValueAtTime(950, now + 0.3);
    osc.frequency.linearRampToValueAtTime(750, now + 0.6);
    osc.frequency.linearRampToValueAtTime(950, now + 0.9);
    osc.frequency.linearRampToValueAtTime(750, now + 1.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);

    return true;
  } catch (err) {
    console.warn('[AudioSynthesizer] Unable to synthesize siren:', err);
    return false;
  }
}
