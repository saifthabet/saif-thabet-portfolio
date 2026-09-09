# Saif Thabet Portfolio

Multi-page static portfolio for `www.saifthabet.tech`.

## Pages and maintenance

The portfolio has four main destinations:

- Home (`index.html`): introduction, compact Layers of Heaven preview, About Me.
- Work & Services (`work.html`): all four existing projects, all six services, contact CTA.
- Experience (`experience.html`): professional journey, all eight skill cards, CV download.
- Contact (`contact.html`): contact options and the existing message form.

At widths up to 1100px, the fixed bottom bar provides Home, Work, Experience and
Contact directly, with no More menu. The top hamburger provides the same four
destinations. Current-page highlighting and iPhone safe-area clearance are included.

Every main page includes the navigation and footer,
works on direct entry, and has its own title, description and canonical URL.
The design, content and self-contained SVG icons are preserved.

Edit section content in `source/<section>.html`, route grouping and metadata in `source/routes.json`,
and the shared header/footer in `source/layout.html`. Run `node build.mjs` to
regenerate four main pages, four compatibility redirect documents, and the sitemap.
The generator promotes only the first section heading to the page's main heading;
subsequent section headings render as H2. No npm packages are required.
CSS and JavaScript remain shared root-level files. Generated HTML is included,
so Node is not required to preview or deploy the supplied build.

Public URLs are `/`, `/work`, `/experience` and `/contact`. Keep the `.html`
filenames on disk: Vercel's `cleanUrls` setting serves them without extensions
and redirects old `.html` requests. Both `/index` and `/index.html` redirect to `/`.
Navigation, canonical metadata, compatibility links and the sitemap use clean URLs.
Preview on Vercel or with a local server that supports extensionless HTML routes;
opening files directly or using an unconfigured Live Server will not emulate
these production routes. Do not rename or delete the HTML files.
Old home-page section bookmarks such as `/#services` redirect to the grouped page
when JavaScript is enabled; `/#about` stays on Home. Old `about.html`, `projects.html`,
`services.html` and `skills.html` URLs are small compatibility documents with an
automatic redirect and a normal fallback link. They are excluded from navigation
and the sitemap. No existing portfolio content has been removed.
Theme preference persists between pages when browser
storage is available. The home-page scroll cue and blocking loader were removed
because navigation now loads separate documents.

## Icons

Icons are embedded SVGs and work without JavaScript or an icon CDN. Interface
shapes are derived from the bundled Lucide library; see `ICON-LICENSE.txt`.
Skill and social marks are inline vector drawings. Theme and contact-form
state changes preserve the SVG elements.

## Deploy

Deploy the contents of this folder as the project root on Vercel. The included `vercel.json` applies security and caching headers.

Upload all root HTML files (including compatibility documents), shared CSS/JS,
images and other assets together. Replace the previous build as a complete folder.
Do not configure a single-page-app catch-all rewrite. The `source` directory and
`build.mjs` are maintenance files and may be omitted from the public upload.
The sitemap uses clean URLs consistently with the included Vercel configuration.

## Final owner checks

Automated checks cover all four main pages: local links/assets, one primary
heading per page, section grouping, current-page navigation, sitemap, JavaScript syntax,
and mocked initialization with normal/reduced motion and browser storage disabled.
Theme switching, menu open/Escape close and legacy-link redirects were checked in
the mocked runtime. This is not a full browser/device visual test.

- Send one controlled message through the contact form and confirm it arrives at the configured Formspree inbox.
- Check the deployed pages on desktop and mobile, including menu navigation and browser Back/Forward.
- Add project demo or repository actions only when verified public URLs are available.
- Keep the website, CV and LinkedIn employment dates synchronized.

## Contact details used

- Email: `saifthabett@gmail.com`
- WhatsApp: `+967 735 581 855`
- LinkedIn: `linkedin.com/in/saif-thabet-25a2702a6`
