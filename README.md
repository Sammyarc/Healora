# Healora — Mental Health Landing Page

A one-page marketing site for **Healora**, a mental-health clinic that connects people with certified therapists. Built with plain HTML, CSS and JavaScript — no build step.

## Run it

Open `index.html` through any static server (fonts and images load over HTTP):

```bash
npx serve .          # or: python -m http.server
```

## Structure

```
index.html            markup for every section
css/style.css         tokens → base → components → sections → responsive
js/main.js            GSAP motion, mobile menu, service cards, blog switcher, forms, Lenis
assets/fonts/         Google Sans (variable 400–700 + italic, latin subset, self-hosted)
assets/img/           section photography (WebP) + og.jpg share image
assets/vendor/        gsap 3.12.5, ScrollTrigger 3.12.5, lenis 1.1.13 (self-hosted)
assets/favicon.svg
```

## Sections

| # | Section | Notes |
|---|---------|-------|
| — | Header | Fixed pill nav (outside the hero so it stacks above every section); tucks up with a soft shadow once the page scrolls. |
| 1 | Hero | Headline, CTA, stat card, tag chips over a navy fade at the base of the photo. `100svh`. |
| 2 | About | Centered message with two offset portraits and contact details. |
| 3 | Services | Photo with badge, three service cards — hover/focus moves the "active" state. |
| 4 | Experts | Team cards with social links, CEO tile, doctors tile. |
| 5 | Testimonial | Story card, portrait, 5-star rating and quote on midnight navy. |
| 6 | Blog | Article card with Previous / Next switcher (3 posts in `js/main.js`). |
| 7 | Contact | Validated form + photo with quote card. |
| 8 | Footer | Brand, newsletter, link columns, offices, socials. |

## Design tokens (`:root` in `css/style.css`)

- **Colour** — navy `#2e4a70` (primary), midnight `#141e2f`, footer `#213550`, surface `#f6f6f6`, card tint `#f2f6fc`, star `#f2a33a`.
- **Type** — Google Sans variable; h2 46/52, hero 70/78, body 16/24.
- **Layout** — 1346px content width, 39px gutter (16px on mobile), 99px section rhythm, 25px column gap.
- **Shape** — pill buttons (`999px`, unchanged on hover), 14/20/24px radii.

## Breakpoints

- `≤1340px` — fluid grid columns.
- `≤1180px` — burger menu, stacked services/experts/contact, two-column footer.
- `≤1180px portrait` and `≤760px` — hero photo sits low and fades into the sky so the headline reads on clean sky.
- `≤760px` — single column throughout, full-width CTAs.

## Motion

GSAP + ScrollTrigger drive a hero intro timeline, a gentle hero parallax and one-shot reveals per section (rise, image scale-in, staggered cards, star pop). Only `transform` and `opacity` are animated. With `prefers-reduced-motion: reduce`, GSAP and Lenis are skipped entirely and everything renders static. If the scripts fail to load, the hero copy is revealed after 2.5s.

## Accessibility & performance

Semantic landmarks, one `h1`, labelled form fields, focus-trapped mobile menu with Escape to close, visible focus rings, `alt` text on content images. Fonts and scripts are self-hosted; the hero image is preloaded; everything below the fold lazy-loads with explicit dimensions.

## Deploy

Static hosting (Netlify, Vercel, GitHub Pages, S3) — upload the folder as-is. No paths start with `_`, so GitHub Pages needs no `.nojekyll`.

## Image note

The photography was extracted from the design reference (`6572a45042d9c44c6792db85c2c83ae0.webp`) and cleaned of overlaid UI. Swap in the original licensed source photos before going to production — keep the same aspect ratios, since the hero, Sarah Lee and contact cards position their overlays against them.
