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
  name: 'Animae Caribe',
  tagline: 'Caribbean Animation, Festival and Creative Community',
  showreelUrl: 'https://www.youtube.com/',
  twixalotUrl: 'https://twixalot.com',
  contact: {
    email: 'hello@animaecaribehouse.com',
    phone: '+1 (868) XXX-XXXX',
    location: 'Trinidad and Tobago',
  },
};

export const navItems: NavItem[] = [
  { label: 'Festival 2026', href: '/festival' },
  { label: 'House', href: '/house' },
  { label: 'About', href: '/about' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
];
