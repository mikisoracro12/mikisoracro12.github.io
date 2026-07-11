/**
 * Typing Animation
 * Cycles through developer role titles with typewriter effect
 */

(function () {
  'use strict';

  const TITLES = [
    'Full-Stack Developer',
    'Cloud Architect',
    'AI Engineer',
    'Shopify Expert',
    'Mobile Developer'
  ];

  const TYPING_SPEED = 80;
  const DELETING_SPEED = 40;
  const PAUSE_DURATION = 2000;

  class TypingAnimation {
    constructor(element) {
      this.element = element;
      this.titleIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.isPaused = false;

      if (this.element) {
        this.start();
      }
    }

    start() {
      this.type();
    }

    type() {
      const currentTitle = TITLES[this.titleIndex];

      if (this.isDeleting) {
        this.charIndex--;
        this.element.textContent = currentTitle.substring(0, this.charIndex);

        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.titleIndex = (this.titleIndex + 1) % TITLES.length;
          setTimeout(() => this.type(), 300);
          return;
        }

        setTimeout(() => this.type(), DELETING_SPEED);
      } else {
        this.charIndex++;
        this.element.textContent = currentTitle.substring(0, this.charIndex);

        if (this.charIndex === currentTitle.length) {
          setTimeout(() => {
            this.isDeleting = true;
            this.type();
          }, PAUSE_DURATION);
          return;
        }

        setTimeout(() => this.type(), TYPING_SPEED);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
      new TypingAnimation(typingElement);
    }
  });
})();
