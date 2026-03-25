'use client';

import { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLUListElement>(null);
  const [itemPositions, setItemPositions] = useState<
    { top: number; height: number }[]
  >([]);

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

  // Measure actual item positions after render
  useEffect(() => {
    if (!containerRef.current) return;
    const listItems = containerRef.current.querySelectorAll('li');
    const positions: { top: number; height: number }[] = [];
    const containerTop = containerRef.current.getBoundingClientRect().top;

    listItems.forEach((li) => {
      const rect = li.getBoundingClientRect();
      positions.push({
        top: rect.top - containerTop,
        height: rect.height,
      });
    });

    setItemPositions(positions);
  }, [items]);

  if (items.length === 0) return null;

  const activeIndex = items.findIndex(
    (item) => item.url.replace('#', '') === activeId,
  );

  // Calculate indent in pixels (12px base + 12px per depth level beyond 2)
  const getIndent = (depth: number) => (depth - 2) * 12;

  // Build SVG path segments
  const buildPathSegments = () => {
    if (itemPositions.length !== items.length)
      return { segments: [], activeSegment: null };

    const segments: { d: string; isActive: boolean }[] = [];

    for (let i = 0; i < items.length; i++) {
      const pos = itemPositions[i];
      const indent = getIndent(items[i].depth);
      const x = 2 + indent;
      const yStart = pos.top + 4;
      const yEnd = pos.top + pos.height - 4;
      const isActive = i === activeIndex;

      // Vertical segment for this item
      segments.push({
        d: `M ${x} ${yStart} L ${x} ${yEnd}`,
        isActive,
      });

      // Diagonal connector to next item (if exists)
      if (i < items.length - 1) {
        const nextPos = itemPositions[i + 1];
        const nextIndent = getIndent(items[i + 1].depth);
        const nextX = 2 + nextIndent;
        const nextYStart = nextPos.top + 4;

        segments.push({
          d: `M ${x} ${yEnd} L ${nextX} ${nextYStart}`,
          isActive: false, // Connectors are never active
        });
      }
    }

    return { segments };
  };

  const { segments } = buildPathSegments();

  return (
    <nav aria-label="Table of contents" className={`text-sm ${fontMono}`}>
      <p className="inline-flex items-center gap-1.5 text-fd-muted-foreground mb-4">
        <Text className="size-4" aria-hidden="true" />
        On this page
      </p>
      {/* Clerk-style TOC with angled indicator */}
      <div className="relative">
        {/* SVG for the indicator line */}
        <svg
          aria-hidden="true"
          className="absolute left-0 top-0 w-8 h-full pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          {segments.map((segment, i) => (
            <path
              key={i}
              d={segment.d}
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors duration-200 ${
                segment.isActive ? 'stroke-fd-primary' : 'stroke-fd-border'
              }`}
            />
          ))}
        </svg>

        {/* Links */}
        <ul ref={containerRef} className="space-y-0">
          {items.map((item) => {
            const id = item.url.replace('#', '');
            const isActive = activeId === id;
            const indent = getIndent(item.depth);
            return (
              <li key={item.url}>
                <a
                  href={item.url}
                  data-active={isActive}
                  className={`block py-1.5 transition-colors ${
                    isActive
                      ? 'text-fd-primary'
                      : 'text-fd-muted-foreground hover:text-fd-foreground'
                  }`}
                  style={{ paddingLeft: `${16 + indent}px` }}
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
