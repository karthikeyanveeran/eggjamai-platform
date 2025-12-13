/**
 * Sound Effects Manager
 * Centralized sound management for the application
 * Uses synthetic sounds as fallback when audio files are not available
 */

import synthSounds from './synthSounds';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.5;
    this.useSynthetic = false; // Flag to use synthetic sounds
    
    // Load sound enabled state from localStorage
    const savedEnabled = localStorage.getItem('soundEnabled');
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }

    const savedVolume = localStorage.getItem('soundVolume');
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }

    // Check if we should use synthetic sounds
    const useSynth = localStorage.getItem('useSyntheticSounds');
    if (useSynth !== null) {
      this.useSynthetic = useSynth === 'true';
    }
  }

  // Preload a sound
  preload(name, url) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      // Check if audio file exists
      audio.addEventListener('error', () => {
        console.warn(`Audio file not found: ${url}, using synthetic sounds`);
        this.useSynthetic = true;
        localStorage.setItem('useSyntheticSounds', 'true');
      });
      
      this.sounds[name] = audio;
    } catch (err) {
      console.warn(`Failed to preload sound "${name}":`, err);
      this.useSynthetic = true;
    }
  }

  // Play a sound
  play(name, options = {}) {
    if (!this.enabled) return;

    // Use synthetic sounds if enabled or if audio files failed to load
    if (this.useSynthetic || !this.sounds[name]) {
      if (synthSounds[name]) {
        synthSounds[name]();
      } else {
        console.warn(`Synthetic sound "${name}" not found`);
      }
      return;
    }

    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    // Clone the audio to allow multiple simultaneous plays
    const audio = sound.cloneNode();
    audio.volume = options.volume !== undefined ? options.volume : this.volume;
    
    if (options.loop) {
      audio.loop = true;
    }

    audio.play().catch(err => {
      console.warn(`Failed to play sound "${name}":`, err);
      // Fallback to synthetic sound
      if (synthSounds[name]) {
        synthSounds[name]();
      }
    });

    return audio;
  }

  // Stop a sound
  stop(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    return this.enabled;
  }

  // Set volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundVolume', this.volume);
    
    // Update all loaded sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  // Get current volume
  getVolume() {
    return this.volume;
  }

  // Check if sounds are enabled
  isEnabled() {
    return this.enabled;
  }

  // Toggle between synthetic and audio file sounds
  toggleSynthetic() {
    this.useSynthetic = !this.useSynthetic;
    localStorage.setItem('useSyntheticSounds', this.useSynthetic);
    return this.useSynthetic;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

// Preload all sounds
soundManager.preload('achievement', '/sounds/achievement.mp3');
soundManager.preload('levelUp', '/sounds/levelup.mp3');
soundManager.preload('message', '/sounds/message.mp3');
soundManager.preload('messageSent', '/sounds/message-sent.mp3');
soundManager.preload('click', '/sounds/click.mp3');
soundManager.preload('success', '/sounds/success.mp3');
soundManager.preload('error', '/sounds/error.mp3');
soundManager.preload('notification', '/sounds/notification.mp3');
soundManager.preload('streak', '/sounds/streak.mp3');
soundManager.preload('challengeComplete', '/sounds/challenge-complete.mp3');
soundManager.preload('moodLog', '/sounds/mood-log.mp3');
soundManager.preload('breathingBell', '/sounds/breathing-bell.mp3');
soundManager.preload('unlock', '/sounds/unlock.mp3');
soundManager.preload('whoosh', '/sounds/whoosh.mp3');
soundManager.preload('pop', '/sounds/pop.mp3');

// Convenience functions
export const playSound = (name, options) => soundManager.play(name, options);
export const stopSound = (name) => soundManager.stop(name);
export const toggleSound = () => soundManager.toggle();
export const setVolume = (volume) => soundManager.setVolume(volume);
export const getVolume = () => soundManager.getVolume();
export const isSoundEnabled = () => soundManager.isEnabled();

// Specific sound effects
export const sounds = {
  achievement: () => playSound('achievement'),
  levelUp: () => playSound('levelUp'),
  message: () => playSound('message', { volume: 0.3 }),
  messageSent: () => playSound('messageSent', { volume: 0.3 }),
  click: () => playSound('click', { volume: 0.2 }),
  success: () => playSound('success'),
  error: () => playSound('error'),
  notification: () => playSound('notification', { volume: 0.4 }),
  streak: () => playSound('streak'),
  challengeComplete: () => playSound('challengeComplete'),
  moodLog: () => playSound('moodLog', { volume: 0.4 }),
  breathingBell: () => playSound('breathingBell', { volume: 0.5 }),
  unlock: () => playSound('unlock'),
  whoosh: () => playSound('whoosh', { volume: 0.3 }),
  pop: () => playSound('pop', { volume: 0.3 })
};

export default soundManager;
