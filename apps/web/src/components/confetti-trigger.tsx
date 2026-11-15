'use client';

import confetti from 'canvas-confetti';

export function triggerRomanticConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-tier fireworks burst with romantic colors
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ff3366', '#a855f7', '#fbbf24'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#ff758c', '#ff7eb3', '#f43f5e'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.2,
    colors: ['#a855f7', '#ec4899', '#ffffff'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#fbbf24', '#f59e0b', '#f43f5e'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#ff3366', '#ffffff'],
  });
}
