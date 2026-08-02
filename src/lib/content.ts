import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Load a collection with drafts filtered out of production builds.
 * In dev, drafts are visible so placeholder content can be worked on.
 */
export async function getPublished<C extends CollectionKey>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  return entries.filter((entry) => import.meta.env.DEV || entry.data.draft !== true);
}

export function byOrder<T extends { data: { order?: number } }>(a: T, b: T): number {
  return (a.data.order ?? 0) - (b.data.order ?? 0);
}

export function byDateDesc<T extends { data: { publishDate: Date } }>(a: T, b: T): number {
  return b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
