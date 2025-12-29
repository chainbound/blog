import Link from 'next/link';

const fontMono = 'font-[family-name:var(--font-at-hauss-mono)]';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className={`text-6xl font-medium mb-4 ${fontMono}`}>404</h1>
      <p className="text-fd-muted-foreground mb-8">
        This page could not be found.
      </p>
      <Link
        href="/"
        className={`inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-primary transition-colors ${fontMono}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to home
      </Link>
    </main>
  );
}
