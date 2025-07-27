import { RainbowBorder } from '@/components/layout/global/rainbow-animation';
import { getClashDisplayVariables } from '@/components/typography/clash-display';
import { StatsDataProvider } from '@/contexts/stats-data-context';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { Watermark } from '@/components/layout/global/watermark';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NYTH Central',
  description: 'NYTH Client Web Dashboard',
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${getClashDisplayVariables()} ${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col
          bg-fixed antialiased`}
        style={{
          backgroundImage: 'var(--background-gradient)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}
      >
        <StatsDataProvider>
          <RainbowBorder position="top" />
          <main className="flex flex-1 items-center justify-center">{children}</main>
          <Watermark />
        </StatsDataProvider>
      </body>
    </html>
  );
}
