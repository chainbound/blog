import { posts } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const blog = loader({
  baseUrl: '/',
  source: toFumadocsSource(posts, []),
  icon(icon) {
    if (icon && icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
  },
});

export function getPageImage(page: InferPageType<typeof blog>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof blog>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
