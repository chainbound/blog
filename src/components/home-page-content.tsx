"use client";

import { PostList } from "@/components/post-list";
import Link from "next/link";

const fontMono = "font-[family-name:var(--font-at-hauss-mono)]";

type Post = {
  url: string;
  title: string;
  description?: string;
  date: string;
  authors: { name: string; avatar: string | null }[];
  tags?: string[];
};

export function HomePageContent({
  postsLength,
  earliestYear,
  posts,
  topTags,
}: {
  postsLength: number;
  earliestYear: number;
  posts: Post[];
  topTags: string[];
}) {
  return (
    <div className="home-page min-h-screen bg-fd-background">
      {/* Hero section - CSS keyframe entrance (no JS) */}
      <section className="border-b border-fd-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1
            className={`text-3xl font-medium mb-4 ${fontMono} home-entrance home-entrance-delay-1`}
          >
            Chainbound Engineering Blog
          </h1>
          <p className="text-fd-muted-foreground leading-relaxed mb-6 home-entrance home-entrance-delay-2">
            Research and development notes from the Chainbound team.
          </p>
          <div
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fd-muted-foreground ${fontMono} home-entrance home-entrance-delay-3`}
          >
            <span>{postsLength} posts</span>
            <span className="text-fd-border">·</span>
            <span>since 2023</span>
            <span className="text-fd-border">·</span>
            <Link
              href="/advisory"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 -my-1 rounded-full bg-fd-primary/10 text-fd-primary border border-fd-primary/20 hover:bg-fd-primary/20 transition-colors"
            >
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fd-primary opacity-75" />
                <span className="relative inline-flex rounded-full size-1.5 bg-fd-primary" />
              </span>
              available for advisory
            </Link>
          </div>
        </div>
      </section>

      {/* Posts Section - list staggers in after hero */}
      <div className="home-entrance-list">
        <PostList posts={posts} topTags={topTags} />
      </div>
    </div>
  );
}
