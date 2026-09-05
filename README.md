# Francesco Done' — Personal Encyclopedia

A scroll-driven portfolio presented as an open encyclopedia. Each spread pairs an original line-art plate with a chapter from Francesco's education, career, projects, and interests.

**Live site:** [francescodone.github.io](https://francescodone.github.io)

## Features

- Open-book layout with scroll, wheel, keyboard, touch, and drag navigation
- Animated page transitions powered by GSAP and Framer Motion
- Light and dark themes
- Reduced-motion support and semantic controls
- Responsive layouts for desktop and mobile screens
- Portfolio content loaded from a single JSON data source
- Search-engine and machine-readable metadata

## Tech stack

- React 19 and TypeScript 6
- Vite 8
- GSAP, ScrollTrigger, and Lenis
- Framer Motion
- Tailwind CSS 4
- GitHub Pages and GitHub Actions

## Architecture

```text
src/
├── shell/                  Application shell, book, navigation, and scrolling
├── sections/journey/       Journey pages, overlays, and illustrations
├── shared/                 Contexts, hooks, tokens, types, and utilities
├── styles/globals.css      Theme tokens and global styles
└── main.tsx                Application entry point

public/
├── data/portfolio.json     Portfolio content
├── profile.md              Machine-readable professional profile
├── llms.txt                AI crawler guidance
├── robots.txt              Crawler rules
└── sitemap.xml             Site map
```

Dependencies flow in one direction:

- Sections may import from `shared`.
- The shell may import from `shared` and `sections`.
- Shared modules do not import from the shell or sections.
- Sections do not import from other sections or from the shell.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

The development server is available at `http://localhost:5173`.

Create a production build with:

```bash
npm run build
```

Preview the production output with:

```bash
npm run preview
```

## Updating content

Edit [`public/data/portfolio.json`](public/data/portfolio.json) to update the biography, journey, projects, or contact details. Keep the data aligned with the interfaces in [`src/shared/types/portfolio.ts`](src/shared/types/portfolio.ts).

Supporting machine-readable content lives in `public/profile.md`, `public/llms.txt`, `public/robots.txt`, and `public/sitemap.xml`.

## Deployment

Changes follow the pull-request process documented in [`CONTRIBUTING.md`](CONTRIBUTING.md). Every pull request targeting `main` runs a clean production build. After a PR is merged, the `Build and deploy to GitHub Pages` workflow publishes `dist/` to [francescodone.github.io](https://francescodone.github.io).

The workflow can also be started manually from GitHub Actions.

## License

MIT
