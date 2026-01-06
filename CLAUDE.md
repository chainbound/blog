# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun dev          # Start development server at http://localhost:3000
bun run build    # Production build (run before deploying)
bun format       # Format codebase with Prettier
bun lint         # ESLint check
bun run types:check  # Run fumadocs-mdx, typegen, and TypeScript type checking
```

## Architecture

This is a Next.js 16 blog built with [Fumadocs](https://fumadocs.dev), using the App Router.

### Content Structure

- **Blog posts**: MDX files in `content/blog/` with frontmatter:
  ```yaml
  title: 'Post Title'
  authors: [author1, author2]  # Must match keys in src/lib/authors.ts
  date: YYYY-MM-DD
  tags: [tag1, tag2]           # Optional
  ```
- **Authors**: Defined in `src/lib/authors.ts` - add new authors there
- **Images**: Store in `public/<blog-post-slug>/` and reference as `/<blog-post-slug>/image.png`

### Key Files

- `source.config.ts` - Fumadocs MDX configuration, defines frontmatter schema using Zod
- `src/lib/source.ts` - Content source adapter using `fumadocs-core/source` loader
- `src/app/(home)/page.tsx` - Landing page, lists all posts sorted by date
- `src/app/(home)/[slug]/page.tsx` - Individual blog post page

### Route Structure

| Route                     | Purpose                          |
|---------------------------|----------------------------------|
| `app/(home)`              | Landing page and blog layout     |
| `app/(home)/[slug]`       | Individual blog post pages       |
| `app/api/search/route.ts` | Search API endpoint              |
| `app/llms.txt/route.ts`   | LLM-friendly text export         |

### Styling

- Tailwind CSS 4 with `tw-animate-css`
- Custom monospace font: `AtHaussMono` (use `font-[family-name:var(--font-at-hauss-mono)]`)
- Fumadocs UI components with `fd-` prefixed color classes (e.g., `fd-primary`, `fd-muted-foreground`)

## Pre-Deploy Checklist

1. `bun format` - Format code and MDX files
2. `bun run build` - Verify build succeeds (dev server passing doesn't guarantee build success)
3. Spell check new blog posts
