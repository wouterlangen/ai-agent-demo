import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campaign Strategist — Agent demo',
  description:
    'Interne demo die laat zien hoe een agent zelf bepaalt welke tools hij inzet om tot een campagnebrief te komen.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
