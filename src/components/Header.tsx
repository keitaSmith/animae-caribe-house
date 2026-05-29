'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buildNavItems } from '../data/site';
import { PlayIcon } from './Icons';
import { useShowreel } from './ShowreelProvider';

type HeaderProps = {
  currentFestivalYear?: number;
};

export default function Header({currentFestivalYear}: HeaderProps) {
  const [menuState, setMenuState] = useState({isOpen: false, path: '/'});
  const [submenuState, setSubmenuState] = useState<{key: string | null; path: string}>({key: null, path: '/'});
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const { openShowreel, canOpenShowreel, showreelButtonLabel } = useShowreel();
  const pathname = usePathname() || '/';
  const menuOpen = menuState.isOpen && menuState.path === pathname;
  const openSubmenu = submenuState.path === pathname ? submenuState.key : null;
  const navItems = buildNavItems(currentFestivalYear);
  const hasLandingHero = pathname === '/' || pathname === '/house' || pathname === '/festival';
  const hasShowreelHero = pathname === '/house' || pathname === '/festival';

  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 24);
    };

    syncScrollState();
    window.addEventListener('scroll', syncScrollState, { passive: true });

    return () => window.removeEventListener('scroll', syncScrollState);
  }, []);

  useEffect(() => {
    if (!hasLandingHero) return undefined;

    let observer: IntersectionObserver | null = null;
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
  }, [hasLandingHero]);

  const isLinkActive = (href: string) => pathname === href;
  const isFestivalBranch = pathname === '/festival' || pathname.startsWith('/festival/');
  const closeMenus = () => {
    setMenuState({isOpen: false, path: pathname});
    setSubmenuState({key: null, path: pathname});
  };

  const headerClassName = [
    'site-header',
    isScrolled ? 'is-scrolled' : 'is-top',
    menuOpen ? 'menu-open' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const showHeaderShowreel = canOpenShowreel && (hasShowreelHero ? !heroInView : false);
  const showreelClassName = ['nav-showreel', showHeaderShowreel ? 'is-visible' : 'is-hidden'].join(' ');
  const brandLogoSrc =
    isScrolled || menuOpen
      ? '/assets/anime-caribe-logo-black.png'
      : '/assets/anime-caribe-logo-white.png';

  return (
    <header className={headerClassName}>
      <Link className="brand-mark" href="/" aria-label="Animae Caribe home">
        <img src={brandLogoSrc} alt="Animae Caribe" />
      </Link>

      <button
        className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'}
        type="button"
        aria-controls="primary-navigation"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() =>
          setMenuState((current) => (current.isOpen && current.path === pathname ? {isOpen: false, path: pathname} : {isOpen: true, path: pathname}))
        }
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        id="primary-navigation"
        className={menuOpen ? 'nav-links is-open' : 'nav-links'}
        aria-label="Primary navigation"
      >
        {navItems.map((item) => {
          if (!item.children?.length) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isLinkActive(item.href) ? 'active' : ''}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            );
          }

          const submenuId = `${item.label.toLowerCase().replace(/\s+/g, '-')}-submenu`;
          const isOpen = openSubmenu === item.label;
          const isActive = item.href === '/festival' ? isFestivalBranch : isLinkActive(item.href);

          return (
            <div
              key={item.href}
              className={['nav-item-with-submenu', isOpen ? 'is-open' : '', isActive ? 'is-active' : '']
                .filter(Boolean)
                .join(' ')}
            >
              <div className="nav-link-row">
                <Link
                  href={item.href}
                  className={isActive ? 'nav-submenu-link active' : 'nav-submenu-link'}
                  onClick={closeMenus}
                >
                  {item.label}
                </Link>
                <button
                  className={isOpen ? 'nav-submenu-toggle active' : 'nav-submenu-toggle'}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={submenuId}
                  aria-label={isOpen ? `Collapse ${item.label} menu` : `Expand ${item.label} menu`}
                  onClick={() =>
                    setSubmenuState((current) =>
                      current.path === pathname && current.key === item.label
                        ? {key: null, path: pathname}
                        : {key: item.label, path: pathname}
                    )
                  }
                >
                  <span className="nav-submenu-caret" aria-hidden="true" />
                </button>
              </div>
              <div id={submenuId} className={isOpen ? 'nav-submenu is-open' : 'nav-submenu'}>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={pathname === child.href ? 'active' : ''}
                    onClick={closeMenus}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        <button
          className={showreelClassName}
          type="button"
          aria-hidden={!showHeaderShowreel}
          tabIndex={showHeaderShowreel ? 0 : -1}
          onClick={() => {
            openShowreel();
            closeMenus();
          }}
        >
          <PlayIcon /> {showreelButtonLabel}
        </button>
      </nav>
    </header>
  );
}
