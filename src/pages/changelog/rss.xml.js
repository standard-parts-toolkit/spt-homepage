import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const entries = (await getCollection('changelog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'SPT Release Notes',
    description: 'Release notes for SPT — what shipped and when.',
    site: context.site,
    items: entries.map((e) => ({
      title: `v${e.data.version} — ${e.data.title}`,
      description: e.data.title,
      pubDate: e.data.date,
      link: `/changelog/${e.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
