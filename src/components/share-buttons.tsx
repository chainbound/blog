"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const fontMono = "font-[family-name:var(--font-at-hauss-mono)]";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (_err: unknown) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  return (
    <div
      className={`flex items-center justify-between mt-12 pt-6 border-t border-fd-border text-sm ${fontMono}`}
    >
      <Link href="/" className="text-fd-muted-foreground hover:text-fd-primary transition-colors">
        ← all posts
      </Link>
      <div className="flex items-center gap-4 text-fd-muted-foreground">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-fd-primary transition-colors"
        >
          x/twitter <ArrowUpRight className="size-3" />
        </a>
        <button
          type="button"
          onClick={copyToClipboard}
          className="hover:text-fd-primary transition-colors cursor-pointer"
        >
          copy link
        </button>
      </div>
    </div>
  );
}
