import React, { useEffect, useRef } from 'react';
import './ParticleBackground.css';

/**
 * Particle Background Effects
 * Beautiful animated particle backgrounds
 */

export const ParticleBackground = ({ 
  particleCount = 50, 
  color = '#667eea',
  speed = 1,
  size = 2
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.radius = Math.random() * size + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `${color}${Math.floor((1 - distance / 150) * 50).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount, color, speed, size]);

  return <canvas ref={canvasRef} className="particle-background" />;
};

// Floating particles effect
export const FloatingParticles = ({ count = 20, emoji = '✨' }) => {
  return (
    <div className="floating-particles">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

// Bubble effect
export const BubbleEffect = ({ count = 15 }) => {
  return (
    <div className="bubble-effect">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 60}px`,
            height: `${20 + Math.random() * 60}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
};

// Stars background
export const StarsBackground = ({ count = 100 }) => {
  return (
    <div className="stars-background">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
};

// Gradient orbs
export const GradientOrbs = ({ count = 3 }) => {
  return (
    <div className="gradient-orbs">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="gradient-orb"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default {
  Particles: ParticleBackground,
  Floating: FloatingParticles,
  Bubbles: BubbleEffect,
  Stars: StarsBackground,
  Orbs: GradientOrbs
};
