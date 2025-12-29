import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

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
    githubUrl: 'https://github.com/chainbound',
  };
}
