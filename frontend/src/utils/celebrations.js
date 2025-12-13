import confetti from 'canvas-confetti'

// Achievement unlocked celebration
export const celebrateAchievement = (type = 'default') => {
  const celebrations = {
    default: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    },

    epic: () => {
      // Epic multi-burst
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899']
        })

        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    },

    streak: () => {
      // Flame-like effect from bottom
      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        origin: { x: 0.5, y: 1 },
        colors: ['#ff6b6b', '#ffd93d', '#ff8c42']
      })
    },

    levelUp: () => {
      // Stars explosion
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
      }

      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2
      })

      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 0.75
      })
    },

    challenge: () => {
      // Victory confetti from top
      confetti({
        particleCount: 200,
        angle: 90,
        spread: 45,
        origin: { x: 0.5, y: 0 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      })
    },

    fireworks: () => {
      // Fireworks effect
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const duration = 5000
      const end = Date.now() + duration

      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval)
        }

        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount: 150,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: Math.random() - 0.2
          }
        })
      }, 250)
    },

    hearts: () => {
      // Hearts for mood celebration
      confetti({
        particleCount: 30,
        angle: 90,
        spread: 45,
        origin: { y: 0.6 },
        shapes: ['circle'],
        colors: ['#ff6b9d', '#ffc6d9', '#ff86b5'],
        scalar: 2
      })
    }
  }

  const celebration = celebrations[type] || celebrations.default
  celebration()

  // Play achievement sound
  const audio = new Audio('/sounds/achievement.mp3')
  audio.volume = 0.5
  audio.play().catch(() => {}) // Ignore if sound blocked
}

// Points flying animation
export const animatePoints = (points, element) => {
  if (!element) return

  const pointsEl = document.createElement('div')
  pointsEl.className = 'points-animation'
  pointsEl.textContent = `+${points}`
  pointsEl.style.cssText = `
    position: fixed;
    left: ${element.offsetLeft}px;
    top: ${element.offsetTop}px;
    font-size: 2rem;
    font-weight: bold;
    color: #10b981;
    pointer-events: none;
    z-index: 9999;
    animation: pointsFloat 1.5s ease-out forwards;
  `

  document.body.appendChild(pointsEl)

  setTimeout(() => {
    pointsEl.remove()
  }, 1500)
}

// Shake animation for streaks
export const shakeScreen = () => {
  document.body.style.animation = 'shake 0.5s'
  setTimeout(() => {
    document.body.style.animation = ''
  }, 500)
}

// Particle explosion at element
export const particleExplosion = (element, color = '#6366f1') => {
  if (!element) return

  const rect = element.getBoundingClientRect()
  const x = (rect.left + rect.width / 2) / window.innerWidth
  const y = (rect.top + rect.height / 2) / window.innerHeight

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x, y },
    colors: [color]
  })
}

// Celebration presets
export const celebrations = {
  dailyCheckin: () => celebrateAchievement('default'),
  challengeComplete: () => celebrateAchievement('challenge'),
  achievementUnlock: () => celebrateAchievement('epic'),
  streakMilestone: () => celebrateAchievement('streak'),
  levelUp: () => celebrateAchievement('levelUp'),
  moodImproved: () => celebrateAchievement('hearts'),
  weeklyGoal: () => celebrateAchievement('fireworks')
}

export default {
  celebrateAchievement,
  animatePoints,
  shakeScreen,
  particleExplosion,
  celebrations
}
