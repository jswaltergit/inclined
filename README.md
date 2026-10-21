# Inclined website

Static site for Inclined, built from the August 2026 website copy update and checked against Inclined's brand standards in Tandem.

## Pages
- `index.html`: Home
- `capabilities.html`, `about.html`, `leadership.html`, `careers.html`, `contact.html`

## Shared files
- `css/site.css`: all styles (brand colors and type scale are defined at the top)
- `js/site.js`: mobile menu, copy-email button, contact form preview
- `fonts/`: Alcyone Regular and Bold (WOFF2); requires Inclined's Alcyone webfont license
- `images/`: logos, favicon and approved architecture photography

## Hosting
Hosted on Netlify, deployed automatically from the `main` branch root on every push. No build step. `_headers` sets browser caching for images, fonts, CSS and JS.

## Open items before launch
- Leadership names, titles and headshots
- GSA Schedule link
- Contact form backend (currently a preview that does not send)
- Remove the `noindex` meta tag from each page at launch
