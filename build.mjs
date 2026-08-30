// Dependency-free static generator. Run: node build.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(path.join(root, name), 'utf8');
const pages = JSON.parse(read('source/routes.json'));
const layout = read('source/layout.html');
const origin = 'https://www.saifthabet.tech';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const url = page => `${origin}/${page.slug === 'index' ? '' : page.slug + '.html'}`;
const icons = {
  hero: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  projects: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  services: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>',
  contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
};
const icon = name => `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
icons.work = icons.projects;
icons.experience = '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0M12 11v4"/>';
const redirects = {about: 'index.html#about', projects: 'work.html#projects', services: 'work.html#services', skills: 'experience.html#skills'};
const rewriteLinks = content => content.replace(/href="(about|projects|services|skills)\.html(?:#[^"]*)?"/g, (_, key) => `href="${redirects[key]}"`);
for (const page of pages) {
  const nav = mobile => pages.map(item => `<li><a href="${item.slug}.html" class="${mobile ? 'mobile-link' : 'nav__link'}${item.id === page.id ? ' active' : ''}"${item.id === page.id ? ' aria-current="page"' : ''}>${item.label}</a></li>`).join('\n      ');
  const quickPages = pages.map(item => item.id);
  const bottomNav = quickPages.map(id => {
    const item = pages.find(p => p.id === id);
    return `<a href="${item.slug}.html" class="mobile-bar__item"${id === page.id ? ' aria-current="page"' : ''}>${icon(id)}<span>${item.mobileLabel}</span></a>`;
  }).join('\n    ');
  const content = page.sections.map((name, index) => {
    let section = read(`source/${name}.html`);
    if (index > 0) section = section.replace(/<h1\b/g, '<h2').replace(/<\/h1>/g, '</h2>');
    return rewriteLinks(section);
  }).join('\n');
  const tokens = {CONTENT: content, PAGE: page.id, TITLE: escape(page.title), DESCRIPTION: escape(page.description), URL: url(page), DESKTOP_NAV: nav(false), MOBILE_NAV: nav(true), BOTTOM_NAV: bottomNav};
  const output = layout.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in tokens)) throw new Error(`Unknown layout token: ${key}`);
    return tokens[key];
  });
  writeFileSync(path.join(root, `${page.slug}.html`), output);
}
// Compatibility documents for old bookmarks on any static host; not navigation pages.
for (const [old, destination] of Object.entries(redirects)) {
  writeFileSync(path.join(root, `${old}.html`), `<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page moved | Saif Thabet</title><meta name="robots" content="noindex"><link rel="canonical" href="${origin}/${destination.split('#')[0] === 'index.html' ? '' : destination.split('#')[0]}"><meta http-equiv="refresh" content="0;url=${destination}"></head><body><p>This page has moved. <a href="${destination}">Continue to the updated page</a>.</p></body></html>\n`);
}
writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${url(page)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${pages.length} static pages and sitemap.xml.`);
