// Global navigation, theme, sharing, and contact form for the static portfolio.
'use strict';

const html = document.documentElement;
const navbar = document.getElementById('navbar');
const menuButton = document.getElementById('hamburger');
const menu = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');
const mobileLayout = matchMedia('(max-width: 1100px)');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}

updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

const background = [document.querySelector('.skip-link'), document.querySelector('main'), document.querySelector('.footer')];

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  menuButton.classList.toggle('open', open);
  menu.classList.toggle('open', open);
  menu.inert = !open;
  document.body.classList.toggle('menu-open', open);
  background.forEach(element => { element.inert = open; });

  if (open) (menu.querySelector('a[aria-current]') || menu.querySelector('a')).focus();
  if (!open && restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('open'), true));
menu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false, true);
});
document.addEventListener('keydown', event => {
  if (!menu.classList.contains('open')) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false, true);
  }

  if (event.key === 'Tab') {
    const controls = [...document.querySelectorAll('#navbar a, #navbar button, #mobileMenu a, #mobileBar a')]
      .filter(element => element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
mobileLayout.addEventListener('change', event => {
  if (!event.matches && menu.classList.contains('open')) {
    setMenu(false);
    (navbar.querySelector('[aria-current="page"]') || navbar.querySelector('.nav__logo')).focus();
  }
});
window.addEventListener('pageshow', () => {
  if (menu.classList.contains('open')) setMenu(false, true);
});

const themeColor = document.querySelector('meta[name="theme-color"]');

function syncThemeControls() {
  const isLight = html.dataset.theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeColor.content = isLight ? '#f5f3ee' : '#080b10';
}

themeToggle.addEventListener('click', () => {
  const next = html.dataset.theme === 'light' ? 'dark' : 'light';
  html.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch { /* Storage is optional. */ }
  syncThemeControls();
});
syncThemeControls();
html.dataset.enhanced = '';
document.getElementById('year').textContent = new Date().getFullYear();

const shareButton = document.getElementById('sharePortfolio');
const shareStatus = document.getElementById('shareStatus');
const shareFallback = document.getElementById('shareFallback');
const shareUrl = document.getElementById('shareUrl');

shareButton.hidden = false;
shareButton.addEventListener('click', async () => {
  shareStatus.textContent = '';
  shareFallback.hidden = true;
  const url = shareUrl.value;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Saif Thabet', url });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    shareStatus.textContent = 'Portfolio link copied.';
  } catch {
    shareFallback.hidden = false;
    shareUrl.focus();
    shareUrl.select();
    shareStatus.textContent = 'Copy the selected portfolio link.';
  }
});

// The decorative constellation settles after a few seconds and stays still.
const canvas = document.getElementById('heroCanvas');
const motion = matchMedia('(prefers-reduced-motion: no-preference)');
if (canvas && motion.matches) {
  const context = canvas.getContext('2d');
  if (context) {
    let particles = [];
    let frame;
    let animationEnds;
    let lastFrame;

    const paint = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const [index, particle] of particles.entries()) {
        const { x, y, size } = particle;
        context.fillStyle = 'rgba(200, 169, 110, 0.55)';
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
        for (let i = index + 1; i < particles.length; i++) {
          const neighbor = particles[i];
          const distance = Math.hypot(x - neighbor.x, y - neighbor.y);
          if (distance >= 118) continue;

          context.strokeStyle = 'rgba(200, 169, 110, ' + (1 - distance / 118) * 0.28 + ')';
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(neighbor.x, neighbor.y);
          context.stroke();
        }
      }
    };

    const sizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      particles = Array.from({ length: canvas.width < 768 ? 30 : 54 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
        size: 0.6 + Math.random() * 1.2
      }));
      paint();
    };

    const animate = now => {
      if (document.hidden || !motion.matches || now >= animationEnds) return;

      if (now - lastFrame >= 30) {
        const step = Math.min((now - lastFrame) / 16, 2);
        particles.forEach(particle => {
          particle.x = (particle.x + particle.vx * step + canvas.width) % canvas.width;
          particle.y = (particle.y + particle.vy * step + canvas.height) % canvas.height;
        });
        paint();
        lastFrame = now;
      }
      frame = requestAnimationFrame(animate);
    };

    const start = () => {
      sizeCanvas();
      if (document.hidden || !motion.matches) return;

      lastFrame = performance.now();
      animationEnds = lastFrame + 4000;
      frame = requestAnimationFrame(animate);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();
        start();
      });
      observer.observe(canvas);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
    });
    window.addEventListener('resize', () => {
      if (motion.matches) sizeCanvas();
    }, { passive: true });
  }
}

const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
let submitting = false;

form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;

  submitting = true;
  const button = form.querySelector('[type="submit"]');
  const label = button.querySelector('span');
  const initialLabel = label.textContent;
  const setFeedback = (message, state = '') => {
    feedback.className = ('form__feedback ' + state).trim();
    feedback.textContent = message;
  };

  button.setAttribute('aria-disabled', 'true');
  label.textContent = 'Sending…';
  setFeedback('Sending your message…');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });

    if (response.ok) {
      form.reset();
      setFeedback('Message sent. I’ll get back to you soon.', 'success');
    } else {
      const body = await response.json().catch(() => null);
      const details = Array.isArray(body?.errors)
        ? body.errors.map(error => error?.message).filter(Boolean).join(' ')
        : '';
      setFeedback(details || 'Your message could not be sent. Try again or contact me by email.', 'error');
    }
  } catch {
    setFeedback('Delivery could not be confirmed. Check your connection or contact me by email.', 'error');
  } finally {
    clearTimeout(timeout);
    label.textContent = initialLabel;
    button.removeAttribute('aria-disabled');
    submitting = false;
  }
});
