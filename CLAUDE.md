# CLAUDE.md — fewerbetterpeople.ca

This file encodes the decisions behind this site so a future session that has
never seen the original conversation makes the same choices. Read it before
changing anything. When in doubt, do less.

## Positioning and audience

Karl Kenny works directly for owners of privately held **owner-led
companies** — typically $10M–$100M revenue — as a **Professional
Integrator** (the public label since 2026-08-03; "industrial mid-market"
framing was dropped the same day). The engagement types are: Interim
Executive, Fractional Integrator, Operating system install, Exit. Not
advice:
he takes the seat, sets the organization, defines the roles, installs the
operating system (EOS/Traction cadence, scorecards, comp design, reporting),
deploys AI tooling against non-value-add work, and builds the management
team until the owner can step back. **The engagement is designed to end.**

Brand: **"fewer, better people"** — smaller headcount, sharper role
definition, better systems. Companion line: **"step up to owner, step back
from operator."**

The visitor is a 55–70 year old owner who built the company, is exhausted by
it, has a management team that escalates everything to him, and is preparing
to exit or realizing he can't. He is skeptical of consultants and responds to
evidence of operating competence, not marketing. **Every design and copy
decision must be legible to that man on a phone in a truck cab.**

## Voice

- Plain verbs, sentence case, specific claims.
- Banned words: "unlock", "leverage", "transform", "journey", "empower",
  "solutions", "passionate". If it sounds like a consultancy wrote it, cut it.
- Short sentences. Concrete nouns. Numbers where they're true, silence where
  they aren't.
- Karl capitalizes his brand terms in running copy — Owner, Operator,
  Entrepreneur, Integrator, Strategy. Keep that convention; don't
  "correct" it to lowercase.
- Never invent clients, results, testimonials, logos, or credentials. Real
  facts or a `TODO:` marker — nothing in between.

## Architecture (decided — do not re-litigate)

- Astro, TypeScript strict. Static output; islands (Preact, `client:visible`)
  only where genuinely interactive. No global framework runtime.
- Content collections with Zod schemas for everything that recurs
  (`src/content.config.ts`). Nothing recurring gets hand-authored as a page.
- Vanilla CSS with custom properties. No Tailwind, no CSS-in-JS. Tokens live
  in `src/styles/tokens.css` and nowhere else.
- Cloudflare Pages via Git integration. Server endpoints go in `/functions`
  (Pages Functions) when needed.
- No third-party scripts. No font CDN (fonts self-hosted in `/public/fonts`).
  Analytics via Cloudflare Web Analytics only.

## URL scheme (reserved, stable, never rename)

```
/            home
/about       who Karl is, how he works
/approach    the operating model
/engagements structure, scope, fees
/work/<slug>     case studies      (collection: work)
/writing/<slug>  articles          (collection: writing)
/tools/<slug>    interactive tools (islands; stub proves the pattern)
/contact
```

Canonical host: apex `fewerbetterpeople.ca`. `www` and `ownernotoperator.ca`
301 to apex at the Cloudflare edge (configured in dashboard — see README).

## Design tokens (source of truth: `src/styles/tokens.css`)

Palette — six values, nothing else:

| Token         | Hex       | Role                                    |
| ------------- | --------- | --------------------------------------- |
| `--navy`      | `#202834` | graphite navy — the ground              |
| `--navy-deep` | `#161c25` | darker navy for footer / depth          |
| `--brass`     | `#b08a3c` | THE accent. Rare on purpose.            |
| `--brass-ink` | `#7f6122` | brass for TEXT/outlines on paper — `--brass` fails AA contrast on light ground; never use `--brass` for text on paper |
| `--paper`     | `#f5f2ea` | warm off-white background               |
| `--slate`     | `#57606d` | secondary text on paper                 |
| `--mist`      | `#c9ccd1` | hairlines, borders                      |

(Dark-section auxiliaries: `--dark-ink-2: #9aa3ae`, `--dark-rule: #39424e`.)

**Brass discipline:** brass appears only as — the wordmark dot, principle
numbers, focus outlines, hover underline/accents, button borders, and the
pull-quote rule. If brass starts appearing everywhere, it means nothing.

Type:

- Display: Barlow 700 (500 for pull quotes), tight tracking
  (`--tracking-tight: -0.012em`) at large sizes. (Was Space Grotesk;
  Karl rejected it 2026-08-03 — don't reintroduce it.)
- Body: IBM Plex Sans 400/600.
- Mono: IBM Plex Mono 400/500 — labels, figures, dimension callouts,
  uppercase with `--tracking-mono: 0.08em`.
- Modular scale `--step--1` … `--step-5` (minor→major third, fluid clamp).
  Never an ad-hoc font-size.

**Signature device — the dimension line** (`src/components/DimensionLine.astro`):
hairline rule, tick terminations, centered mono callout, borrowed from
engineering drawings. It annotates **real quantities only** (engagement
length, revenue band, headcount). If a dimension line isn't measuring
something true, delete it. Never pure decoration.

Boldness budget: the hero and the dimension lines. Everything else stays
quiet — generous whitespace, hairline rules, restrained type.

## Component inventory

| Component                      | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| `layouts/Base.astro`           | HTML shell, SEO/OG meta, font preloads         |
| `components/Header.astro`      | wordmark + mono nav (writing hidden for now)   |
| `components/Footer.astro`      | dark footer, identity + links                  |
| `components/DimensionLine.astro` | the signature annotation device              |
| `components/islands/OwnerOperatorDiagnostic.tsx` | stub island (Preact)         |

Add components sparingly; prefer page-scoped `<style>` in `.astro` files.

## Content collections (schemas: `src/content.config.ts`)

- `work` — case studies. Anonymized client descriptor, sector, revenue band,
  engagement length, situation, intervention, typed outcomes
  (metric/before/after), optional pull quote, publishDate, featured, order.
- `writing` — articles. Title, deck, dates, topics, readingTime,
  optional canonicalUrl (cross-posting), featured.
- `services` — engagement types. Name, one-line promise, whoFor, includes[],
  typicalDuration, optional pricing (fee ranges are shown publicly).
- `principles` — the tenets. Number, title, body, order.

Every collection has `draft` — drafts render in dev, are filtered from
production builds via `getPublished()` in `src/lib/content.ts`. Always load
collections through that helper.

## SEO / OG conventions

- Per-page `<title>` + meta description via `Base.astro` props. Title format:
  `<Page> — fewer, better people` (home page sets the full title itself).
- OG images: `public/og/default.png` is the fallback; per-page images follow
  `public/og/<slug>.png`, passed via the `ogImage` prop. Template + regen
  command: `scripts/og-template.html` and README "OG images".
- Sitemap auto-generated; RSS at `/rss.xml` (writing only).

## Flipping /writing on (when there are ~3 articles)

1. Add `{ href: '/writing', label: 'Writing' }` to NAV in `Header.astro`.
2. Remove the `filter` from `sitemap()` in `astro.config.mjs`.
3. Remove `noindex` from `src/pages/writing/index.astro` and
   `src/pages/writing/[slug].astro`.

## Commit conventions

- Imperative subject, lower-case scope prefix when useful:
  `content: add case study — <slug>`, `design: tighten hero spacing`,
  `tools: build owner-operator diagnostic`.
- One concern per commit. Content commits separate from design commits.
- Never commit with failing `npm run check` or `npm run build`.

## Quality floor (hold the line)

- Responsive to 360px — test the truck-cab case.
- Lighthouse 95+ all four categories on the home page.
- Visible focus states, semantic landmarks, real heading hierarchy,
  `prefers-reduced-motion` respected.
- Zero layout shift from fonts: preloaded woff2 + metric-matched fallbacks in
  `src/styles/fonts.css`. If font files change, recompute overrides
  (README "Fonts").

## Do not

- Do not write copy that sounds like a consultancy (see Voice).
- Do not invent results, clients, logos, testimonials, or credentials.
- Do not add a cookie banner, newsletter modal, chat widget, animated
  counter, or any third-party script.
- Do not add a dependency that isn't load-bearing; justify each in README.
- Do not use brass as a general-purpose color or the dimension line as
  decoration.
- Do not rename URLs. Ever.
- Do not push to GitHub or change DNS without Karl's explicit go-ahead.
