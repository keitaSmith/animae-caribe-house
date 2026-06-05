import {DEFAULT_FESTIVAL_YEAR, getFestivalEventsRoute, getPastEditionsRoute} from '../lib/festivalRoutes';
import {aboutSectionNavItems} from '../lib/aboutSectionPages';

export type Site = {
  name: string;
  tagline: string;
  showreelUrl: string;
  twixalotUrl: string;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
};

export type NavItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export const site: Site = {
  name: 'Animae Caribe',
  tagline: 'Caribbean Animation, Festival and Creative Community',
  showreelUrl: 'https://www.youtube.com/',
  twixalotUrl: 'https://twixalot.com',
  contact: {
    email: 'info@animaecaribe.com',
    phone: '+1 (868) 704-1484',
    location: '#2 Abercromby Street, St. Joseph',
  },
};

export function buildNavItems(currentFestivalYear = DEFAULT_FESTIVAL_YEAR): NavItem[] {
  return [
    {
      label: `Festival ${currentFestivalYear}`,
      href: '/festival',
      children: [
        {label: `${currentFestivalYear} Programme`, href: getFestivalEventsRoute(currentFestivalYear)},
        {label: 'Past Editions', href: getPastEditionsRoute()},
      ],
    },
    {label: 'House', href: '/house'},
    {label: 'News & Media', href: '/news-media'},
    {label: 'About', href: '/about', children: aboutSectionNavItems},
    {label: 'Partners', href: '/partners'},
    {label: 'Contact', href: '/contact'},
  ];
}

export const navItems: NavItem[] = buildNavItems();
