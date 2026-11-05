import rss from '@astrojs/rss';
import { getArticles } from '../lib/articles';
import { SITE, topicById } from '../site.config';

export async function GET(context) {
  const articles = await getArticles();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.dek,
      pubDate: a.data.date,
      link: a.url,
      categories: [topicById(a.data.topic)?.name ?? a.data.topic, ...a.data.tags],
      author: a.data.author,
    })),
    customData: `<language>en-gb</language>`,
  });
}
