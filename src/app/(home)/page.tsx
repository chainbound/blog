import Link from 'next/link';
import Image from 'next/image';
import { blog } from '@/lib/source';
import { getAuthor } from '@/lib/authors';

const fontMono = 'font-[family-name:var(--font-at-hauss-mono)]';

export default function HomePage() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date).getTime() -
      new Date(a.data.date).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className={`text-3xl font-medium mb-12 text-center ${fontMono}`}>
        Chainbound Blog
      </h1>

      <div className="flex flex-col gap-8">
        {posts.map((post) => {
          const authorDetails = post.data.authors.map(getAuthor);

          return (
            <Link
              key={post.url}
              href={post.url}
              className="group flex flex-col border-b border-fd-border pb-8 transition-colors"
            >
              <div>
                <h2 className={`text-xl font-medium mb-2 group-hover:text-fd-primary transition-colors ${fontMono}`}>
                  {post.data.title}
                </h2>

                <p className="text-fd-muted-foreground mb-4">
                  {post.data.description}
                </p>

                <div className={`flex flex-wrap items-center gap-3 text-sm text-fd-muted-foreground ${fontMono}`}>
                  <div className="flex items-center gap-2">
                    {authorDetails.map((author) => (
                      <span key={author.name} className="inline-flex items-center gap-1.5">
                        {author.avatar && (
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-fd-foreground">
                          {author.name}
                        </span>
                      </span>
                    ))}
                  </div>

                  <span>·</span>

                  <time>
                    {new Date(post.data.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {post.data.tags && post.data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.data.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full border border-fd-primary/20 bg-fd-primary/10 px-2.5 py-0.5 text-xs font-medium text-fd-primary ${fontMono}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
