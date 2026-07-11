/**
 * Animations Module
 * Scroll reveals, counters, parallax, particles, timeline, and visual effects
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------
     Loading Screen
     ------------------------------------------ */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 1800);
    });
  }

  /* ------------------------------------------
     Scroll Progress Bar
     ------------------------------------------ */
  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress__bar');
    if (!progressBar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ------------------------------------------
     Scroll Reveal (Intersection Observer)
     ------------------------------------------ */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.fade-up, .fade-in, .slide-left, .slide-right, .scale-in, .timeline__item'
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title) => {
      const headerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              const tag = entry.target.previousElementSibling;
              if (tag && tag.classList.contains('section-tag')) {
                tag.classList.add('visible');
              }
              headerObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      headerObserver.observe(title);
    });
  }

  /* ------------------------------------------
     Animated Counters
     ------------------------------------------ */
  function initCounters() {
    const counters = document.querySelectorAll('.achievement-card__number');
    if (!counters.length) return;

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ------------------------------------------
     Timeline Progress
     ------------------------------------------ */
  function initTimeline() {
    const timeline = document.querySelector('.timeline');
    const timelineLine = document.querySelector('.timeline__line');
    if (!timeline || !timelineLine) return;

    function updateTimelineProgress() {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const timelineTop = rect.top;
      const timelineHeight = rect.height;

      let progress = ((windowHeight - timelineTop) / (timelineHeight + windowHeight)) * 100;
      progress = Math.max(0, Math.min(100, progress));
      timelineLine.style.setProperty('--timeline-progress', `${progress}%`);
    }

    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    updateTimelineProgress();
  }

  /* ------------------------------------------
     Hero Parallax
     ------------------------------------------ */
  function initParallax() {
    if (prefersReducedMotion) return;

    const heroContent = document.querySelector('.hero__content');
    const heroVisual = document.querySelector('.hero__visual');
    const heroBlobs = document.querySelectorAll('.hero__blob');

    if (!heroContent) return;

    window.addEventListener(
      'scroll',
      () => {
        const scrolled = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;

        if (scrolled > heroHeight) return;

        const rate = scrolled * 0.3;

        heroContent.style.transform = `translateY(${rate * 0.5}px)`;
        if (heroVisual) {
          heroVisual.style.transform = `translateY(${rate * 0.2}px)`;
        }

        heroBlobs.forEach((blob, i) => {
          const speed = 0.1 + i * 0.05;
          blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
      },
      { passive: true }
    );
  }

  /* ------------------------------------------
     Floating Particles
     ------------------------------------------ */
  function initParticles() {
    if (prefersReducedMotion) return;

    const container = document.getElementById('particles');
    if (!container) return;

    const PARTICLE_COUNT = 30;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 3 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

      container.appendChild(particle);
    }
  }

  /* ------------------------------------------
     Mouse Spotlight
     ------------------------------------------ */
  function initMouseSpotlight() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const spotlight = document.querySelector('.mouse-spotlight');
    if (!spotlight) return;

    let mouseX = 0;
    let mouseY = 0;
    let spotlightX = 0;
    let spotlightY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateSpotlight() {
      spotlightX += (mouseX - spotlightX) * 0.08;
      spotlightY += (mouseY - spotlightY) * 0.08;

      spotlight.style.left = `${spotlightX}px`;
      spotlight.style.top = `${spotlightY}px`;

      requestAnimationFrame(animateSpotlight);
    }

    animateSpotlight();
  }

  /* ------------------------------------------
     Custom Cursor Follower
     ------------------------------------------ */
  function initCursorFollower() {
    if (prefersReducedMotion || window.innerWidth < 992 || 'ontouchstart' in window) return;

    const follower = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');
    if (!follower || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    const interactiveElements = document.querySelectorAll(
      'a, button, .btn, .skill-tag, .project-card, .filter-btn, input, textarea'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;

      requestAnimationFrame(animateFollower);
    }

    animateFollower();
  }

  /* ------------------------------------------
     Button Ripple Effect
     ------------------------------------------ */
  function initButtonRipple() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* ------------------------------------------
     Project Filter Animation
     ------------------------------------------ */
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.classList.remove('hidden', 'filtering-out');
            card.classList.add('filtering-in');
            setTimeout(() => card.classList.remove('filtering-in'), 500);
          } else {
            card.classList.add('filtering-out');
            setTimeout(() => {
              card.classList.add('hidden');
              card.classList.remove('filtering-out');
            }, 400);
          }
        });
      });
    });
  }

  /* ------------------------------------------
     Initialize All Animations
     ------------------------------------------ */
  function init() {
    initLoader();
    initScrollProgress();
    initScrollReveal();
    initCounters();
    initTimeline();
    initParallax();
    initParticles();
    initMouseSpotlight();
    initCursorFollower();
    initButtonRipple();
    initProjectFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
