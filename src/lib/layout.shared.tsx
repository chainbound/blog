import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { Rss } from 'lucide-react';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
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
          <span>Chainbound Blog</span>
        </>
      ),
    },
    links: [
      {
        type: 'icon',
        text: 'RSS Feed',
        label: 'RSS Feed',
        icon: <Rss className="size-5" />,
        url: '/rss.xml',
      },
    ],
    githubUrl: 'https://github.com/chainbound',
  };
}
