import { IdeaIcon } from '@/components/mdx/idea-icon';
import { Mermaid } from '@/components/mdx/mermaid';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    IdeaIcon,
    Mermaid,
    img: (props) => <ImageZoom {...(props as any)} />,
    ...components,
  };
}
