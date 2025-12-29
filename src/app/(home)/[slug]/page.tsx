import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { blog } from '@/lib/source';
import { getAuthor } from '@/lib/authors';
import { BackLink } from '@/components/back-link';

export default async function Page(props: {
    params: Promise<{ slug: string }>;
}) {
    const params = await props.params;
    const page = blog.getPage([params.slug]);

    if (!page) notFound();
    const Mdx = page.data.body;

    // Look up full author details from the config
    const authorDetails = page.data.authors.map(getAuthor);

    return (
        <main className="w-full max-w-3xl mx-auto px-6 py-12">
            <BackLink />

            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                    {page.data.title}
                </h1>
                {page.data.description && (
                    <p className="text-lg text-fd-muted-foreground mb-4">
                        {page.data.description}
                    </p>
                )}
                <div className="flex items-center gap-4 text-sm text-fd-muted-foreground">
                    <div className="flex items-center gap-2">
                        {authorDetails.map((author) => (
                            <span key={author.name} className="inline-flex items-center gap-1.5">
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
                                        className="font-medium text-fd-foreground hover:underline"
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
                    <span>·</span>
                    <time>
                        {new Date(page.data.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </div>
            </header>

            <hr className="border-fd-border mb-8" />

            {/* Article content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <InlineTOC items={page.data.toc} />
                <Mdx components={defaultMdxComponents} />
            </article>
        </main>
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

