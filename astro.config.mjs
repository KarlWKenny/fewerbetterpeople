// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://fewerbetterpeople.ca',
  integrations: [
    preact(),
    sitemap({
      // /writing is built but hidden until there are ~3 articles.
      // When it goes live: delete this filter (see CLAUDE.md "Flipping /writing on").
      filter: (page) => !page.includes('/writing'),
    }),
  ],
});
