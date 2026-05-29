import { site } from '../../data/site';
import { MailIcon, PhoneIcon } from '../../components/Icons';

export const metadata = {
  title: 'Contact | Animae Caribe House',
};

export default function Contact() {
  return (
    <section className="page-section page-section-cinematic">
      <div className="page-cinematic-hero page-cinematic-hero-contact">
        <div className="container festival-programme-page-hero-shell">
          <div className="festival-programme-page-copy">
            <span className="section-kicker">Contact</span>
            <h1>Let&apos;s start the conversation.</h1>
            <p>
              Keep this page direct and human. No form is needed for launch, just clear contact details and a warm
              invitation to reach out.
            </p>
          </div>
          <div className="festival-programme-page-side">
            <div className="page-cinematic-ghost page-cinematic-ghost-contact" aria-hidden="true">
              <div className="page-cinematic-ghost-signal" />
              <div className="page-cinematic-ghost-pulse page-cinematic-ghost-pulse-a" />
              <div className="page-cinematic-ghost-pulse page-cinematic-ghost-pulse-b" />
              <div className="page-cinematic-ghost-pulse page-cinematic-ghost-pulse-c" />
              <div className="page-cinematic-ghost-dot" />
            </div>
          </div>
        </div>
      </div>

      <div className="container page-feature">
        <div className="glass-panel content-panel page-cinematic-panel">
          <div className="contact-list large">
            <a href={`mailto:${site.contact.email}`} target="_blank" rel="noreferrer">
              <MailIcon /> {site.contact.email}
            </a>
            <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`}>
              <PhoneIcon /> {site.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
