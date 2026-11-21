// Sounds, synthesized with WebAudio — no audio files. A chime when a
// difference is found, a low buzz for a miss, a soft note for a hint, and a
// little arpeggio when a round clears. M mutes everything.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, startIn, duration, type = 'sine', volume = 0.12) {
    if (this.muted || !this.ensure()) return;
    const now = this.ctx.currentTime + startIn;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // A satisfying two-note chime on each find.
  found() {
    this.tone(880, 0, 0.18, 'sine', 0.14);
    this.tone(1318, 0.07, 0.28, 'sine', 0.12);
  }

  // A low buzz when a click misses.
  wrong() {
    this.tone(140, 0, 0.22, 'sawtooth', 0.07);
  }

  // A soft pluck for a hint.
  hint() {
    this.tone(660, 0, 0.3, 'triangle', 0.1);
  }

  // A rising arpeggio when a round clears.
  roundClear() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.09, 0.3, 'sine', 0.12));
  }

  // A short tick when the fuse runs low.
  tick() {
    this.tone(1200, 0, 0.06, 'square', 0.04);
  }
}
