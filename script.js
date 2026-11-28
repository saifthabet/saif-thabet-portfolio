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
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
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
  window.addEventListener('resize', sizeConstellation, { passive: true });

  // Drift briefly, then let the background settle in place.
  if (motion.matches && !document.hidden) {
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
