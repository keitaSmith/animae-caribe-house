import Image from 'next/image';
import { site } from '../../data/site';
import { MailIcon, PhoneIcon } from '../../components/Icons';
import contactHeroCharacter from '../../../public/assets/characters/CarnivalCharacater.webp';

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
            <div className="page-cinematic-character page-cinematic-character-contact">
              <Image
                src={contactHeroCharacter}
                alt="Illustrated carnival character for Animae Caribe contact page"
                className="page-cinematic-character-image"
                priority
                sizes="(max-width: 680px) 72vw, (max-width: 980px) 52vw, 360px"
              />
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
