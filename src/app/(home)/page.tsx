import { HomePageContent } from '@/components/home-page-content';
import { getAuthor } from '@/lib/authors';
import { blog } from '@/lib/source';

export default function HomePage() {
  const posts = [...blog.getPages()]
    .filter((post) => !post.data.hidden)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

  // Get top 5 most popular tags
  const tagCounts = posts
    .flatMap((p) => p.data.tags || [])
    .reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  // Transform posts for the client component
  const transformedPosts = posts.map((post) => ({
    url: post.url,
    title: post.data.title,
    description: post.data.description,
    date:
      typeof post.data.date === 'string'
        ? post.data.date
        : post.data.date.toISOString().slice(0, 10),
    authors: post.data.authors.map(getAuthor),
    tags: post.data.tags,
  }));

  return (
    <HomePageContent
      postsLength={posts.length}
      posts={transformedPosts}
      topTags={topTags}
    />
  );
}
