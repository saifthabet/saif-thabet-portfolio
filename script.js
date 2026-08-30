/* ═══════════════════════════════════════════════════════════
   SAIF THABET — PORTFOLIO JAVASCRIPT
   Features: Loader, Cursor, Navbar, Canvas, Typewriter,
             Scroll Reveal, Skill Bars, Count Up, Form, Theme
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. LOADER
───────────────────────────────────────── */
const loader = document.getElementById('loader');

function hideLoader() {
  if (!loader) return;

  loader.classList.add('hidden');

  // Completely remove it after the animation
  setTimeout(() => {
    loader.style.display = 'none';
  }, 1000);
}

// Do not make visitors wait for third-party fonts or icon stylesheets.
document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 250));

// Safety fallback:
// Never allow the loader to block the website indefinitely.
setTimeout(hideLoader, 1500);


/* ─────────────────────────────────────────
   2. CUSTOM CURSOR (desktop only)
───────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cursor && follower && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  // Smooth follower
  const animateCursor = () => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover effect on interactive elements
  const interactives = document.querySelectorAll('a, button, .skill-card, .project-card, .service-card, .social-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}


/* ─────────────────────────────────────────
   3. NAVBAR — scroll + active section
───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });


/* ─────────────────────────────────────────
   4. MOBILE MENU
───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const mobileBar = document.getElementById('mobileBar');

const toggleMenu = open => {
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
  document.getElementById('main-content').inert = open;
  document.querySelector('.footer').inert = open;
  if (open) mobileLinks[0]?.focus();
};

hamburger.addEventListener('click', () => {
  toggleMenu(!mobileMenu.classList.contains('open'));
});
mobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
    toggleMenu(false);
    hamburger.focus();
  }
  if (event.key === 'Tab' && mobileMenu.classList.contains('open')) {
    const controls = [...navbar.querySelectorAll('a, button'), ...mobileLinks, ...(mobileBar?.querySelectorAll('a, button') || [])]
      .filter(el => el.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1100 && mobileMenu.classList.contains('open')) toggleMenu(false);
});
window.addEventListener('pageshow', () => toggleMenu(false));


/* ─────────────────────────────────────────
   5. THEME TOGGLE
───────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch { /* Storage is optional. */ }
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  const isLight = theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#f5f3ee' : '#080b10');
}


/* ─────────────────────────────────────────
   6. HERO CANVAS — Particle Constellation
───────────────────────────────────────── */
const canvas = document.getElementById('heroCanvas');

if (canvas && !prefersReducedMotion) {

  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animId;

  const particleCount = () => window.innerWidth < 768 ? 42 : 72;
  const CONNECTION_DIST = 130;
  const MOUSE_RADIUS = 180;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;

        this.x += (dx / dist) * force * 2.5;
        this.y += (dy / dist) * force * 2.5;
      }

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${this.alpha})`;
      ctx.fill();
    }
  }

  function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    particles = Array.from(
      { length: particleCount() },
      () => new Particle()
    );
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {

        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha =
            (1 - dist / CONNECTION_DIST) * 0.25;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          ctx.strokeStyle =
            `rgba(200,169,110,${alpha})`;

          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();

    animId = requestAnimationFrame(animate);
  }

  initCanvas();
  animate();

  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(animId);
    if (!document.hidden) animate();
  });

  const hero = document.getElementById('hero');

  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  let resizeTimeout;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animId);
      initCanvas();
      animate();
    }, 200);
  });

}


/* ─────────────────────────────────────────
   7. TYPEWRITER
───────────────────────────────────────── */
const typeTarget = document.getElementById('typedTitle');
const titles = [
  'Software Engineer',
  'Frontend Developer',
  'UI / UX Developer',
  'Digital Problem Solver',
];

let titleIdx = 0, charIdx = 0, isDeleting = false;

function typeWriter() {
  const current = titles[titleIdx];
  if (isDeleting) {
    typeTarget.textContent = current.slice(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      titleIdx = (titleIdx + 1) % titles.length;
      setTimeout(typeWriter, 400);
      return;
    }
    setTimeout(typeWriter, 50);
  } else {
    typeTarget.textContent = current.slice(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 2000);
      return;
    }
    setTimeout(typeWriter, 90);
  }
}
if (typeTarget) {
  if (prefersReducedMotion) {
    typeTarget.textContent = 'Software Engineer & Frontend Developer';
  } else {
    typeTarget.textContent = '';
    typeWriter();
  }
}


/* ─────────────────────────────────────────
   8. SCROLL REVEAL
───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  if (prefersReducedMotion) el.classList.add('visible');
  else revealObs.observe(el);
});


/* ─────────────────────────────────────────
   9. COUNT UP ANIMATION
───────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat__num');

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, 30);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(number => {
  if (prefersReducedMotion) number.textContent = number.dataset.count;
  else countObs.observe(number);
});


/* ─────────────────────────────────────────
   10. CONTACT FORM — Formspree integration
───────────────────────────────────────── */
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

form?.addEventListener('submit', async e => {
  e.preventDefault();

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';
  btn.setAttribute('aria-busy', 'true');
  feedback.textContent = '';
  feedback.className = 'form__feedback';

  try {
    const data = new FormData(form);
    const response = await fetch('https://formspree.io/f/xqayzlbo', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      feedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
      feedback.className = 'form__feedback success';
      form.reset();
    } else {
      const json = await response.json();
      const errMsg = json?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
      feedback.textContent = '✗ ' + errMsg;
      feedback.className = 'form__feedback error';
    }
  } catch {
    feedback.textContent = '✗ Network error. Please check your connection and try again.';
    feedback.className = 'form__feedback error';
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    btn.removeAttribute('aria-busy');
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form__feedback'; }, 6000);
  }
});


/* ─────────────────────────────────────────
   11. FOOTER YEAR
───────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ─────────────────────────────────────────
   12. SMOOTH SCROLL for anchor links
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.getElementById(a.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72);
    target.focus({ preventScroll: true });
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
