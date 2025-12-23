/**
 * Confetti animation utility
 * Triggers celebratory confetti when task is completed
 */

import confetti from 'canvas-confetti';

export const triggerConfetti = (element = null) => {
  const defaults = {
    origin: { y: 0.7 },
    spread: 60,
    gravity: 0.7,
    decay: 0.95,
    zIndex: 9999,
  };

  if (element) {
    const rect = element.getBoundingClientRect();
    defaults.origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };
  }

  // Launch confetti from specific point
  confetti({
    ...defaults,
    particleCount: 50,
    spread: 100,
  });

  // Add side bursts
  setTimeout(() => {
    confetti({
      ...defaults,
      origin: { x: 0.2, y: 0.6 },
      spread: 45,
      particleCount: 30,
    });
    confetti({
      ...defaults,
      origin: { x: 0.8, y: 0.6 },
      spread: 45,
      particleCount: 30,
    });
  }, 100);
};
