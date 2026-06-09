# AGENTS.md

## Quick Start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # next lint
```

No test framework is configured. No CI/CD pipelines exist.

## Mandatory Pre-flight

Before designing or generating any project detail page, read both:
- `PRODUCT.md` — brand personality, anti-references, design principles
- `DESIGN.md` — complete design token system, template selection rules, do's/don'ts

Strictly follow DESIGN.md's template decision tree. Determine whether the case uses **Evidence Rail**, **Linear System**, or **Cinematic Archive** before writing any code. Never force all cases into a single template.

## Architecture

Next.js 14 App Router portfolio for a game UX designer. Chinese-language content with English code.

### Routes

| Path | Purpose |
|------|---------|
| `/` | Home: video hero, history timeline, project showcase, skills, sites |
| `/projects` | Project list with grid cards |
| `/projects/[slug]` | Project detail with case stories |
| `/projects/[slug]/[caseId]` | Individual case detail (media gallery + markdown) |
| `/sites` | Standalone site collection with iframe previews |
| `/api/og` | OG image generation (edge runtime) |

### Data Layer

All content lives in `data/*.ts` as typed arrays — no CMS, no API calls.

- `data/projects.ts` — `Project[]` with nested `cases[]`. Each case can have a `story: CaseStory` for structured templates or fall back to `articleMDX` markdown.
- `data/sites.ts` — `SiteItem[]` for standalone site cards.
- `data/skills.ts`, `data/about.ts`, `data/hero.ts` — page-specific content.

**Adding a new project**: add entry to `projects[]` array. The `slug` becomes the URL. Cases need unique `id` values (used as anchor IDs and URL segments).

### Case Story Template System

The most complex part of the codebase. Three templates selected by data shape:

1. **Evidence Rail** (`story` exists, `layout` undefined or `'rail'`) — for conversion/optimization cases with before/after evidence. Sticky left sidebar framework + alternating decision cards.
2. **Linear System** (`story.layout === 'linear'`) — for system design cases. Single-column narrative with IA tree visualization.
3. **Cinematic Archive** (no `story`, has `cover` + `articleMDX`) — fallback for legacy long-image cases.

Template dispatch: `components/projects/project-work-wall.tsx:71-76`

**Hidden cases**: `project-detail-nav.tsx` hardcodes hidden case IDs per project slug (`myth-quest` hides `Consistency`/`UEprocess`, `dahua2` hides `manage`).

### Key Component Map

```
components/
  projects/
    project-work-wall.tsx    # Template dispatcher + GSAP scroll reveals
    case-story.tsx           # Evidence Rail template
    system-case-story.tsx    # Linear System template
    project-detail-nav.tsx   # Sticky nav with IntersectionObserver
    project-featured-cases.tsx # Secondary evidence archive (gallery/slides)
  motion/
    delight-layer.tsx        # Global micro-interactions (cursor halo, progress bar)
    gsap-reveal.tsx          # Reusable scroll-triggered reveal
  audio/
    bgm-provider.tsx         # Background music context
    bgm-toggle.tsx           # Audio control button
  ui/                        # shadcn-style primitives (Button, Card, Dialog, etc.)
  sections/                  # Homepage section components
```

## Design System

Read `DESIGN.md` before making visual changes. It documents the complete design token system, template rules, and do's/don'ts.

**Color tokens** are HSL CSS variables in `app/globals.css` — never hardcode hex values. The palette is warm-dark: deep brown-black backgrounds, gold (`--primary`) for emphasis, orange (`--accent`) sparingly.

**Typography**:
- Body: Noto Sans SC (system sans fallback)
- Display: Noto Serif SC (serif fallback)
- Pixel labels: Press Start 2P (loaded via `next/font/google`, CSS var `--font-pixel`)

**Animation**: GSAP is the primary animation library. Registered plugins:
```typescript
gsap.registerPlugin(useGSAP, ScrollTrigger)
```
Easing: `power2.out` / `power3.out` / `cubic-bezier(0.22, 1, 0.36, 1)`. All animations must respect `prefers-reduced-motion: reduce`.

## Gotchas

### Remote Images
Only these hostnames are allowed in `next.config.mjs` `images.remotePatterns`:
- `images.unsplash.com`, `i.imgur.com`, `placehold.co`, `cdn.pixabay.com`, `res.cloudinary.com`

Add new domains there before using them in `<Image>` or data.

### Path Alias
`@/*` maps to project root (`./`). Use `@/components/...`, `@/data/...`, `@/lib/...`.

### Markdown Rendering
Uses `marked` library (not `react-markdown` despite what README says). Markdown is parsed to HTML string, then `transformMediaLinks()` from `lib/media.ts` auto-converts bare image/video URLs into `<img>`/`<video>` elements.

### CSS Architecture
- `globals.css` contains ALL custom CSS (3000+ lines). Includes component-specific styles like `.cs-*` (case story), `.skill-*` (skills section), `.work-*` (work article).
- `overflow-x: clip` on `html` prevents horizontal scroll from full-bleed sections.
- `body::before` adds a subtle grid overlay (z-index 80, pointer-events none).

### GSAP Context
`useGSAP` hook requires `{ scope: ref }` pattern. Always pass `dependencies` array for re-renders. Example in `project-work-wall.tsx:61`.

### Site Embeds
Sites use iframe with sandbox attributes defined in `lib/embed-config.ts`. Some sites block iframes via `X-Frame-Options` — the modal handles this gracefully.

### localStorage Uploads
The case detail page supports local image/video uploads stored as DataURLs in `localStorage`. This is preview-only, not persistent storage.

## File Conventions

- Components: PascalCase exports, kebab-case filenames
- Data files: camelCase exports, kebab-case filenames
- CSS classes: kebab-case, component-prefixed (`.cs-*`, `.skill-*`, `.work-*`)
- TypeScript strict mode enabled
- No barrel files (index.ts) — direct imports only
