"use client";

import Link from "next/link";
import { useState } from "react";

const fontMono = "font-[family-name:var(--font-at-hauss-mono)]";

type Post = {
  url: string;
  title: string;
  description?: string;
  date: string;
  authors: { name: string; avatar: string | null }[];
  tags?: string[];
};

export function PostList({
  posts,
  topTags,
}: {
  posts: Post[];
  topTags: string[];
}) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredPosts = selectedTag ? posts.filter((p) => p.tags?.includes(selectedTag)) : posts;

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Filter and sort controls */}
      <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 text-sm ${fontMono}`}>
        {/* Filter - hidden on mobile */}
        <div className="hidden md:block">
          <span className="text-fd-muted-foreground">filter: </span>
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`cursor-pointer hover:underline focus-visible:underline focus-visible:outline-none ${
              selectedTag === null ? "text-fd-primary" : "text-fd-muted-foreground"
            }`}
          >
            all
          </button>
          {topTags.map((tag) => (
            <span key={tag}>
              <span className="text-fd-border mx-2">|</span>
              <button
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`cursor-pointer hover:underline focus-visible:underline focus-visible:outline-none ${
                  selectedTag === tag ? "text-fd-primary" : "text-fd-muted-foreground"
                }`}
              >
                {tag.toLowerCase()}
              </button>
            </span>
          ))}
        </div>

        {/* Sort - always visible, pushed right on mobile */}
        <div className="ml-auto">
          <span className="text-fd-muted-foreground">sort: </span>
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="text-fd-primary hover:underline cursor-pointer"
          >
            {sortOrder === "newest" ? "newest first ↓" : "oldest first ↑"}
          </button>
        </div>
      </div>

      {/* Posts list - home-entrance-list-item for homepage stagger (no-op when not in entrance context) */}
      <div className="space-y-0 [&>a:last-child>article]:border-b-0">
        {sortedPosts.map((post) => (
          <Link key={post.url} href={post.url} className="group block home-entrance-list-item">
            <article className="flex gap-4 py-4 border-b border-fd-border/50">
              {/* Date - visible on desktop only, left column */}
              <time
                dateTime={post.date}
                className={`hidden mt-1.5 md:block text-fd-muted-foreground text-xs w-24 shrink-0 mt-1 ${fontMono}`}
              >
                {new Date(post.date).toISOString().split("T")[0]}
              </time>
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium mb-1 group-hover:text-fd-primary transition-colors ${fontMono}`}
                >
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-fd-muted-foreground text-sm leading-relaxed mb-2 max-w-3xl">
                    {post.description}
                  </p>
                )}
                <div
                  className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fd-muted-foreground ${fontMono}`}
                >
                  {/* Date - visible on mobile only, inline */}
                  <time dateTime={post.date} className="md:hidden">
                    {new Date(post.date).toISOString().split("T")[0]}
                  </time>
                  <span className="md:hidden text-fd-border">·</span>
                  <span>by {post.authors.map((a) => a.name.toLowerCase()).join(", ")}</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="text-fd-border">·</span>
                      {post.tags.slice(0, 2).map((tag, j) => (
                        <span key={tag} className="text-yellow-500">
                          #{tag.toLowerCase().replace(" ", "-")}
                          {j < Math.min(post.tags?.length || 0, 2) - 1 && " "}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer
        className={`mt-12 pt-8 border-t border-fd-border text-xs text-fd-muted-foreground ${fontMono}`}
      >
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} chainbound</span>
          <span className="hidden sm:inline">pioneering blockchain infra</span>
        </div>
      </footer>
    </div>
  );
}
