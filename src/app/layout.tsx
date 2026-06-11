import type { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../styles/index.css';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
