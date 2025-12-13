import useSound from 'use-sound'

// Sound effect hooks
export const useSoundEffects = () => {
  const [playAchievement] = useSound('/sounds/achievement.mp3', { volume: 0.5 })
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.3 })
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 })
  const [playNotification] = useSound('/sounds/notification.mp3', { volume: 0.4 })
  const [playLevelUp] = useSound('/sounds/levelup.mp3', { volume: 0.6 })
  const [playStreak] = useSound('/sounds/streak.mp3', { volume: 0.5 })
  const [playMessage] = useSound('/sounds/message.mp3', { volume: 0.3 })
  const [playError] = useSound('/sounds/error.mp3', { volume: 0.4 })

  const sounds = {
    achievement: playAchievement,
    click: playClick,
    success: playSuccess,
    notification: playNotification,
    levelUp: playLevelUp,
    streak: playStreak,
    message: playMessage,
    error: playError
  }

  const play = (soundName) => {
    const soundEnabled = localStorage.getItem('sounds_enabled') !== 'false'
    if (soundEnabled && sounds[soundName]) {
      sounds[soundName]()
    }
  }

  return { play, sounds }
}

// Sound settings
export const soundSettings = {
  toggle: () => {
    const current = localStorage.getItem('sounds_enabled') !== 'false'
    localStorage.setItem('sounds_enabled', (!current).toString())
    return !current
  },

  isEnabled: () => {
    return localStorage.getItem('sounds_enabled') !== 'false'
  },

  setVolume: (volume) => {
    localStorage.setItem('sound_volume', volume.toString())
  },

  getVolume: () => {
    return parseFloat(localStorage.getItem('sound_volume') || '0.5')
  }
}

export default { useSoundEffects, soundSettings }
