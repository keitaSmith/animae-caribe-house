'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';
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
  const [mobileSubmenuState, setMobileSubmenuState] = useState<{key: string | null; path: string}>({key: null, path: '/'});
  const [desktopSubmenuKey, setDesktopSubmenuKey] = useState<string | null>(null);
  const [isDesktopNav, setIsDesktopNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const { openShowreel, canOpenShowreel, showreelButtonLabel } = useShowreel();
  const pathname = usePathname() || '/';
  const menuOpen = menuState.isOpen && menuState.path === pathname;
  const mobileOpenSubmenu = mobileSubmenuState.path === pathname ? mobileSubmenuState.key : null;
  const navItems = buildNavItems(currentFestivalYear);
  const hasLandingHero = pathname === '/' || pathname === '/house' || pathname === '/festival';
  const hasShowreelHero = pathname === '/house' || pathname === '/festival';
  const useDarkHeader = !hasLandingHero || isScrolled || menuOpen;

  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 24);

      if (!hasLandingHero) {
        setHeroInView(false);
        return;
      }

      const hero = document.getElementById('home');

      if (!hero) {
        setHeroInView(true);
        return;
      }

      const rect = hero.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const heroVisible = visibleHeight > rect.height * 0.08;
      setHeroInView(heroVisible);
    };

    syncScrollState();
    window.addEventListener('scroll', syncScrollState, { passive: true });
    window.addEventListener('resize', syncScrollState);

    return () => {
      window.removeEventListener('scroll', syncScrollState);
      window.removeEventListener('resize', syncScrollState);
    };
  }, [hasLandingHero]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 981px)');

    const syncDesktopNav = (event?: MediaQueryListEvent) => {
      const matches = event?.matches ?? mediaQuery.matches;
      setIsDesktopNav(matches);

      if (matches) {
        setMobileSubmenuState({key: null, path: pathname});
      } else {
        setDesktopSubmenuKey(null);
      }
    };

    syncDesktopNav();
    mediaQuery.addEventListener('change', syncDesktopNav);

    return () => mediaQuery.removeEventListener('change', syncDesktopNav);
  }, [pathname]);

  const isLinkActive = (href: string) => pathname === href;
  const isFestivalBranch = pathname === '/festival' || pathname.startsWith('/festival/');
  const closeMenus = () => {
    setMenuState({isOpen: false, path: pathname});
    setMobileSubmenuState({key: null, path: pathname});
    setDesktopSubmenuKey(null);
  };
  const blurActiveElement = () => {
    if (typeof document === 'undefined') return;
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  };
  const handleNavLinkClick = () => {
    closeMenus();

    if (isDesktopNav) {
      blurActiveElement();
    }
  };

  const openDesktopSubmenu = (key: string) => {
    if (!isDesktopNav) return;
    setDesktopSubmenuKey(key);
  };

  const closeDesktopSubmenu = (key?: string) => {
    if (!isDesktopNav) return;
    setDesktopSubmenuKey((current) => (key && current !== key ? current : null));
  };

  const handleSubmenuEscape = (event: KeyboardEvent<HTMLDivElement>, key: string) => {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    closeDesktopSubmenu(key);
  };

  const headerClassName = [
    'site-header',
    useDarkHeader ? 'is-scrolled' : 'is-top',
    menuOpen ? 'menu-open' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const showHeaderShowreel = canOpenShowreel && (hasShowreelHero ? !heroInView : false);
  const showreelClassName = ['nav-showreel', showHeaderShowreel ? 'is-visible' : 'is-hidden'].join(' ');
  const brandLogoSrc =
    useDarkHeader
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
          const isOpen = isDesktopNav ? desktopSubmenuKey === item.label : mobileOpenSubmenu === item.label;
          const isActive = item.href === '/festival' ? isFestivalBranch : isLinkActive(item.href);

          return (
            <div
              key={item.href}
              className={['nav-item-with-submenu', isOpen ? 'is-open' : '', isActive ? 'is-active' : '']
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => openDesktopSubmenu(item.label)}
              onMouseLeave={() => closeDesktopSubmenu(item.label)}
              onKeyDown={(event) => handleSubmenuEscape(event, item.label)}
            >
              <div className="nav-link-row">
                <Link
                  href={item.href}
                  className={isActive ? 'nav-submenu-link active' : 'nav-submenu-link'}
                  onClick={handleNavLinkClick}
                >
                  {item.label}
                </Link>
                <button
                  className={isOpen ? 'nav-submenu-toggle active' : 'nav-submenu-toggle'}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={submenuId}
                  aria-label={isOpen ? `Collapse ${item.label} menu` : `Expand ${item.label} menu`}
                  onClick={(event) => {
                    if (isDesktopNav) {
                      closeDesktopSubmenu(item.label);
                      event.currentTarget.blur();
                      return;
                    }

                    setMobileSubmenuState((current) =>
                      current.path === pathname && current.key === item.label
                        ? {key: null, path: pathname}
                        : {key: item.label, path: pathname}
                    );
                  }}
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
                    onClick={handleNavLinkClick}
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
