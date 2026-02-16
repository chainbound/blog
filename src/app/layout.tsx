import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { baseUrl } from '@/lib/source';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import 'katex/dist/katex.css';

const atHaussMono = localFont({
  src: '../fonts/AtHaussMono-Regular.otf',
  display: 'swap',
  variable: '--font-at-hauss-mono',
});

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Chainbound Blog',
    template: '%s | Chainbound Blog',
  },
  description: 'Technical blog by Chainbound',
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  icons: {
    icon: [
      // Light mode - dark icon
      {
        url: '/black-logo.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      // Dark mode - light icon
      {
        url: '/white-logo.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'Chainbound Engineering Blog',
    title: 'Chainbound Blog',
    description: 'Technical blog by Chainbound',
    url: baseUrl,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Chainbound Engineering Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chainbound Blog',
    description: 'Technical blog by Chainbound',
    images: ['/og-image.jpg'],
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${atHaussMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          defer
          src="https://umami.chainbound.io/script.js"
          data-website-id="5deffa44-be5a-4605-9de5-1b09d1cea940"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          theme={{ defaultTheme: 'system' }}
          search={{ options: { api: '/api/search' } }}
        >
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
