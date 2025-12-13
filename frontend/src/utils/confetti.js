import confetti from 'canvas-confetti';

/**
 * Enhanced Confetti Celebrations
 * Various confetti effects for different achievements and milestones
 */

// Basic confetti explosion
export const basicConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

export const triggerConfetti = basicConfetti;

// Achievement unlock - Epic celebration
export const achievementConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

// Level up - Fireworks effect
export const levelUpConfetti = () => {
  const duration = 5000;
  const animationEnd = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#667eea', '#764ba2', '#93c5fd']
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#667eea', '#764ba2', '#93c5fd']
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  }());
};

// Streak milestone - Fire effect
export const streakConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 160,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626']
  });
};

// Challenge complete - Success burst
export const challengeCompleteConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.7 },
    colors: ['#10b981', '#059669', '#6ee7b7']
  });
};

// Mood improvement - Gentle celebration
export const moodImprovementConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 50,
    origin: { y: 0.5 },
    colors: ['#93c5fd', '#60a5fa', '#3b82f6'],
    ticks: 100
  });
};

// School shapes confetti
export const schoolConfetti = () => {
  const scalar = 2;
  const star = confetti.shapeFromText({ text: '⭐', scalar });
  const trophy = confetti.shapeFromText({ text: '🏆', scalar });
  const fire = confetti.shapeFromText({ text: '🔥', scalar });

  confetti({
    shapes: [star, trophy, fire],
    particleCount: 50,
    spread: 100,
    origin: { y: 0.6 }
  });
};

// Cannon blast from sides
export const cannonConfetti = () => {
  const end = Date.now() + 2000;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#667eea', '#764ba2']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#667eea', '#764ba2']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

// Snow effect (for calm achievements)
export const snowConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: 200,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.1
      },
      colors: ['#ffffff', '#e0f2fe', '#bae6fd'],
      shapes: ['circle'],
      gravity: 0.4,
      scalar: 0.8,
      drift: 0.2
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  }());
};

// Realistic confetti
export const realisticConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Custom emoji confetti
export const emojiConfetti = (emoji = '🎉', count = 50) => {
  const scalar = 2;
  const emojiShape = confetti.shapeFromText({ text: emoji, scalar });

  confetti({
    shapes: [emojiShape],
    particleCount: count,
    spread: 100,
    origin: { y: 0.6 }
  });
};

// Pride confetti (rainbow)
export const rainbowConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
  });
};

// Continuous celebration
export const continuousConfetti = (durationMs = 5000) => {
  const end = Date.now() + durationMs;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

export default {
  basic: basicConfetti,
  achievement: achievementConfetti,
  levelUp: levelUpConfetti,
  streak: streakConfetti,
  challengeComplete: challengeCompleteConfetti,
  moodImprovement: moodImprovementConfetti,
  school: schoolConfetti,
  cannon: cannonConfetti,
  snow: snowConfetti,
  realistic: realisticConfetti,
  emoji: emojiConfetti,
  rainbow: rainbowConfetti,
  continuous: continuousConfetti
};
