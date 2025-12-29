import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

const atHaussMono = localFont({
  src: '../../fonts/AtHaussMono-Regular.otf',
  display: 'swap',
  variable: '--font-at-hauss-mono',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function Layout({ children }: LayoutProps<'/'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
