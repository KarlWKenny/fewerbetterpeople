// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://fewerbetterpeople.ca',
  build: {
    // Inline all CSS — the stylesheet is small and this removes a
    // render-blocking request, which is worth ~0.5s LCP on mobile networks.
    inlineStylesheets: 'always',
  },
  integrations: [
    preact(),
    sitemap({
      // /writing and /work are built but hidden until there is real content.
      // When one goes live: remove it here (see CLAUDE.md "Flipping hidden
      // sections on").
      filter: (page) => !page.includes('/writing') && !page.includes('/work'),
    }),
  ],
});
