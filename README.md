# fewerbetterpeople.ca

Site for Karl Kenny — interim & fractional CEO for the industrial
mid-market. Astro, static output, Cloudflare Pages.

Read `CLAUDE.md` before making changes — it encodes the design system, voice,
and the decisions that are expensive to reverse.

## Local dev

```
npm install
npm run dev        # dev server at localhost:4321 (drafts visible)
npm run build      # production build to dist/ (drafts excluded)
npm run preview    # serve the production build
npm run check      # typecheck (astro check)
```

Node 22+. No environment variables needed.

## Dependencies (all load-bearing)

| Package            | Why                                                        |
| ------------------ | ---------------------------------------------------------- |
| `astro`            | the framework                                              |
| `@astrojs/sitemap` | sitemap generation                                         |
| `@astrojs/rss`     | RSS feed for /writing                                      |
| `@astrojs/preact` + `preact` | islands for /tools — smallest runtime, loaded only on pages that use it |
| `typescript` + `@astrojs/check` | typechecking (dev only)                       |
| `@fontsource/*`    | dev-only source for the committed woff2 files in `public/fonts` |

## Adding content

New entries start as `draft: true` (visible in dev, excluded from production
builds). Flip to `draft: false` to publish.

**Case study** — copy `src/content/work/example-case-study.md` to a new file
(`src/content/work/<slug>.md`; the filename is the URL slug). Fill every
field; the outcomes table wants real before/after numbers. Do not invent
results.

**Article** — copy `src/content/writing/example-article.md` to
`src/content/writing/<slug>.md`. `/writing` is currently built but hidden
(no nav link, noindex, out of sitemap) until there are ~3 articles — the
flip procedure is in `CLAUDE.md`.

**Service / principle** — add a file to `src/content/services/` or
`src/content/principles/` following an existing one; `order` controls sort.

**Tool** — add `src/pages/tools/<slug>.astro` plus an island component in
`src/components/islands/`, hydrated with `client:visible`. The stub at
`/tools/owner-operator-diagnostic` proves the pattern; its intended first
build-out is described in `OwnerOperatorDiagnostic.tsx`.

## Fonts

Self-hosted woff2 in `public/fonts` (SIL OFL — see `public/fonts/LICENSE.md`),
preloaded in `Base.astro`, with metric-matched local fallbacks in
`src/styles/fonts.css` for zero layout shift. If you change font files,
recompute the `size-adjust`/`ascent-override` values (fontkit script — ask
Claude to rerun the calculation, method noted in `fonts.css`).

## OG images

`public/og/default.png` is the site-wide fallback (1200×630). Per-page
images: `public/og/<slug>.png`, passed to the layout via the `ogImage` prop.
Regenerate from the template:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot=public/og/default.png "file://$PWD/scripts/og-template.html"
```

## CI

`.github/workflows/pr-checks.yml` runs typecheck, build, and an internal
link check on every PR. Deployment is **not** done by Actions — Cloudflare
Pages builds from Git.

## Deploy — Cloudflare Pages (manual setup, one time)

1. Cloudflare dashboard → Workers & Pages → Create → Pages →
   connect the `KarlWKenny/fewerbetterpeople` GitHub repo.
2. Build settings: framework preset **Astro**, build command `npm run build`,
   output directory `dist`. Node version 22 (set `NODE_VERSION=22` env var).
3. Custom domain: add apex `fewerbetterpeople.ca` (Pages will create the
   CNAME/flattened record on the zone).
4. Server endpoints later: files in `/functions` deploy automatically as
   Pages Functions — no host migration needed.

### DNS / redirects (apply in the Cloudflare dashboard)

Canonical host is the **apex** `fewerbetterpeople.ca`.

- `www.fewerbetterpeople.ca` → 301 to apex. Easiest: a Redirect Rule on the
  zone — `(http.host eq "www.fewerbetterpeople.ca")` → dynamic
  `concat("https://fewerbetterpeople.ca", http.request.uri.path)`, 301,
  preserve query string — plus a proxied `AAAA 100::` (or CNAME to the
  Pages project) record for `www` so the rule has something to attach to.
- `ownernotoperator.ca` (and `www.` thereof): add the zone to the same
  Cloudflare account, proxied placeholder record, same-style Redirect Rule
  to `https://fewerbetterpeople.ca` (301).
- Enable **Cloudflare Web Analytics** for the site in the dashboard (no
  script tag needed — injected/measured at the edge). No other analytics.

## Repo

GitHub: `KarlWKenny/fewerbetterpeople` (public). `gh` CLI wasn't available at
scaffold time; create + push once the first commit is reviewed:

```
gh repo create KarlWKenny/fewerbetterpeople --public --source . --push
```
