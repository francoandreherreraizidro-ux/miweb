export class AudioManager {
  constructor() {
    this.context = null;
  }

  ensureContext() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
    if (this.context?.state === 'suspended') this.context.resume();
  }

  playTone(frequency, duration, type = 'sine', volume = 0.04) {
    try {
      this.ensureContext();
      if (!this.context) return;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start();
      oscillator.stop(this.context.currentTime + duration);
    } catch (error) {
      // Audio is optional; gameplay should remain fully functional.
      console.warn('Audio unavailable:', error);
    }
  }

  playJump() { this.playTone(520, 0.12, 'square', 0.025); }
  playCollision() { this.playTone(90, 0.28, 'sawtooth', 0.05); }
  playGameOver() { this.playTone(180, 0.45, 'triangle', 0.04); }
}
