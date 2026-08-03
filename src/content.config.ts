import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every collection carries `draft` — drafts are filtered out of production
// builds (see src/lib/content.ts). Schema fields exist even where there is
// no content yet: adding a field is trivial, restructuring forty markdown
// files is a weekend.

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    /** Anonymized descriptor, e.g. "BC-based capital equipment manufacturer, 120 staff" */
    client: z.string(),
    sector: z.string(),
    revenueBand: z.string(),
    /** e.g. "14 months" — rendered in dimension-line annotations */
    engagementLength: z.string(),
    situation: z.string(),
    intervention: z.string(),
    outcomes: z.array(
      z.object({
        metric: z.string(),
        before: z.string(),
        after: z.string(),
      }),
    ),
    pullQuote: z.string().optional(),
    publishDate: z.coerce.date(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    /** Deck / subtitle shown under the title and in listings */
    deck: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topics: z.array(z.string()).default([]),
    /** Minutes, whole number */
    readingTime: z.number().int().positive(),
    /** For cross-posting: if set, rel=canonical points here */
    canonicalUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    /** One line, plain verbs, no consultancy-speak */
    promise: z.string(),
    whoFor: z.string(),
    includes: z.array(z.string()),
    /** Optional — hidden wherever absent until real durations are set */
    typicalDuration: z.string().optional(),
    /** Fee range shown on /engagements, e.g. "$18k–$25k / month". Optional until set. */
    pricing: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const principles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/principles' }),
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, writing, services, principles };
