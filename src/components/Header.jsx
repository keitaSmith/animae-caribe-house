'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems, site } from '../data/site';
import { PlayIcon } from './Icons';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || '/';

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="Animae Caribe House home">
        <img src="/assets/animae-logo-mark.png" alt="" />
        <span>Animae Caribe House</span>
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <a className="nav-showreel" href={site.showreelUrl} target="_blank" rel="noreferrer">
          <PlayIcon /> Watch showreel
        </a>
      </nav>
    </header>
  );
}
