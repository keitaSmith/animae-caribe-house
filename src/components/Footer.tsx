'use client';

import { site } from '../data/site';
import { MailIcon, PhoneIcon } from './Icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-image">
          <img src="/assets/creator-seaside.webp" alt="Creative animation studio placeholder" />
        </div>
        <div className="footer-copy">
          <span className="section-kicker">Contact</span>
          <h2>Ready to build, animate or collaborate?</h2>
          <p>Animate in Sunshine With Us</p>
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
