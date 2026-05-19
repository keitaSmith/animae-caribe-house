'use client';

import Footer from './Footer';
import Header from './Header';
import ShowreelModal from './ShowreelModal';
import { ShowreelProvider } from './ShowreelProvider';

export default function SiteShell({ children }) {
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
