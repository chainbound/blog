import { getAuthor } from '@/lib/authors';
import { baseUrl, blog } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const posts = [...blog.getPages()]
    .filter((post) => !post.data.hidden)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const items = posts
    .map((post) => {
      const url = `${baseUrl}${post.url}`;
      const pubDate = new Date(post.data.date).toUTCString();
      const authors = post.data.authors
        .map((id) => getAuthor(id).name)
        .join(', ');

      const categories =
        post.data.tags
          ?.map((tag) => `      <category>${escapeXml(tag)}</category>`)
          .join('\n') ?? '';

      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.data.description ?? '')}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(authors)}</author>
${categories}
    </item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Chainbound Engineering Blog</title>
    <link>${baseUrl}</link>
    <description>Technical insights and engineering updates from Chainbound</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
