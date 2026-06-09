'use client';

import { usePathname } from 'next/navigation';
import { site } from '../data/site';
import { MailIcon, PhoneIcon } from './Icons';

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname() || '/';
  const isHousePage = pathname === '/house' || pathname.startsWith('/house/');
  const footerLogoSrc = isHousePage ? '/assets/animae-house-logo-white.png' : '/assets/anime-caribe-logo-white.png';
  const footerLogoAlt = isHousePage ? 'Animae Caribe House' : 'Animae Caribe';

  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-image footer-logo">
          <img src={footerLogoSrc} alt={footerLogoAlt} />
        </div>
        <div className="footer-copy">
          <span className="section-kicker">Contact</span>
          <h2>Animate in Sunshine With Us</h2>
          <p>
            Reach out to Animae Caribe House for project conversations, creative partnerships, article updates and community opportunities.
          </p>
          <div className="contact-list">
            <a href={`mailto:${site.contact.email}`} target="_blank" rel="noreferrer">
              <MailIcon /> {site.contact.email}
            </a>
            <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}>
              <PhoneIcon /> {site.contact.phone}
            </a>
          </div>
        </div>
      </div>
      <div className="footer-strip">
        <span>Copyright © {year} Animae Caribe House</span>
        <span className="divider" />
        <a href={site.twixalotUrl} target="_blank" rel="noreferrer">
          Powered by Twixalot Software Solutions
        </a>
      </div>
    </footer>
  );
}
