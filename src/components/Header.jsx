'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '../data/site';
import { PlayIcon } from './Icons';
import { useShowreel } from './ShowreelProvider';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const { openShowreel } = useShowreel();
  const pathname = usePathname() || '/';
  const isHomePage = pathname === '/';

  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 24);
    };

    syncScrollState();
    window.addEventListener('scroll', syncScrollState, { passive: true });

    return () => window.removeEventListener('scroll', syncScrollState);
  }, []);

  useEffect(() => {
    if (!isHomePage) return undefined;

    let observer;
    let frameId = 0;

    const attachObserver = () => {
      const hero = document.getElementById('home');
      if (!hero) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          setHeroInView(entry.isIntersecting);
        },
        {
          threshold: 0.08,
        }
      );

      observer.observe(hero);
    };

    frameId = window.requestAnimationFrame(attachObserver);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      if (observer) {
        observer.disconnect();
      }
    };
  }, [isHomePage]);

  const headerClassName = [
    'site-header',
    isScrolled ? 'is-scrolled' : 'is-top',
    menuOpen ? 'menu-open' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const showHeaderShowreel = !isHomePage || !heroInView;
  const showreelClassName = ['nav-showreel', showHeaderShowreel ? 'is-visible' : 'is-hidden'].join(' ');

  return (
    <header className={headerClassName}>
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
        <button
          className={showreelClassName}
          type="button"
          aria-hidden={!showHeaderShowreel}
          tabIndex={showHeaderShowreel ? 0 : -1}
          onClick={() => {
            openShowreel();
            setMenuOpen(false);
          }}
        >
          <PlayIcon /> Watch showreel
        </button>
      </nav>
    </header>
  );
}
