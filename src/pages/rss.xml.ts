import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublished, byDateDesc } from '../lib/content';

export const GET: APIRoute = async (context) => {
  const articles = (await getPublished('writing')).sort(byDateDesc);
  return rss({
    title: 'fewer, better people — writing',
    description:
      'Articles on running owner-led companies: fewer, better people; operating cadence; and getting the owner out of the operator seat.',
    site: context.site!,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.deck,
      pubDate: a.data.publishDate,
      link: `/writing/${a.id}`,
    })),
  });
};
