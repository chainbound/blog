import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
} from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Calendar } from 'lucide-react';
import { blog } from '@/lib/source';
import { BackLink } from '@/components/back-link';
import { getAuthor } from '@/lib/authors';
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
  img: (props: ComponentProps<'img'>) => <ImageZoom {...(props as any)} />,
};

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;
  const authorDetails = page.data.authors.map(getAuthor);

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ style: 'clerk', single: true }}
    >
      <BackLink />
      <DocsTitle className={`${fontMono} text-4xl`}>
        {page.data.title}
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div
        className={`flex flex-wrap items-center gap-4 text-sm text-fd-muted-foreground mb-4 ${fontMono}`}
      >
        <div className="flex items-center gap-4">
          {authorDetails.map((author) => (
            <span
              key={author.name}
              className="inline-flex items-center gap-1.5"
            >
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              {author.url ? (
                <Link
                  href={author.url}
                  className="font-medium text-fd-foreground hover:text-fd-primary transition-colors"
                >
                  {author.name}
                </Link>
              ) : (
                <span className="font-medium text-fd-foreground">
                  {author.name}
                </span>
              )}
            </span>
          ))}
        </div>
        {/* <span>·</span> */}
        <time className="inline-flex items-center gap-1.5">
          <Calendar className="size-4" />
          {new Date(page.data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>
      {page.data.tags && page.data.tags.length > 0 && (
        <div className={`flex flex-wrap gap-2 mb-6 ${fontMono}`}>
          {page.data.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs rounded-full bg-fd-primary/10 text-fd-primary border border-fd-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <DocsBody>
        <Mdx components={mdxComponents} />
      </DocsBody>
    </DocsPage>
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
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
