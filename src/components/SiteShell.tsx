'use client';

import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import ShowreelModal from './ShowreelModal';
import { ShowreelProvider } from './ShowreelProvider';

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <ShowreelProvider>
      <div className="site-shell">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      <ShowreelModal />
    </ShowreelProvider>
  );
}
