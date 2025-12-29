import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { blog } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            {...baseOptions()}
            tree={blog.pageTree}
            sidebar={{ enabled: false }}
        >
            {children}
        </DocsLayout>
    );
}

