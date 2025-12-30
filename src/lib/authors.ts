export const authors = {
  mempirate: {
    name: 'mempirate',
    url: 'https://x.com/mempirate',
    avatar: 'https://unavatar.io/twitter/mempirate',
  },
  lorenzo: {
    name: 'lorenzo',
    url: 'https://x.com/thedevbirb',
    avatar: 'https://unavatar.io/twitter/thedevbirb',
  },
  pierre: {
    name: 'Pierre-Louis',
    url: 'https://yousername.gitlab.io/',
    avatar: 'https://unavatar.io/github/plroman',
  },
  // Add more authors here
} as const;

export type AuthorId = keyof typeof authors;

export type Author = {
  name: string;
  url: string | null;
  avatar: string | null;
};

export function getAuthor(id: string): Author {
  const author = authors[id as AuthorId];
  if (author) {
    return author;
  }
  // Fallback for unknown authors
  return { name: id, url: null, avatar: null };
}
