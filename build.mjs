// Dependency-free static generator. Run: node build.mjs
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(path.join(root, name), 'utf8');
const pages = JSON.parse(read('source/routes.json'));
const layout = read('source/layout.html');
const arabic = JSON.parse(read('source/ar.json'));
const languages = ['en', 'ar'];
const assetVersion = name => createHash('sha256').update(read(name).replaceAll('\r\n', '\n')).digest('hex').slice(0, 12);
const versions = {
  THEME_VERSION: assetVersion('theme-init.js'),
  STYLE_VERSION: assetVersion('style.css'),
  SCRIPT_VERSION: assetVersion('script.js'),
};
const origin = 'https://www.saifthabet.tech';
const shareImage = 'saif-thabet-share.jpg';
const shareVersion = createHash('sha256').update(readFileSync(path.join(root, shareImage))).digest('hex').slice(0, 12);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const pagePath = (slug, language = 'en') => {
  if (slug === 'index') return language === 'ar' ? '/ar' : '/';
  return language === 'ar' ? `/ar/${slug}` : `/${slug}`;
};
const url = (page, language) => `${origin}${pagePath(page.slug, language)}`;
const arabicText = text => arabic[text] ?? text;

// Copy keys use the source text, including its HTML entities. Preserve surrounding
// whitespace, markup, and technical names that are shared between languages.
function localizeMarkup(markup, language) {
  if (language === 'en') return markup;

  return markup.replace(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g, part => {
    if (part.startsWith('<!--')) return part;
    if (part.startsWith('<')) {
      return part.replace(/\b(alt|aria-label)="([^"]+)"/g, (_, attr, value) => `${attr}="${arabicText(value)}"`);
    }
    return part.replace(/\S[\s\S]*\S|\S/, value => arabicText(value.replace(/\s+/g, ' ')));
  });
}

function homeStructuredData(page, language, personName) {
  const home = url(page, language);
  const website = origin + '/#website';
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': website,
        name: personName,
        alternateName: language === 'ar' ? 'معرض أعمال سيف ثابت' : 'Saif Thabet Portfolio',
        url: origin + '/',
        inLanguage: languages,
      },
      {
        '@type': 'ProfilePage',
        '@id': home + '#profile',
        url: home,
        name: page.title,
        description: page.description,
        inLanguage: language,
        isPartOf: { '@id': website },
        mainEntity: {
          '@type': 'Person',
          '@id': origin + '/#saif-thabet',
          name: personName,
          url: home,
          jobTitle: language === 'ar' ? arabicText('Software Engineer &amp; Frontend Developer') : 'Software Engineer & Frontend Developer',
          homeLocation: { '@type': 'Place', name: language === 'ar' ? arabicText("Sana'a, Yemen") : 'Sana’a, Yemen' },
          sameAs: ['https://www.linkedin.com/in/saif-thabet-25a2702a6'],
        },
      },
    ],
  };
  const json = JSON.stringify(data).replaceAll('<', '\\u003c');
  return `  <script type="application/ld+json">${json}</script>`;
}
const cleanLinks = (content, language) => content.replace(/href="(index|work|experience|contact)\.html([?#][^"]*)?"/g, (_, slug, suffix = '') => `href="${pagePath(slug, language)}${suffix}"`);
const icons = {
  hero: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  projects: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
};
const icon = name => `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
icons.work = icons.projects;
icons.experience = '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0M12 11v4"/>';
const redirects = {about: 'index.html#about', projects: 'work.html#projects', services: 'work.html#services', skills: 'experience.html#skills'};
const rewriteLinks = content => content.replace(/href="(about|projects|services|skills)\.html(?:#[^"]*)?"/g, (_, key) => `href="${redirects[key]}"`);
const alternateLinks = page => [...languages, 'x-default'].map(language => {
  return `  <link rel="alternate" hreflang="${language}" href="${url(page, language)}" />`;
}).join('\n');

function buildPage(page, language) {
  const isArabic = language === 'ar';
  const alternateLanguage = isArabic ? 'en' : 'ar';
  const localPage = isArabic ? page.ar : page;
  const personName = isArabic ? arabicText('Saif Thabet') : 'Saif Thabet';
  const nav = mobile => pages.map(item => {
    const label = (isArabic ? item.ar : item).label;
    return `<li><a href="${item.slug}.html" class="${mobile ? 'mobile-link' : 'nav__link'}${item.id === page.id ? ' active' : ''}"${item.id === page.id ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('\n      ');
  const bottomNav = pages.map(item => {
    const label = (isArabic ? item.ar : item).mobileLabel;
    return `<a href="${item.slug}.html" class="mobile-bar__item"${item.id === page.id ? ' aria-current="page"' : ''}>${icon(item.id)}<span>${label}</span></a>`;
  }).join('\n    ');
  const content = page.sections.map((name, index) => {
    let section = read(`source/${name}.html`);
    if (index === 0) {
      section = section.replace(/<section\b[^>]*>/, '$&\n    <div class="page-constellation" aria-hidden="true"><canvas id="pageConstellation"></canvas></div>');
    } else {
      section = section.replace(/<h1\b/g, '<h2').replace(/<\/h1>/g, '</h2>');
    }
    return localizeMarkup(rewriteLinks(section), language);
  }).join('\n');
  const tokens = {
    CONTENT: content,
    PAGE: page.id,
    LANGUAGE: language,
    DIRECTION: isArabic ? 'rtl' : 'ltr',
    LANGUAGE_LINK: `<a class="language-switch" id="languageSwitch" href="${pagePath(page.slug, alternateLanguage)}" hreflang="${alternateLanguage}" lang="${alternateLanguage}" dir="${isArabic ? 'ltr' : 'rtl'}">${isArabic ? 'English' : 'العربية'}</a>`,
    PERSON_NAME: personName,
    TITLE: escape(localPage.title),
    DESCRIPTION: escape(localPage.description),
    URL: url(page, language),
    ALTERNATES: alternateLinks(page),
    HOME_URL: origin + pagePath('index', language),
    OG_LOCALE: isArabic ? 'ar_YE' : 'en_US',
    OG_ALTERNATE: isArabic ? 'en_US' : 'ar_YE',
    SHARE_IMAGE_URL: `${origin}/${shareImage}?v=${shareVersion}`,
    SHARE_IMAGE_ALT: isArabic ? 'اسم سيف ثابت وشعاره الفضي على خلفية داكنة' : 'Saif Thabet’s silver monogram and name on a charcoal portfolio card',
    STRUCTURED_DATA: page.slug === 'index' ? homeStructuredData({...localPage, slug: page.slug}, language, personName) : '',
    DESKTOP_NAV: nav(false),
    MOBILE_NAV: nav(true),
    BOTTOM_NAV: bottomNav,
    YEAR: new Date().getUTCFullYear(),
    ...versions,
  };
  const output = localizeMarkup(layout, language).replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in tokens)) throw new Error(`Unknown layout token: ${key}`);
    return tokens[key];
  });
  const file = pagePath(page.slug, language).slice(1) || 'index';
  writeFileSync(path.join(root, `${file}.html`), cleanLinks(output, language));
}
mkdirSync(path.join(root, 'ar'), {recursive: true});
for (const language of languages) for (const page of pages) buildPage(page, language);
// Compatibility documents for old bookmarks on any static host; not navigation pages.
for (const [old, destination] of Object.entries(redirects)) {
  const [file, fragment] = destination.split('#');
  const canonical = pagePath(file.replace('.html', ''));
  const target = canonical + (fragment ? `#${fragment}` : '');
  writeFileSync(path.join(root, `${old}.html`), `<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page moved | Saif Thabet</title><meta name="robots" content="noindex"><link rel="canonical" href="${origin}${canonical}"><meta http-equiv="refresh" content="0;url=${target}"></head><body><p>This page has moved. <a href="${target}">Continue to the updated page</a>.</p></body></html>\n`);
}
const sitemapEntries = languages.flatMap(language => pages.map(page => `  <url><loc>${url(page, language)}</loc></url>`));
writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`);
console.log(`Built ${pages.length * languages.length} static pages and sitemap.xml.`);
