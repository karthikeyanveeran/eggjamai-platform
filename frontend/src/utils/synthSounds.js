/**
 * Web Audio API Sound Generator
 * Creates synthetic sounds when audio files are not available
 */

class SynthSoundGenerator {
  constructor() {
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Resume audio context (required for user interaction)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Play a frequency for a duration
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.audioContext) return;
    
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Achievement sound - ascending arpeggio
  achievement() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.3), i * 80);
    });
  }

  // Level up - triumphant fanfare
  levelUp() {
    const notes = [392, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.35), i * 100);
    });
  }

  // Message received - gentle notification
  message() {
    this.playTone(800, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(1000, 0.1, 'sine', 0.15), 100);
  }

  // Message sent - quick confirmation
  messageSent() {
    this.playTone(600, 0.08, 'sine', 0.15);
  }

  // Click - subtle feedback
  click() {
    this.playTone(1200, 0.05, 'sine', 0.1);
  }

  // Success - positive confirmation
  success() {
    this.playTone(800, 0.1, 'sine', 0.25);
    setTimeout(() => this.playTone(1000, 0.15, 'sine', 0.25), 80);
  }

  // Error - alert sound
  error() {
    this.playTone(300, 0.2, 'sawtooth', 0.3);
  }

  // Notification - attention grabber
  notification() {
    this.playTone(900, 0.1, 'sine', 0.25);
    setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.25), 100);
    setTimeout(() => this.playTone(900, 0.1, 'sine', 0.2), 200);
  }

  // Streak - exciting milestone
  streak() {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.12, 'square', 0.25), i * 60);
    });
  }

  // Challenge complete - satisfying completion
  challengeComplete() {
    const notes = [659.25, 783.99, 1046.50]; // E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'triangle', 0.3), i * 90);
    });
  }

  // Mood log - calm acknowledgment
  moodLog() {
    this.playTone(700, 0.15, 'sine', 0.2);
    setTimeout(() => this.playTone(600, 0.2, 'sine', 0.15), 120);
  }

  // Breathing bell - meditation bell
  breathingBell() {
    this.playTone(528, 0.8, 'sine', 0.25); // 528 Hz - "healing frequency"
  }

  // Unlock - new feature unlocked
  unlock() {
    const notes = [400, 500, 700, 900];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'sine', 0.25), i * 50);
    });
  }

  // Whoosh - transition sound
  whoosh() {
    if (!this.audioContext) return;
    
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      200,
      this.audioContext.currentTime + 0.3
    );

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Pop - quick pop sound
  pop() {
    this.playTone(1000, 0.05, 'sine', 0.2);
  }
}

// Create singleton instance
const synthSounds = new SynthSoundGenerator();

export default synthSounds;
