import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const posts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  // Add required frontmatter properties for blog posts
  schema: frontmatterSchema.extend({
    authors: z.array(z.string()),
    date: z.iso.date().or(z.date()),
    tags: z.array(z.string()).optional(),
  })
})

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
