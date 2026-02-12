'use client';

import { useEffect, useState } from 'react';
import { Text } from 'lucide-react';

const fontMono = 'font-[family-name:var(--font-at-hauss-mono)]';

import type { ReactNode } from 'react';

interface TocItem {
  title: ReactNode;
  url: string;
  depth: number;
}

interface BlogTocProps {
  items: TocItem[];
}

export function BlogToc({ items }: BlogTocProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    const headings = document.querySelectorAll('h2[id], h3[id]');
    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className={`text-sm ${fontMono}`}>
      <h3 className="inline-flex items-center gap-1.5 text-fd-muted-foreground mb-4">
        <Text className="size-4" />
        On this page
      </h3>
      {/* Clerk-style TOC with indicator bars */}
      <div className="relative">
        {/* Background bars */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col">
          {items.map((item) => {
            const id = item.url.replace('#', '');
            const isActive = activeId === id;
            return (
              <div
                key={`bar-${item.url}`}
                className={`w-0.5 flex-1 transition-colors duration-200 ${
                  isActive ? 'bg-fd-primary' : 'bg-fd-border'
                }`}
              />
            );
          })}
        </div>

        {/* Links */}
        <ul className="space-y-0">
          {items.map((item) => {
            const id = item.url.replace('#', '');
            const isActive = activeId === id;
            return (
              <li key={item.url}>
                <a
                  href={item.url}
                  data-active={isActive}
                  className={`block py-1.5 ps-3 transition-colors ${
                    isActive
                      ? 'text-fd-primary'
                      : 'text-fd-muted-foreground hover:text-fd-foreground'
                  }`}
                  style={{ paddingLeft: `${12 + (item.depth - 2) * 12}px` }}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
