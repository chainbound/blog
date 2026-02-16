'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';

export function HeaderSearchBar() {
  const { setOpenSearch, enabled } = useSearchContext();

  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="hover:text-fd-foreground transition-colors inline-flex items-center"
      aria-label="Search"
    >
      <Search className="size-4" />
    </button>
  );
}
