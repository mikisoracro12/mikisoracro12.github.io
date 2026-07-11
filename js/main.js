/**
 * Main JavaScript Module
 * Navigation, smooth scroll, active links, contact form, back-to-top
 */

(function () {
  'use strict';

  const EMAILJS_CONFIG = {
    publicKey: 'fTKovSVvK1X1AArZG',
    serviceId: 'service_ybe7enq',
    templateId: 'template_8sjo3b8'
  };

  /* ------------------------------------------
     DOM Elements
     ------------------------------------------ */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  /* ------------------------------------------
     Mobile Navigation Toggle
     ------------------------------------------ */
  function initMobileNav() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });

    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* ------------------------------------------
     Sticky Header on Scroll
     ------------------------------------------ */
  function initStickyHeader() {
    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ------------------------------------------
     Active Navigation Link on Scroll
     ------------------------------------------ */
  function initActiveNav() {
    if (!sections.length || !navLinks.length) return;

    function setActiveLink() {
      const scrollPos = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
  }

  /* ------------------------------------------
     Smooth Scrolling
     ------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        history.pushState(null, null, href);
      });
    });
  }

  /* ------------------------------------------
     Back to Top Button
     ------------------------------------------ */
  function initBackToTop() {
    if (!backToTop) return;

    function toggleVisibility() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------
     Contact Form Handling (EmailJS)
     ------------------------------------------ */
  function initContactForm() {
    if (!contactForm || typeof emailjs === 'undefined') return;

    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const subject = formData.get('subject').trim();
      const message = formData.get('message').trim();

      if (!name || !email || !subject || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const btnLabel = submitBtn.querySelector('span');
      const originalText = btnLabel.textContent;

      btnLabel.textContent = 'Sending...';
      submitBtn.disabled = true;

      const templateParams = {
        name,
        from_name: name,
        email,
        from_email: email,
        reply_to: email,
        subject,
        message
      };

      emailjs
        .send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
        .then(() => {
          showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
          contactForm.reset();
        })
        .catch((error) => {
          console.error('EmailJS error:', error);
          showFormStatus('Failed to send message. Please try again or email me directly.', 'error');
        })
        .finally(() => {
          btnLabel.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  }

  /* ------------------------------------------
     Footer Year (dynamic copyright)
     ------------------------------------------ */
  function initFooterYear() {
    const yearEl = document.querySelector('.footer__bottom p');
    if (yearEl) {
      const currentYear = new Date().getFullYear();
      yearEl.innerHTML = yearEl.innerHTML.replace('2026', currentYear);
    }
  }

  /* ------------------------------------------
     Keyboard Navigation Accessibility
     ------------------------------------------ */
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu?.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------
     Initialize
     ------------------------------------------ */
  function init() {
    initMobileNav();
    initStickyHeader();
    initActiveNav();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    initFooterYear();
    initKeyboardNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
