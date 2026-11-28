// Global navigation, theme, sharing, and contact form for the static portfolio.
'use strict';

const html = document.documentElement;
const isArabic = html.lang === 'ar';
const arabicMessages = {
  'Close navigation menu': 'إغلاق قائمة التنقّل',
  'Open navigation menu': 'فتح قائمة التنقّل',
  'Saif Thabet': 'سيف ثابت',
  'Portfolio link copied.': 'تم نسخ رابط الموقع.',
  'Copy the selected portfolio link.': 'انسخ رابط الموقع المحدّد.',
  'Connected': 'متصل',
  'Strong signal · −55 dBm': 'إشارة قوية · \u2066−55 dBm\u2069',
  'Weak signal': 'إشارة ضعيفة',
  'Unstable connection · −78 dBm': 'اتصال غير مستقر · \u2066−78 dBm\u2069',
  'Offline': 'غير متصل',
  'No connection · Signal unavailable': 'لا يوجد اتصال · تعذّر قياس الإشارة',
  'Sending…': 'جارٍ الإرسال…',
  'Sending your message…': 'جارٍ إرسال رسالتك…',
  'Message sent. I’ll get back to you soon.': 'تم إرسال رسالتك. سأردّ عليك قريبًا.',
  'Your message could not be sent. Try again or contact me by email.': 'تعذّر إرسال رسالتك. حاول مجددًا أو تواصل معي عبر البريد الإلكتروني.',
  'Delivery could not be confirmed. Check your connection or contact me by email.': 'تعذّر التأكّد من وصول رسالتك. تحقّق من اتصالك أو تواصل معي عبر البريد الإلكتروني.',
};
const translate = message => isArabic ? arabicMessages[message] ?? message : message;
const navbar = document.getElementById('navbar');
const menuButton = document.getElementById('hamburger');
const menu = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');
const mobileLayout = matchMedia('(max-width: 1100px)');
const languageSwitch = document.getElementById('languageSwitch');
const alternatePath = languageSwitch.pathname;

function syncLanguageLink() {
  languageSwitch.href = alternatePath + location.search + location.hash;
}

syncLanguageLink();
window.addEventListener('hashchange', syncLanguageLink);
window.addEventListener('pageshow', syncLanguageLink);

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}

updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

const background = [document.querySelector('.skip-link'), document.querySelector('main'), document.querySelector('.footer')];

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', translate(open ? 'Close navigation menu' : 'Open navigation menu'));
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
  themeColor.content = isLight ? '#f5f3ee' : '#000000';
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
      await navigator.share({ title: translate('Saif Thabet'), url });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    shareStatus.textContent = translate('Portfolio link copied.');
  } catch {
    shareFallback.hidden = false;
    shareUrl.focus();
    shareUrl.select();
    shareStatus.textContent = translate('Copy the selected portfolio link.');
  }
});

const motion = matchMedia('(prefers-reduced-motion: no-preference)');

const canvas = document.getElementById('pageConstellation');
const context = canvas?.getContext('2d');
if (context) {
  let particles = [];
  let frame;

  function paintConstellation() {
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

        context.strokeStyle = `rgba(200, 169, 110, ${(1 - distance / 118) * 0.28})`;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(neighbor.x, neighbor.y);
        context.stroke();
      }
    }
  }

  function sizeConstellation() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height || (particles.length && canvas.width === width && canvas.height === height)) return;

    canvas.width = width;
    canvas.height = height;
    particles = Array.from({ length: canvas.width < 768 ? 30 : 54 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5,
      size: 0.6 + Math.random() * 1.2,
    }));
    paintConstellation();
  }

  sizeConstellation();
  if ('ResizeObserver' in window) {
    new ResizeObserver(sizeConstellation).observe(canvas);
  } else {
    window.addEventListener('resize', sizeConstellation, { passive: true });
  }

  // Drift briefly, then let the background settle in place.
  if (particles.length && motion.matches && !document.hidden) {
    let lastFrame = performance.now();
    const end = lastFrame + 4000;
    function animateConstellation(now) {
      if (document.hidden || !motion.matches || now >= end) return;
      if (now - lastFrame >= 30) {
        const step = Math.min((now - lastFrame) / 16, 2);
        for (const particle of particles) {
          particle.x = (particle.x + particle.vx * step + canvas.width) % canvas.width;
          particle.y = (particle.y + particle.vy * step + canvas.height) % canvas.height;
        }
        paintConstellation();
        lastFrame = now;
      }
      frame = requestAnimationFrame(animateConstellation);
    }
    frame = requestAnimationFrame(animateConstellation);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
    });
  }
}

const constellation = canvas?.parentElement;
if (constellation) {
  const mobileScreen = matchMedia('(max-width: 768px), (pointer: coarse)');
  const dots = [];
  const lines = [];
  let frame = 0;
  let lastFrame = 0;
  let inView = true;

  // Move HTML elements on phones to avoid redrawing a canvas during viewport changes.
  function animateMobileConstellation(now) {
    frame = requestAnimationFrame(animateMobileConstellation);
    if (now - lastFrame < 32) return;

    const width = constellation.clientWidth;
    const height = constellation.clientHeight;
    if (!width || !height) return;

    const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.06) : 0;
    lastFrame = now;
    while (dots.length < 28) {
      const element = document.createElement('span');
      element.className = 'constellation-dot';
      element.style.width = element.style.height = `${1.5 + Math.random() * 1.5}px`;
      constellation.append(element);
      dots.push({
        element, x: Math.random() * width, y: Math.random() * height,
        angle: Math.random() * Math.PI * 2,
        speed: 34 + Math.random() * 38,
        turn: Math.random() * 1.5 - 0.75,
      });
    }

    for (const dot of dots) {
      dot.angle += dot.turn * elapsed;
      dot.x = (dot.x + Math.cos(dot.angle) * dot.speed * elapsed + width) % width;
      dot.y = (dot.y + Math.sin(dot.angle) * dot.speed * elapsed + height) % height;
      dot.edge = Math.min(1, Math.min(dot.x, width - dot.x, dot.y, height - dot.y) / 24);
      dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`;
      dot.element.style.opacity = 0.65 * dot.edge;
    }

    const connectionRadius = 108;
    let usedLines = 0;
    for (const [index, dot] of dots.entries()) {
      for (let i = index + 1; i < dots.length; i++) {
        const neighbor = dots[i];
        const dx = neighbor.x - dot.x;
        const dy = neighbor.y - dot.y;
        const length = Math.hypot(dx, dy);
        if (length >= connectionRadius) continue;

        let line = lines[usedLines++];
        if (!line) {
          line = document.createElement('span');
          line.className = 'constellation-line';
          lines.push(line);
          constellation.prepend(line);
        }
        line.style.transform = `translate(${dot.x}px, ${dot.y}px) rotate(${Math.atan2(dy, dx)}rad) scaleX(${length})`;
        line.style.opacity = (1 - length / connectionRadius) * 0.28 * Math.min(dot.edge, neighbor.edge);
      }
    }
    for (let i = usedLines; i < lines.length; i++) lines[i].style.opacity = 0;
    if (!constellation.hasAttribute('data-mobile-motion')) constellation.setAttribute('data-mobile-motion', '');
  }

  function syncMobileConstellation() {
    const enabled = mobileScreen.matches && motion.matches;
    if (!enabled) constellation.removeAttribute('data-mobile-motion');
    if (enabled && inView && !document.hidden) {
      if (!frame) frame = requestAnimationFrame(animateMobileConstellation);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
    }
  }

  syncMobileConstellation();
  mobileScreen.addEventListener('change', syncMobileConstellation);
  motion.addEventListener('change', syncMobileConstellation);
  document.addEventListener('visibilitychange', syncMobileConstellation);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncMobileConstellation();
    }).observe(constellation);
  }
}

function selectChoice(choices, selected) {
  choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === selected)));
}

const modemDemo = document.getElementById('modemDemo');
if (modemDemo) {
  const choices = modemDemo.querySelectorAll('[data-connection-choice]');
  const display = modemDemo.querySelector('.modem-demo__display');
  const label = document.getElementById('connectionLabel');
  const detail = document.getElementById('connectionDetail');
  const states = {
    connected: { label: 'Connected', detail: 'Strong signal · −55 dBm' },
    weak: { label: 'Weak signal', detail: 'Unstable connection · −78 dBm' },
    offline: { label: 'Offline', detail: 'No connection · Signal unavailable' },
  };

  modemDemo.hidden = false;
  choices.forEach(choice => choice.addEventListener('click', () => {
    const state = choice.dataset.connectionChoice;
    selectChoice(choices, choice);
    display.dataset.connection = state;
    label.textContent = translate(states[state].label);
    detail.textContent = translate(states[state].detail);
  }));
}

const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
let submitting = false;

if (form && isArabic) {
  form.addEventListener('invalid', event => {
    const field = event.target;
    if (field.validity.valueMissing) field.setCustomValidity('يرجى تعبئة هذا الحقل.');
    if (field.validity.typeMismatch) field.setCustomValidity('يرجى إدخال عنوان بريد إلكتروني صالح.');
  }, true);
  form.addEventListener('input', event => { event.target.setCustomValidity(''); });
}

form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;

  submitting = true;
  const button = form.querySelector('[type="submit"]');
  const label = button.querySelector('span');
  const initialLabel = label.textContent;
  const setFeedback = (message, state = '') => {
    feedback.className = ('form__feedback ' + state).trim();
    feedback.textContent = translate(message);
  };

  button.setAttribute('aria-disabled', 'true');
  label.textContent = translate('Sending…');
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
      const body = isArabic ? null : await response.json().catch(() => null);
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
