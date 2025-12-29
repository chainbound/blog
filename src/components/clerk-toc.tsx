'use client';

import { useActiveAnchor, type TOCItemType } from 'fumadocs-core/toc';

interface ClerkTOCProps {
  items: TOCItemType[];
}

export function ClerkTOC({ items }: ClerkTOCProps) {
  const activeId = useActiveAnchor();

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {items.map((item) => {
        const isActive = activeId === item.url.slice(1);
        const depthClass =
          item.depth === 2 ? 'pl-3' : item.depth === 3 ? 'pl-6' : 'pl-9';

        return (
          <a
            key={item.url}
            href={item.url}
            className={`py-1 transition-colors border-l-2 hover:text-fd-foreground ${depthClass} ${
              isActive
                ? 'border-fd-primary text-fd-foreground font-medium'
                : 'border-transparent text-fd-muted-foreground'
            }`}
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );
}

