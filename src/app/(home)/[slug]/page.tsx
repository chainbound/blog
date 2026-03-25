import { BlogToc } from '@/components/blog-toc';
import { IdeaIcon } from '@/components/mdx/idea-icon';
import { Mermaid } from '@/components/mdx/mermaid';
import { ShareButtons } from '@/components/share-buttons';
import { getAuthor } from '@/lib/authors';
import { baseUrl, blog } from '@/lib/source';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';

const fontMono = 'font-[family-name:var(--font-at-hauss-mono)]';

// Wrapper to add styles while preserving fumadocs heading functionality
function createStyledHeading(
  Component: typeof defaultMdxComponents.h1,
  sizeClass: string,
) {
  return function StyledHeading(props: ComponentProps<'h1'>) {
    return (
      <Component
        {...props}
        className={`${props.className ?? ''} ${fontMono} ${sizeClass}`}
      />
    );
  };
}

const mdxComponents = {
  ...defaultMdxComponents,
  h1: createStyledHeading(defaultMdxComponents.h1, 'text-3xl'),
  h2: createStyledHeading(defaultMdxComponents.h2, 'text-2xl'),
  h3: createStyledHeading(defaultMdxComponents.h3, 'text-xl'),
  h4: createStyledHeading(defaultMdxComponents.h4, 'text-lg'),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  img: (props: ComponentProps<'img'>) => <ImageZoom {...(props as any)} />,
  pre: ({ children, ...props }: ComponentProps<'pre'>) => {
    if (
      children &&
      typeof children === 'object' &&
      'props' in children &&
      children.props &&
      typeof children.props === 'object' &&
      'className' in children.props &&
      typeof children.props.className === 'string' &&
      children.props.className.includes('language-mermaid')
    ) {
      const code =
        'children' in children.props &&
        typeof children.props.children === 'string'
          ? children.props.children
          : '';
      return <Mermaid chart={code.trim()} />;
    }

    return (
      <defaultMdxComponents.pre {...props}>{children}</defaultMdxComponents.pre>
    );
  },
  IdeaIcon,
  Mermaid,
};

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;
  const authorDetails = page.data.authors.map(getAuthor);

  // Filter the TOC to only include headings up to a certain depth
  const maxTocDepth = 3;
  const filteredToc = page.data.toc.filter((item) => item.depth <= maxTocDepth);
  const tocItems = filteredToc.map((item) => ({
    title: item.title,
    url: item.url,
    depth: item.depth,
  }));

  const postUrl = `${baseUrl}/${params.slug}`;

  const currentTags = new Set(page.data.tags ?? []);
  const suggestedPosts = blog
    .getPages()
    .filter(
      (candidate) =>
        !candidate.data.hidden && candidate.slugs[0] !== params.slug,
    )
    .map((candidate) => {
      const candidateTags = candidate.data.tags ?? [];
      const sharedTags = candidateTags.filter((tag) => currentTags.has(tag));

      return {
        url: candidate.url,
        title: candidate.data.title,
        description: candidate.data.description,
        date: new Date(candidate.data.date),
        sharedTags,
      };
    })
    .sort((a, b) => {
      if (b.sharedTags.length !== a.sharedTags.length) {
        return b.sharedTags.length - a.sharedTags.length;
      }

      return b.date.getTime() - a.date.getTime();
    })
    .slice(0, 3);

  return (
    <div className="article-page min-h-screen bg-fd-background">
      {/* Main layout container - aligned with header max-w-5xl */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex gap-8 py-8 sm:py-12">
          {/* Main content column */}
          <article className="flex-1 min-w-0 max-w-[680px]">
            {/* Title */}
            <h1
              className={`text-4xl font-medium mb-3 article-entrance article-entrance-delay-1 ${fontMono}`}
            >
              {page.data.title}
            </h1>

            {/* Description */}
            {page.data.description && (
              <p className="text-fd-muted-foreground leading-relaxed mb-5 article-entrance article-entrance-delay-2">
                {page.data.description}
              </p>
            )}

            {/* Metadata row */}
            <div
              className={`flex flex-wrap items-center gap-4 text-sm text-fd-muted-foreground mb-4 article-entrance article-entrance-delay-3 ${fontMono}`}
            >
              {/* Stacked avatars */}
              <div className="flex items-center gap-3">
                {authorDetails.length > 1 && (
                  <div className="flex -space-x-2">
                    {authorDetails.map((author) =>
                      author.avatar ? (
                        <Image
                          key={author.name}
                          src={author.avatar}
                          alt={author.name}
                          width={28}
                          height={28}
                          className="rounded-full border-2 border-fd-background"
                        />
                      ) : (
                        <div
                          key={author.name}
                          aria-hidden="true"
                          className="w-7 h-7 rounded-full bg-fd-muted border-2 border-fd-background"
                        />
                      ),
                    )}
                  </div>
                )}
                {authorDetails.length === 1 && authorDetails[0].avatar && (
                  <Image
                    src={authorDetails[0].avatar}
                    alt={authorDetails[0].name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                )}
                {/* Author names */}
                <span>
                  {authorDetails.map((author, i) => (
                    <span key={author.name}>
                      {author.url ? (
                        <Link
                          href={author.url}
                          className="text-fd-foreground hover:text-fd-primary transition-colors"
                        >
                          {author.name}
                        </Link>
                      ) : (
                        <span className="text-fd-foreground">
                          {author.name}
                        </span>
                      )}
                      {i < authorDetails.length - 1 && (
                        <span className="text-fd-border"> · </span>
                      )}
                    </span>
                  ))}
                </span>
              </div>
              <span className="text-fd-border hidden sm:inline">·</span>
              <time
                dateTime={new Date(page.data.date).toISOString()}
                className="inline-flex items-center gap-1.5"
              >
                <Calendar className="size-4" aria-hidden="true" />
                {new Date(page.data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Tags */}
            {page.data.tags && page.data.tags.length > 0 && (
              <div
                className={`flex flex-wrap gap-2 mb-8 article-entrance article-entrance-delay-4 ${fontMono}`}
              >
                {page.data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Separator line */}
            <div className="h-px bg-fd-border/50 mb-8 article-entrance article-entrance-delay-5" />

            {/* Article body */}
            <div className="prose text-[15px] leading-7 [&>p]:text-fd-foreground/90 article-entrance article-entrance-delay-5">
              <Mdx components={mdxComponents} />
            </div>

            {/* Share buttons */}
            <div className="article-entrance article-entrance-delay-6">
              <ShareButtons title={page.data.title} url={postUrl} />
            </div>

            {/* Suggested reads */}
            {suggestedPosts.length > 0 && (
              <section className="mt-10 border-t border-fd-border/50 pt-8 article-entrance article-entrance-delay-6">
                <h2 className={`text-xl font-medium mb-1 ${fontMono}`}>
                  next reads
                </h2>
                <p className="text-sm text-fd-muted-foreground mb-5">
                  Keep the thread going with related posts.
                </p>
                <div className="space-y-0 [&>a:last-child>article]:border-b-0">
                  {suggestedPosts.map((suggestedPost) => (
                    <Link
                      key={suggestedPost.url}
                      href={suggestedPost.url}
                      className="group block"
                    >
                      <article className="py-4 border-b border-fd-border/50">
                        <h3
                          className={`text-base font-medium mb-1 group-hover:text-fd-primary transition-colors ${fontMono}`}
                        >
                          {suggestedPost.title}
                        </h3>
                        {suggestedPost.description && (
                          <p className="text-sm text-fd-muted-foreground leading-relaxed mb-2">
                            {suggestedPost.description}
                          </p>
                        )}
                        <div
                          className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fd-muted-foreground ${fontMono}`}
                        >
                          <time dateTime={suggestedPost.date.toISOString()}>
                            {suggestedPost.date.toISOString().split('T')[0]}
                          </time>
                          {suggestedPost.sharedTags.length > 0 && (
                            <>
                              <span className="text-fd-border">·</span>
                              {suggestedPost.sharedTags
                                .slice(0, 2)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-yellow-700 dark:text-yellow-500"
                                  >
                                    #{tag.toLowerCase().replace(' ', '-')}
                                  </span>
                                ))}
                            </>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* TOC sidebar - hidden on smaller screens */}
          <aside className="hidden xl:block w-[250px] shrink-0 article-entrance article-entrance-delay-5">
            <div className="sticky top-24">
              <BlogToc items={tocItems} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  if (!page) notFound();

  const url = `${baseUrl}/${params.slug}`;
  const authorNames = page.data.authors.map((id) => getAuthor(id).name);
  const cardImage = page.data.card
    ? `${baseUrl}${page.data.card}`
    : `${baseUrl}/og-image.jpg`;

  return {
    title: page.data.title,
    description: page.data.description,
    authors: authorNames.map((name) => ({ name })),
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: 'article',
      url,
      siteName: 'Chainbound Engineering Blog',
      publishedTime: new Date(page.data.date).toISOString(),
      authors: authorNames,
      tags: page.data.tags,
      images: [cardImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: [cardImage],
    },
    alternates: {
      canonical: url,
    },
  };
}
