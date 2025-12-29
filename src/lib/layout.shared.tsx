import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Chainbound Blog',
      url: 'https://chainbound.io',
    },
    githubUrl: 'https://github.com/chainbound'
  };
}
