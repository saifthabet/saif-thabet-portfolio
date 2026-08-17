/* ═══════════════════════════════════════════════════════════
   SAIF ANES — PORTFOLIO JAVASCRIPT
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

// Normal loading
window.addEventListener('load', hideLoader);

// Safety fallback:
// Never allow the loader to block the website indefinitely.
setTimeout(hideLoader, 3000);


/* ─────────────────────────────────────────
   2. CUSTOM CURSOR (desktop only)
───────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (window.matchMedia('(pointer: fine)').matches) {
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
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled state
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Active section
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}, { passive: true });


/* ─────────────────────────────────────────
   4. MOBILE MENU
───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

const toggleMenu = open => {
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};

hamburger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
mobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));


/* ─────────────────────────────────────────
   5. THEME TOGGLE
───────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}


/* ─────────────────────────────────────────
   6. HERO CANVAS — Particle Constellation
───────────────────────────────────────── */
const canvas = document.getElementById('heroCanvas');

if (canvas) {

  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animId;

  const PARTICLE_COUNT = 90;
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
      { length: PARTICLE_COUNT },
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
  'Frontend Developer',
  'UI / UX Enthusiast',
  'Web Craftsman',
  'Digital Creator',
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
typeWriter();


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

revealEls.forEach(el => revealObs.observe(el));


/* ─────────────────────────────────────────
   9. SKILL BARS (trigger on scroll)
───────────────────────────────────────── */
const skillBars = document.querySelectorAll('.skill-card__fill');

const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.width + '%';
      barObs.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObs.observe(bar));


/* ─────────────────────────────────────────
   10. COUNT UP ANIMATION
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

statNums.forEach(n => countObs.observe(n));


/* ─────────────────────────────────────────
   11. CONTACT FORM — Formspree integration
───────────────────────────────────────── */
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
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
    btn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form__feedback'; }, 6000);
  }
});


/* ─────────────────────────────────────────
   12. FOOTER YEAR
───────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ─────────────────────────────────────────
   13. SMOOTH SCROLL for anchor links
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});



/* ═══════════════════════════════════════════════════════════
   PROMPT LIBRARY v2 — Premium Edition
   ─────────────────────────────────────────────────────────
   HOW TO ADD A PROMPT:
   Add an object to the `prompts` array below.

   Fields:
     title    {string}  — Prompt title (shown on card & modal)
     category {string}  — Filter category (e.g. "Web Dev", "Marketing")
     icon     {string}  — Font Awesome class (e.g. "fa-solid fa-code")
     colors   {array}   — Two hex colors for the auto-generated thumbnail
                          e.g. ["#1a1a2e", "#c8a96e"]
     image    {string}  — (optional) Path to a real image, e.g. "images/myprompt.jpg"
                          If set, this overrides the auto-generated thumbnail.
     preview  {string}  — 1-2 sentence description shown on the card
     content  {string}  — Full prompt text (shown in modal, can be copied)

   The UI builds everything automatically. No HTML changes needed.
   ═══════════════════════════════════════════════════════════ */

const prompts = [
  {
    title: "Portfolio Website Generator",
    category: "Web Dev",
    icon: "fa-solid fa-globe",
    colors: ["#0d1b2a", "#c8a96e"],
    preview: "Generate a complete premium personal portfolio website with hero, about, skills, projects, and contact sections.",
    content: `Act as a senior frontend developer and UI/UX designer.

Your task is to design and build a highly creative, modern, and visually impressive personal portfolio website.

Requirements:
- Use HTML, CSS, and JavaScript (no frameworks)
- Fully responsive (mobile, tablet, desktop)
- Dark mode preferred with optional light mode toggle
- Include: Hero, About, Skills, Projects, Experience, Services, Contact sections
- Add smooth scroll animations and hover effects
- Use glassmorphism or subtle 3D effects
- Elegant typography using Google Fonts
- Custom cursor on desktop
- Sticky navbar with active section detection

Design style: modern, minimal but creative, premium feel.

Provide the full code organized into separate HTML, CSS, and JS files with clear comments.`
  },
  {
    title: "Landing Page Copywriter",
    category: "Marketing",
    icon: "fa-solid fa-bullseye",
    colors: ["#1a0533", "#e040fb"],
    preview: "Write high-converting landing page copy including headline, benefits, trust signals, and a strong CTA.",
    content: `Act as a professional copywriter specializing in high-converting landing pages.

I need you to write compelling copy for a landing page for [PRODUCT/SERVICE].

Target audience: [DESCRIBE YOUR AUDIENCE]
Tone: [professional / friendly / bold / etc.]
Goal: [sales / lead generation / sign-ups]

Please write:
1. A powerful headline (under 10 words)
2. A subheadline (1–2 sentences)
3. 3 key benefits in bullet format
4. A trust-building paragraph
5. A strong call-to-action button text
6. A short FAQ section (3 questions)

Make the copy clear, benefit-focused, and emotionally resonant.`
  },
  {
    title: "Code Review & Refactor Assistant",
    category: "Dev Tools",
    icon: "fa-solid fa-code",
    colors: ["#0a1628", "#3b7fd4"],
    preview: "Get a thorough code review with bug detection, performance analysis, best practices, and a refactored version.",
    content: `Act as a senior software engineer performing a thorough code review.

Review the following code and provide:

1. **Bugs & Issues** — List any bugs, logic errors, or security vulnerabilities
2. **Performance** — Identify bottlenecks and suggest optimizations
3. **Readability** — Suggest naming improvements and structural clarity
4. **Best Practices** — Note any violations of clean code principles
5. **Refactored Version** — Provide an improved version of the code

Be specific, explain each suggestion clearly, and prioritize issues by severity (Critical / Medium / Minor).

[PASTE YOUR CODE BELOW]`
  },
  {
    title: "Social Media Content Calendar",
    category: "Marketing",
    icon: "fa-solid fa-calendar-days",
    colors: ["#1a0a2e", "#ff6b6b"],
    preview: "Create a full 30-day content calendar with post ideas, hashtags, timing, and CTAs for any platform.",
    content: `Act as a social media strategist and content creator.

Create a 30-day content calendar for [BRAND/NICHE] targeting [PLATFORM: Instagram / LinkedIn / X / etc.].

Brand tone: [describe tone]
Target audience: [describe audience]
Goal: [awareness / engagement / leads / sales]

For each week, provide:
- 5 post ideas with captions
- Relevant hashtags (10–15 per post)
- Best posting times
- Content type (image / carousel / reel / text)
- Call-to-action for each post

Include a mix of: educational, entertaining, promotional, and engagement posts.
Output as a structured table.`
  },
  {
    title: "UI Component Designer",
    category: "Web Dev",
    icon: "fa-solid fa-layer-group",
    colors: ["#0d1f0d", "#4caf74"],
    preview: "Design and build any UI component in pure HTML/CSS/JS with dark mode, animations, and accessibility built in.",
    content: `Act as a senior UI developer and design systems expert.

Design and build the following UI component: [COMPONENT NAME — e.g. Pricing Card, Modal, Data Table]

Requirements:
- Pure HTML, CSS, JavaScript (no frameworks)
- Dark and light mode support using CSS variables
- Fully responsive
- Accessible (ARIA labels, keyboard navigation)
- Smooth micro-animations on interaction
- Clean, production-ready code

Style direction: modern, minimal, professional
Color palette: use CSS custom properties so it's easily themeable

Provide:
1. Complete HTML structure
2. CSS with variables at the top
3. JavaScript for interactivity
4. Brief usage notes`
  },
  {
    title: "Job Application Cover Letter",
    category: "Career",
    icon: "fa-solid fa-file-lines",
    colors: ["#1a1400", "#c8a96e"],
    preview: "Generate a personalized, compelling cover letter that opens with a hook and closes with a confident CTA.",
    content: `Act as a professional career coach and cover letter writer.

Write a compelling, personalized cover letter for the following:

My name: [YOUR NAME]
Role applying for: [JOB TITLE]
Company: [COMPANY NAME]
My background: [Brief summary of your experience and skills]
Why this company: [What excites you about this specific company]

Guidelines:
- Keep it under 350 words
- Start with a strong opening hook (not "I am applying for...")
- Focus on value I bring, not just my history
- Show genuine enthusiasm for the role
- End with a confident, action-oriented closing
- Tone: professional but warm and human

Output just the letter, ready to send.`
  },
];

/* ─────────────────────────────────────────
   THUMBNAIL GENERATOR
   Creates a beautiful SVG-canvas thumbnail
   for each prompt using its color palette.
───────────────────────────────────────── */
function generateThumbnail(canvas, prompt) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = canvas.offsetHeight || 140;

  const [c1, c2] = prompt.colors || ['#141b26', '#c8a96e'];

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2 + '55');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Mesh circles
  const circles = [
    { x: W * 0.15, y: H * 0.5, r: H * 0.7 },
    { x: W * 0.85, y: H * 0.4, r: H * 0.55 },
    { x: W * 0.5, y: H * 1.1, r: H * 0.6 },
  ];
  circles.forEach((c, i) => {
    const rg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
    rg.addColorStop(0, c2 + (i === 0 ? '33' : '22'));
    rg.addColorStop(1, 'transparent');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Grid dots
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let x = 20; x < W; x += 28) {
    for (let y = 10; y < H; y += 28) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Noise overlay (simulated with subtle random pixels)
  for (let i = 0; i < 600; i++) {
    const nx = Math.random() * W;
    const ny = Math.random() * H;
    const a = Math.random() * 0.04;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(nx, ny, 1, 1);
  }

  // Icon text (unicode approximation via emoji fallback)
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${H * 0.85}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('{ }', W * 0.82, H * 0.52);
  ctx.restore();

  // Bottom text label
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `500 11px 'DM Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(prompt.category.toUpperCase(), 16, H - 12);
  ctx.restore();
}

/* ─────────────────────────────────────────
   MODAL CANVAS THUMBNAIL (larger)
───────────────────────────────────────── */
function generateModalCanvas(canvas, prompt) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 380;
  const H = canvas.height = canvas.offsetHeight || 500;
  const [c1, c2] = prompt.colors || ['#141b26', '#c8a96e'];

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.6, c1);
  grad.addColorStop(1, c2 + '44');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Large glow
  const rg = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, H * 0.65);
  rg.addColorStop(0, c2 + '40');
  rg.addColorStop(1, 'transparent');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Central icon-like circle
  const cx = W / 2, cy = H / 2;
  const cr = Math.min(W, H) * 0.22;
  const rg2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
  rg2.addColorStop(0, c2 + 'cc');
  rg2.addColorStop(0.5, c2 + '44');
  rg2.addColorStop(1, 'transparent');
  ctx.fillStyle = rg2;
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fill();

  // Ring
  ctx.save();
  ctx.strokeStyle = c2 + '66';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, cr * 1.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = c2 + '33';
  ctx.beginPath();
  ctx.arc(cx, cy, cr * 2.1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Noise
  for (let i = 0; i < 1200; i++) {
    const nx = Math.random() * W;
    const ny = Math.random() * H;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
    ctx.fillRect(nx, ny, 1, 1);
  }

  // Title text at bottom
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `600 15px 'Outfit', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  const words = prompt.title.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
  if (line2) {
    ctx.fillText(line1, W / 2, H - 38);
    ctx.fillText(line2, W / 2, H - 18);
  } else {
    ctx.fillText(line1, W / 2, H - 22);
  }
  ctx.restore();
}

/* ─────────────────────────────────────────
   PROMPT LIBRARY — Rendering Engine
───────────────────────────────────────── */
(function initPromptLibrary() {
  const grid        = document.getElementById('promptsGrid');
  const filterWrap  = document.getElementById('promptFilters');
  const searchInput = document.getElementById('promptSearch');
  const emptyMsg    = document.getElementById('promptsEmpty');
  const modal       = document.getElementById('promptModal');
  const modalBdrop  = document.getElementById('promptModalBackdrop');
  const modalClose  = document.getElementById('promptModalClose');
  const modalTitle  = document.getElementById('modalTitle');
  const modalCat    = document.getElementById('modalCategory');
  const modalContent= document.getElementById('modalContent');
  const modalCopyBtn= document.getElementById('modalCopyBtn');
  const modalToast  = document.getElementById('modalCopyToast');
  const modalCanvas = document.getElementById('modalCanvas');
  const modalImg    = document.getElementById('modalImg');
  const globalToast = document.getElementById('globalCopyToast');

  if (!grid) return;

  /* ── State ── */
  let activeCategory = 'All';
  let searchQuery = '';
  let activePrompt = null;

  /* ── Category filters ── */
  const categories = ['All', ...new Set(prompts.map(p => p.category))];
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'prompt-filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.setAttribute('aria-label', `Filter by ${cat}`);
    btn.addEventListener('click', () => {
      activeCategory = cat;
      filterWrap.querySelectorAll('.prompt-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards();
    });
    filterWrap.appendChild(btn);
  });

  /* ── Search ── */
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    renderCards();
  });

  /* ── Render cards ── */
  function renderCards() {
    const filtered = prompts.filter(p => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !searchQuery
        || p.title.toLowerCase().includes(searchQuery)
        || p.preview.toLowerCase().includes(searchQuery)
        || p.content.toLowerCase().includes(searchQuery)
        || p.category.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      emptyMsg.style.display = 'flex';
      return;
    }
    emptyMsg.style.display = 'none';

    filtered.forEach((prompt, idx) => {
      const card = document.createElement('article');
      card.className = 'prompt-card reveal-up';
      card.style.setProperty('--delay', idx % 4);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View prompt: ${prompt.title}`);

      const charCount = prompt.content.replace(/\s/g, '').length;

      card.innerHTML = `
        <div class="prompt-card__thumb">
          ${prompt.image
            ? `<img class="prompt-card__thumb-img" src="${prompt.image}" alt="${prompt.title}" loading="lazy" />`
            : `<canvas class="prompt-card__thumb-canvas"></canvas>`
          }
          <span class="prompt-card__badge">${prompt.category}</span>
          <button class="prompt-card__quick-copy" title="Copy prompt" aria-label="Copy prompt">
            <i class="fa-regular fa-copy"></i>
          </button>
        </div>
        <div class="prompt-card__body">
          <h3 class="prompt-card__title">${prompt.title}</h3>
          <p class="prompt-card__desc">${prompt.preview}</p>
        </div>
        <div class="prompt-card__footer">
          <span class="prompt-card__chars">${charCount} chars</span>
          <button class="prompt-card__view-btn" aria-label="View full prompt">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> View Prompt
          </button>
        </div>
      `;

      // Generate canvas thumbnail
      if (!prompt.image) {
        const canvas = card.querySelector('.prompt-card__thumb-canvas');
        // Wait for DOM paint
        requestAnimationFrame(() => generateThumbnail(canvas, prompt));
      }

      // Open modal on card / view-btn click
      const openFn = (e) => {
        if (e.target.closest('.prompt-card__quick-copy')) return;
        openModal(prompt);
      };
      card.addEventListener('click', openFn);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openFn(e); });

      // Quick-copy button
      const quickCopy = card.querySelector('.prompt-card__quick-copy');
      quickCopy.addEventListener('click', async (e) => {
        e.stopPropagation();
        await copyText(prompt.content);
        quickCopy.classList.add('copied');
        quickCopy.innerHTML = '<i class="fa-solid fa-check"></i>';
        showGlobalToast();
        setTimeout(() => {
          quickCopy.classList.remove('copied');
          quickCopy.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2200);
      });

      grid.appendChild(card);
    });

    // Re-observe for scroll reveal
    grid.querySelectorAll('.reveal-up').forEach(el => {
      el.classList.remove('visible');
      revealObs.observe(el);
    });
  }

  /* ── Modal ── */
  function openModal(prompt) {
    activePrompt = prompt;
    modalTitle.textContent = prompt.title;
    modalCat.textContent = prompt.category;
    modalContent.textContent = prompt.content;
    modalToast.classList.remove('show');
    modalCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i><span>Copy Prompt</span>';

    // Set header icon color
    const iconEl = document.getElementById('modalHeaderIcon');
    if (iconEl) {
      iconEl.style.background = `linear-gradient(135deg, ${prompt.colors[0]}, ${prompt.colors[1]})`;
      iconEl.innerHTML = `<i class="${prompt.icon}" style="color:#fff"></i>`;
    }

    // Modal image panel
    if (prompt.image && modalImg) {
      modalImg.src = prompt.image;
      modalImg.style.display = 'block';
      if (modalCanvas) modalCanvas.style.display = 'none';
    } else if (modalCanvas) {
      modalCanvas.style.display = 'block';
      if (modalImg) modalImg.style.display = 'none';
      requestAnimationFrame(() => generateModalCanvas(modalCanvas, prompt));
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus trap: focus close button
    setTimeout(() => modalClose.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    activePrompt = null;
  }

  modalClose.addEventListener('click', closeModal);
  modalBdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* ── Copy ── */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement('textarea'), {
        value: text,
        style: 'position:fixed;opacity:0'
      });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  function showGlobalToast() {
    globalToast.classList.add('show');
    setTimeout(() => globalToast.classList.remove('show'), 2500);
  }

  modalCopyBtn.addEventListener('click', async () => {
    if (!activePrompt) return;
    await copyText(activePrompt.content);
    modalCopyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied!</span>';
    modalToast.classList.add('show');
    setTimeout(() => {
      modalToast.classList.remove('show');
      modalCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i><span>Copy Prompt</span>';
    }, 2500);
  });

  /* ── Initial render ── */
  renderCards();
})();
