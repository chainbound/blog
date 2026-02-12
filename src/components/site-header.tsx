import Image from "next/image";
import { Rss } from "lucide-react";
import Link from "next/link";
import { HeaderSearchBar } from "./header-search-bar";
import { ThemeToggle } from "./theme-toggle";

const fontMono = "font-[family-name:var(--font-at-hauss-mono)]";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-fd-border bg-fd-background/95 backdrop-blur supports-[backdrop-filter]:bg-fd-background/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Image
              src="/black-logo.svg"
              alt="Chainbound"
              width={24}
              height={24}
              className="dark:hidden"
            />
            <Image
              src="/white-logo.svg"
              alt="Chainbound"
              width={24}
              height={24}
              className="hidden dark:block"
            />
            <span className={`text-sm text-fd-muted-foreground ${fontMono}`}>/blog</span>
          </Link>
          <nav
            className={`flex items-center gap-4 sm:gap-6 text-sm text-fd-muted-foreground ${fontMono} shrink-0`}
          >
            <Link href="/advisory" className="hover:text-fd-foreground transition-colors">
              advisory
            </Link>
            <a
              href="https://github.com/chainbound"
              className="hidden sm:inline hover:text-fd-foreground transition-colors"
            >
              github
            </a>
            <HeaderSearchBar />
            <a
              href="/rss.xml"
              className="hover:text-fd-foreground transition-colors inline-flex items-center"
              aria-label="RSS feed"
            >
              <Rss className="size-4" />
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
