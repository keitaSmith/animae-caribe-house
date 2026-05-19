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
};

export const site: Site = {
  name: 'Animae Caribe House',
  tagline: 'Where Digital Creatives Find Community',
  showreelUrl: 'https://www.youtube.com/',
  twixalotUrl: 'https://twixalot.com',
  contact: {
    email: 'hello@animaecaribehouse.com',
    phone: '+1 (868) XXX-XXXX',
    location: 'Trinidad and Tobago',
  },
};

export const navItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'News', href: '/news' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];
