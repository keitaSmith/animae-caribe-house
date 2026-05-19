import { site } from '../../data/site';
import { MailIcon, PhoneIcon } from '../../components/Icons';

export const metadata = {
  title: 'Contact | Animae Caribe House',
};

export default function Contact() {
  return (
    <section className="page-section">
      <div className="container page-hero split-grid">
        <div>
          <span className="section-kicker">Contact</span>
          <h1>Let’s start the conversation.</h1>
        </div>
        <div className="glass-panel content-panel">
          <p>
            Keep this page direct and human. No form is needed for launch — just clear contact details and a warm invitation to reach out.
          </p>
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
