# Print Swap — Website Style Guide

**Audience:** Developers and designers working on `printswap-intro` (print-swap.com)  
**Primary reference:** Print Swap iOS app style guide — in the app codebase: `docs/STYLE_GUIDE.md` and `docs/style-guide/*.md` (principles, colours, typography, spacing, components, accessibility)  
**Scope:** Static marketing and legal pages (HTML + CSS)  
**Last updated:** 2026-04-13

---

## Quick reference

| Need | Section |
|------|---------|
| Brand principles | [Principles](#1-principles) |
| Colours and CSS variables | [Colour](#2-colour) |
| Fonts and hierarchy | [Typography](#3-typography) |
| Columns, alignment, rhythm | [Spacing and layout](#4-spacing-and-layout) |
| Buttons, banners, media | [Components](#5-components) |
| Which layout for which page | [Page types](#6-page-types) |
| Contrast, focus, tap targets | [Accessibility](#7-accessibility) |
| Post-launch and housekeeping | [Maintenance](#8-maintenance) |

---

## 1. Principles

Inherited from the app guide’s design principles. On the web they translate as follows.

### Brand voice

Print Swap connects artists through mutual admiration and physical prints. The site should feel:

- **Trustworthy** — Clear copy, no dark patterns, accurate legal pages  
- **Art-forward** — Layout and type support imagery (screenshots, future photography) without competing  
- **Warm but professional** — Restrained, not “startup loud”

### Guiding rules

1. **Consistency over novelty** — Reuse components and tokens; avoid one-off hex or font sizes  
2. **Semantic over literal** — Prefer CSS custom properties (`var(--color-primary)`) over scattered hex  
3. **Accessibility by default** — WCAG 2.1 AA, visible focus, sufficient tap targets  
4. **Page-type awareness** — Landing pages and legal/informational pages use different layout rules (see [Page types](#6-page-types))  
5. **Single source of truth** — Colours and spacing live in `:root` in `style.css` (once migrated); components use those tokens

### Page-type awareness (web-specific)

Every new page must be classified as **Landing** or **Reading** before layout work begins. Mixing rules (e.g. centring body copy that should read in a narrow column) creates the “inset vs wide vs centred” confusion seen when one `max-width` is used for everything.

---

## 2. Colour

### Alignment with the app palette

The app’s base palette lives in `DesignSystem/AppColors.swift` / `AppPalette`. The website uses the same **core brand colours** where the app does for primary UI and text.

| App role (conceptual) | AppPalette hex | Web CSS variable | Usage on site |
|------------------------|----------------|------------------|---------------|
| Dark Navy | `#003d5b` | `--color-primary` | Body text, headings, primary buttons, founding banner background |
| Medium Blue | `#30638e` | `--color-link` | Links, focus outline, hover on primary actions |
| Gray | `#6b7280` | `--color-secondary` | Secondary / supporting text, footer, muted copy |
| White | `#ffffff` | `--color-on-primary` | Text on dark banner, button label on filled primary |
| (surface) | `#fafafa` | `--color-surface` | Page background |
| (border) | `#e5e5e5` | `--color-border` | Dividers, hero/footer borders, subtle rules |
| Black (badge) | `#000000` | — | App Store badge only (Apple asset; do not recolour) |

**Not used on the current static site** (reserved for parity if components grow): Coral Red, Golden Amber, Teal — see app `02-colors.md` for semantic roles (success, warning, destructive). Do not introduce them ad hoc; add variables here if marketing or forms need them.

### Implementation

Define once on `:root` in `style.css`:

```css
:root {
  --color-primary: #003d5b;
  --color-link: #30638e;
  --color-secondary: #6b7280;
  --color-surface: #fafafa;
  --color-border: #e5e5e5;
  --color-on-primary: #ffffff;
}
```

**Do:** use `var(--color-primary)` (and siblings) in new and refactored rules.  
**Don’t:** add new arbitrary hex in components without updating this table.

### Contrast

Pairings intended for production:

- Primary text on `--color-surface` — OK for body  
- `--color-on-primary` on `--color-primary` — banner, filled buttons  
- `--color-link` on `--color-surface` — links (underline aids recognition)

---

## 3. Typography

### Font choice vs app

| Platform | Family | Notes |
|----------|--------|--------|
| iOS app | GT Ultra / GT Ultra Fine | Licensed for app embedding; see app `03-typography.md` |
| Website | **Quattrocento Sans** (Google Fonts) + system fallbacks | Web-licensed, close in spirit (humanist, calm). **Do not** use `.font(.system)` equivalents as arbitrary stacks; keep Quattrocento Sans as the brand web face unless GT Ultra gains a web licence |

Optional display accent: **Quattrocento** for rare marketing headlines only if you extend the font link — default is Quattrocento Sans throughout for simplicity.

### Type scale (current contract)

Refine in CSS as needed; document changes here.

| Role | Approx. size | Weight | Usage |
|------|--------------|--------|--------|
| Hero H1 | `clamp(2.25rem, 7vw, 4rem)` | 700 | Homepage hero only |
| Page H1 (compact pages) | `2.5rem` → `3rem` ≥640px | 700 | Legal/support headers |
| Section H2 (marketing) | `clamp(1.4rem, 4vw, 2rem)` | 700 | Launch, How it works, Final CTA |
| Section H2 (legal default) | `1.25rem` | 400 | Subdued legal subheads (existing pattern) |
| Body | `1.125rem` → `1.1875rem` ≥640px | 400 | Default paragraphs |
| Subhead / lead | `1.125rem` | 400 | Hero subheadline (primary colour) |
| Mechanism / muted | `1rem` | 400 | Secondary hero line (gray) |
| Small / footer | `0.9375rem` / `0.875rem` | 400 | Footer, notes |

### Alignment rule (fixes layout drift)

- **Centred:** Only content inside **`.hero`** (logo, H1, subheadline, mechanism, `.screenshots`, `.hero-ctas`) and **`.final-cta`** (closing headline + App Store badge) and **`.footer`**.  
- **Left-aligned:** All **`.section`** body copy, lists, launch block, “How it works”, and every **legal page** main column.  
- **Do not** centre long paragraphs outside the hero or final CTA.

---

## 4. Spacing and layout

### Two column modes

| Mode | `max-width` | Horizontal padding | Use for |
|------|-------------|--------------------|---------|
| **Reading** | `40rem` (~640px) | `1.5rem` mobile, `2rem` ≥640px | Privacy, Pricing, Compliance, Terms, Support; any long-form text |
| **Landing** | `52rem` (~832px) | Same | Homepage (and future campaign landings) so screenshots and CTAs breathe |

**Implementation:** Default `main` uses `--layout-reading` (`40rem`). Homepage uses `<main class="main main--landing">` so `max-width` is `--layout-landing` (`52rem`). Footer width follows via `main.main--landing ~ .footer`. Legal pages omit `main--landing`.

### Section vertical rhythm

- Between major sections: `3.5rem` mobile, `4rem` ≥640px (`margin-bottom` on `.section`)  
- Hero bottom border: `1px solid var(--color-border)` with padding-bottom as now  
- Final CTA: `border-top` before closing block

### Inset blocks (accent rail)

- **Launch / founding block (`.section--launch`):** no left rail — aligns flush with other body sections.  
- **Notes / quotes:** `border-left: 3px solid var(--color-border)` + muted text (`.how-note`); **legal draft** uses stronger left border — keep distinct purposes.

### Screenshots

- Grid: `repeat(auto-fit, minmax(160px, 1fr))` mobile; three columns ≥640px where space allows  
- Images: `max-width: 280px`, `border-radius: 16px`, light shadow — do not crop in a way that hides the “two prints / swap” idea  
- Lazy-load images; provide `width` and `height` attributes matching intrinsic dimensions to limit CLS

---

## 5. Components

### Founding banner (`.founding-banner`)

- Full width, `background: var(--color-primary)`, `color: var(--color-on-primary)`  
- Centred text, small type (~0.9rem)  
- **Removal:** delete entire block after 1 May (see [Maintenance](#8-maintenance))

### Primary button (`.btn-primary`)

- Filled `var(--color-primary)`, white text, `min-height: 44px`, rounded corners (~4px)  
- Hover: shift toward `var(--color-link)` or slightly lighter navy — keep one hover rule sitewide

### Secondary button (`.btn-secondary`)

- Outline `2px solid var(--color-primary)`, transparent fill  
- Hover: invert (fill primary, white text)

### App Store (`.btn-appstore` + official SVG)

- Wrapper is transparent; **never** draw an extra black box behind Apple’s badge  
- Badge image: preserve aspect ratio; typical display height ~40–44px  
- Apple’s artwork must not be modified (colours, cropping of badge graphic)

### Legal draft (`.legal-draft`)

- Muted panel, left accent, for “draft — pending review” only  
- Remove when page is final

### Footer (`.footer`)

- Centred; `max-width` matches `main` of the page type  
- Link colour: use `var(--color-link)`; separators neutral gray

### Logo

- Hero: 120px → 150px ≥640px  
- Compact pages: `.hero--compact` spacing

---

## 6. Page types

| Type | Examples | `main` class / width | Text alignment |
|------|----------|----------------------|----------------|
| **Reading** | `/privacy`, `/pricing`, `/compliance`, `/terms`, `/support` | Reading column `40rem` | Left |
| **Landing** | `/` (homepage) | Landing column `52rem` | Hero + final CTA centred; sections left |

**Adding a page:** choose type → copy an existing page of the same type → keep header/footer consistent → use the same `link` to `style.css` and font preconnects.

---

## 7. Accessibility

- **Contrast:** maintain documented colour pairings; test with WebAIM or Lighthouse if palette changes  
- **Focus:** `outline: 2px solid var(--color-link)`; `outline-offset: 2px` on interactive elements  
- **Tap targets:** minimum **44px** height on buttons and badge hit area (padding on `.btn-appstore` wrapper)  
- **Images:** meaningful `alt` on screenshots; App Store badge alt exactly “Download on the App Store”  
- **Landmarks:** one `main`, header/footer roles as now; banner outside `main` is acceptable for full-width strip  
- **Motion:** no autoplay video; respect `prefers-reduced-motion` if adding transitions later

---

## 8. Maintenance

### Post–1 May (founding campaign)

Remove or rewrite:

1. `.founding-banner` block in `index.html`  
2. Secondary hero CTA (“Upload your work before 1 May”)  
3. Entire `#launch` section  
4. Copy that references founding exhibition / 1 May deadline elsewhere on the homepage

### Post–7 May (swaps live)

Replace homepage with post-launch messaging; keep this guide’s **Page types** and **Colour** sections. Update hero/final CTA copy; screenshots may change.

### CSS hygiene

- When touching a rule, migrate hardcoded hex to `var(--color-*)` where a token exists  
- Avoid duplicating button or section spacing — extend existing classes

### Repo location

This file: `printswap-intro/docs/STYLE_GUIDE_WEB.md`  
Styles: `printswap-intro/style.css`  
Templates: `printswap-intro/index.html`, `*/index.html` per route

---

## Do / Don’t (web)

| Do | Don’t |
|----|--------|
| Use CSS variables from `:root` for brand colours | Sprinkle new `#003d5b` literals without updating `:root` |
| Centre only hero, final CTA, footer | Centre long body sections on landing pages |
| Use official Apple badge asset as supplied | Redraw or restyle the App Store badge |
| Match Reading vs Landing `max-width` to page type | Use one global width for homepage and privacy policy without adjustment |
| Keep legal pages calm (smaller H2) | Reuse hero H1 scale on `/privacy` |

---

## Related documents

- **App:** `Print Swap/docs/STYLE_GUIDE.md` and `docs/style-guide/01–08`  
- **App colours:** `DesignSystem/AppColors.swift`  
- **App typography:** `Utils/FontManager.swift`, `docs/style-guide/03-typography.md`  
- **Apple marketing:** [App Store marketing guidelines](https://developer.apple.com/app-store/marketing/guidelines/) (badges, copy)
