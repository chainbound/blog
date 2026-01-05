import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

const atHaussMono = localFont({
  src: '../fonts/AtHaussMono-Regular.otf',
  display: 'swap',
  variable: '--font-at-hauss-mono',
});

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Chainbound Blog',
    template: '%s | Chainbound Blog',
  },
  description: 'Technical blog by Chainbound',
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
        <RootProvider theme={{ defaultTheme: 'light' }}>
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
