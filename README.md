# Chainbound Blog

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
bun dev
```

Open http://localhost:3000 with your browser to see the result.

Format the code:

```bash
bun format
```

Test a full build:

```bash
bun run build
```

## Content

Blog contents are stored in the [`content/blog`](content/blog) directory. Each
blog post is an MDX file with the following frontmatter:

```yaml
title: 'Some Title'
authors: [author1, author2]
date: YYYY-MM-DD
tags: [tag1, tag2]
```

### Authors

Authors are defined in the [`lib/authors.ts`](src/lib/authors.ts) file.

### Images

To add images to a blog post, create a directory with the same name as the blog
post in the [`public`](public) directory. Then you can reference the image in
the blog post using the following syntax:

```mdx
![](/<blog-post-name>/image.png)

<small>Caption for the image</small>
```

## Deployment

The blog is deployed to Vercel on every push to the `main` branch.

## Fuma Docs

### Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter,
  [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the
  interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to
  keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different
options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.
