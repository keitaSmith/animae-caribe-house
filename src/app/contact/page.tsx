import Image from 'next/image';
import ButtonLink from '../../components/ButtonLink';
import { ExternalIcon, MailIcon, MapPinIcon, PhoneIcon } from '../../components/Icons';
import { getContactPage, getSiteSettings } from '../../sanity/lib/queries';
import contactHeroCharacter from '../../../public/assets/characters/CarnivalCharacater.webp';

export const metadata = {
  title: 'Contact | Animae Caribe House',
};

const fallbackContact = {
  email: 'info@animaecaribe.com',
  phone: '+1 (868) 704-1484',
  address: '#2 Abercromby Street\nSt. Joseph',
  mapSearchText: '#2 Abercromby Street, St. Joseph, Trinidad and Tobago',
};

const fallbackContactHero = {
  eyebrow: 'Contact',
  title: "Let's start the conversation",
  description:
    "Have a question, idea, partnership opportunity, or project in mind? Get in touch with the Animae Caribe team. We'd love to hear from you.",
  imageAlt: 'Illustrated carnival character for Animae Caribe contact page',
};

const fallbackContentSection = {
  eyebrow: 'Reach out',
  title: "Let's make something move.",
  description:
    "Whether you're reaching out about animation, partnerships, festival activity, or the wider creative community, we'd love to hear from you. Let's animate in sunshine together.",
};

function resolveContactValue(value: string | undefined, fallback: string, placeholders: string[] = []) {
  if (!value) {
    return fallback;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (placeholders.some((placeholder) => normalizedValue === placeholder.trim().toLowerCase())) {
    return fallback;
  }

  if (normalizedValue.includes('xxx-xxxx') || normalizedValue.includes('animaecaribehouse.com')) {
    return fallback;
  }

  return value;
}

function buildMapSearchText(explicitSearchText: string | undefined, address: string) {
  const explicitValue = explicitSearchText?.trim();

  if (explicitValue) {
    return explicitValue;
  }

  const singleLineAddress = address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(', ');

  if (singleLineAddress.toLowerCase().includes('trinidad and tobago')) {
    return singleLineAddress;
  }

  return `${singleLineAddress}, Trinidad and Tobago`;
}

function buildMapUrls(searchText: string) {
  const encoded = encodeURIComponent(searchText);

  return {
    embedUrl: `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
  };
}

export default async function Contact() {
  const [siteSettings, contactPage] = await Promise.all([getSiteSettings(), getContactPage()]);
  const hero = contactPage?.hero;
  const contentSection = contactPage?.contentSection;
  const email = resolveContactValue(siteSettings?.contactEmail, fallbackContact.email);
  const phone = resolveContactValue(siteSettings?.contactPhone, fallbackContact.phone);
  const address = resolveContactValue(siteSettings?.location, fallbackContact.address, ['Trinidad and Tobago']);
  const mapSearchText = buildMapSearchText(siteSettings?.contactMapSearchText, address || fallbackContact.address);
  const heroImageSrc = hero?.image?.url || contactHeroCharacter;
  const heroImageAlt = hero?.image?.alt || fallbackContactHero.imageAlt;
  const formattedAddress = address.split('\n').filter(Boolean);
  const { embedUrl, directionsUrl } = buildMapUrls(mapSearchText);
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const emailHref = `mailto:${email}`;

  return (
    <section className="page-section page-section-cinematic">
      <div className="page-cinematic-hero page-cinematic-hero-contact">
        <div className="container festival-programme-page-hero-shell">
          <div className="festival-programme-page-copy">
            <span className="section-kicker">{hero?.eyebrow || fallbackContactHero.eyebrow}</span>
            <h1>{hero?.title || fallbackContactHero.title}</h1>
            <p>{hero?.description || fallbackContactHero.description}</p>
          </div>
          <div className="festival-programme-page-side">
            <div className="page-cinematic-character page-cinematic-character-contact">
              <Image
                src={heroImageSrc}
                alt={heroImageAlt}
                className="page-cinematic-character-image"
                priority
                sizes="(max-width: 680px) 72vw, (max-width: 980px) 52vw, 360px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container page-feature">
        <div className="contact-panel">
          <div className="contact-section-grid">
            <div className="contact-section-copy">
              <span className="section-kicker">{contentSection?.eyebrow || fallbackContentSection.eyebrow}</span>
              <h2>{contentSection?.title || fallbackContentSection.title}</h2>
              <p>{contentSection?.description || fallbackContentSection.description}</p>

              <div className="contact-detail-list" aria-label="Contact details">
                <div className="contact-detail-row">
                  <span className="contact-detail-label">Visit us</span>
                  <div className="contact-detail-content">
                    <strong>
                      <MapPinIcon /> Animae Caribe House
                    </strong>
                    <address>
                      {formattedAddress.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </address>
                  </div>
                </div>

                <div className="contact-detail-row">
                  <span className="contact-detail-label">Call us</span>
                  <div className="contact-detail-content">
                    <strong>
                      <PhoneIcon /> Speak with our team
                    </strong>
                    <a href={phoneHref}>{phone}</a>
                  </div>
                </div>

                <div className="contact-detail-row">
                  <span className="contact-detail-label">Email us</span>
                  <div className="contact-detail-content">
                    <strong>
                      <MailIcon /> Send a message
                    </strong>
                    <a href={emailHref} target="_blank" rel="noreferrer">
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-map-shell">
              <div className="contact-map-header">
                <span className="contact-detail-label">Find us</span>
              </div>
              <div className="festival-venue-map-frame contact-map-frame">
                <iframe
                  src={embedUrl}
                  title="Map for Animae Caribe House"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="contact-map-actions">
                <ButtonLink href={emailHref} variant="primary">
                  Send us a message <MailIcon />
                </ButtonLink>
                <ButtonLink href={directionsUrl} variant="outline" external>
                  Directions <ExternalIcon />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
