# Saif Thabet Portfolio

A dependency-free static portfolio for `www.saifthabet.tech`.

- Home at `/` introduces Saif and features the Layers of Heaven website.
- Work & Services at `/work` showcases four projects and six services.
- Experience at `/experience` covers work, education, skills, and the downloadable CV.
- Contact at `/contact` provides direct contact details and a Formspree form.

## Edit and build

Edit page sections in `source/`, common markup in `source/layout.html`, and route metadata in `source/routes.json`. Run `node build.mjs` from the repository root to regenerate the four public pages, legacy redirects, and sitemap. The generator versions the shared scripts and stylesheet by content. Commit the generated files with the sources.

Shared styles and scripts are in the repository root. Fonts are served from `fonts/` under their included licenses. The header uses a responsive WebP derivative of the original logo. Interface icons are embedded SVGs, with the Lucide attribution in `ICON-LICENSE.txt`.

## Preview and deploy

The generated pages and assets are ready to serve as static files. Use Vercel or a local server that maps `/work`, `/experience`, and `/contact` to their corresponding HTML files. Opening the files from disk does not emulate these URLs.

Deploy the repository root to Vercel with the included configuration. It enables clean URLs, preserves legacy routes, and applies security and caching headers. The four canonical URLs are listed in `sitemap.xml`.

The contact form uses the endpoint in `source/contact.html` for both native POST and JavaScript submissions. If the provider changes, update the form action and the corresponding Content Security Policy directives in `vercel.json`. Test actual inbox delivery separately from browser tests that intercept submissions.
