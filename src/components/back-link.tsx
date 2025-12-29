import Link from 'next/link';

interface BackLinkProps {
    href?: string;
    label?: string;
    className?: string;
}

export function BackLink({
    href = '/',
    label = 'Back',
    className = 'mb-2',
}: BackLinkProps) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-primary transition-colors font-[family-name:var(--font-at-hauss-mono)] ${className}`}
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
            {label}
        </Link>
    );
}

