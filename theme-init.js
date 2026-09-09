'use strict';
// Run before CSS to avoid flashing the wrong theme between pages.
try {
  const theme = localStorage.getItem('theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch { /* Browsing with storage disabled still works. */ }
// Preserve bookmarks from the previous single-page portfolio.
if (/\/(?:index\.html)?$/.test(location.pathname)) {
  const section = location.hash.slice(1);
  const destinations = {projects: '/work#projects', services: '/work#services', skills: '/experience#skills', experience: '/experience', contact: '/contact'};
  if (Object.hasOwn(destinations, section)) location.replace(destinations[section]);
}
