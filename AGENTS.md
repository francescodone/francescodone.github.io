# Francesco Done Portfolio — Agent Guide

## Project Overview
Scroll-driven encyclopedia portfolio styled as an open book. Scrolling turns pages, each spread showing a vintage illustration plate (left) and text content (right). Built with React, GSAP, and Framer Motion.

## Commands
- `npm run dev` — Start dev server (Vite, port 5173)
- `npm run build` — TypeScript check + Vite production build
- `npm run preview` — Preview production build locally

## Architecture
```
shell/          → Application Shell (Book, ScrollEngine, HUD, LoadingScreen)
sections/       → Journey content (BookPage, EncyclopediaIllustrations)
shared/         → Types, hooks, contexts, tokens, utils
```

**Key components:**
- `Book.tsx` — Open-book shell with page spreads, spine, page edges, page-turn transitions
- `BookPage.tsx` — Individual page content: illustration plate (left) + text page (right)
- `EncyclopediaIllustrations.tsx` — SVG line-art: fern, butterfly, swallow, oak, herb, bee, wildflower, compass rose
- `ScrollEngine.tsx` — Lenis smooth scroll + GSAP ScrollTrigger driving page turns

**Dependency rules:**
- Sections import only from `@shared/*`, never from each other or `@shell/*`
- Shell imports from `@shared/*` and `@sections/*/`
- Shared never imports from sections or shell

## Key Technologies
- React 19, TypeScript 6, Vite 8
- GSAP + ScrollTrigger, Lenis (smooth scroll)
- Framer Motion (page transitions, details expand)
- Tailwind CSS 4

## Design System
- **Fonts**: Manrope (display/sans), Newsreader (body), JetBrains Mono (mono)
- **Light theme**: Sage-green background (#c5c1a5), aged paper (#e8e2cc), burnt sienna accent (#8b3a1a)
- **Dark theme**: Dark olive vellum (#1c1e14), copper accent (#c47a48)
- **Book pages**: Paper surface (`--card-bg`, `--card-border`), visible spine, stacked page edges
- **Illustrations**: SVG line-art in decorative frames with corner ornaments, Roman numeral plate headers
- **Decorations**: Ornamental star separators, thin rule lines, running headers

## Data Source
All portfolio content comes from `public/data/portfolio.json`. Update this file to change portfolio content.

## Path Aliases
- `@shell/*` → `src/shell/*`
- `@sections/*` → `src/sections/*`
- `@shared/*` → `src/shared/*`

## Deploy
Static site on GitHub Pages. Build output goes to `dist/`.
