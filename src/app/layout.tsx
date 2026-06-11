import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import '../styles/index.css';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
