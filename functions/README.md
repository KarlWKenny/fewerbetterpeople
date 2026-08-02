# Pages Functions

Server endpoints for this site, deployed automatically by Cloudflare Pages
from this directory (file-based routing: `functions/api/contact.ts` →
`/api/contact`).

Empty on purpose. Planned endpoints:

- `api/contact.ts` — contact form handler (validate, forward by email, no
  third-party form service).
- `api/diagnostic.ts` — receives owner-vs-operator diagnostic results +
  email capture (see `src/components/islands/OwnerOperatorDiagnostic.tsx`).

Local dev once functions exist: `npm run build && npx wrangler pages dev dist`.
