'use client';

import ButtonLink from './ButtonLink';
import { MailIcon, PlayIcon } from './Icons';
import MuxHeroShowreel from './MuxHeroShowreel';
import { useShowreel } from './ShowreelProvider';

type HeroProps = {
  ariaLabel?: string;
  logoSrc?: string | null;
  logoAlt?: string;
  title?: string;
  copy?: string;
  contactHref?: string;
  contactLabel?: string;
  showreelLabel?: string;
};

export default function Hero({
  ariaLabel = 'Animae Caribe House introduction',
  logoSrc = '/assets/animae-house-logo-white.png',
  logoAlt = 'Animae Caribe House',
  title,
  copy = 'A cinematic digital home for animated stories, creative production, community building and Caribbean imagination.',
  contactHref = 'mailto:info@animaecaribehouse.com',
  contactLabel = 'Get in touch',
  showreelLabel = 'Watch showreel',
}: HeroProps) {
  const { openShowreel, playbackId, posterSrc } = useShowreel();
  const hasMuxShowreel = Boolean(playbackId);

  return (
    <section className="hero-section" id="home" aria-label={ariaLabel}>
      <MuxHeroShowreel />
      {!hasMuxShowreel ? <div className="hero-poster" style={{ backgroundImage: `url(${posterSrc})` }} /> : null}
      <div className="hero-scrim" />

      <div className="container hero-content">
        <div className="hero-card reveal-up">
          {logoSrc ? <img className="hero-logo" src={logoSrc} alt={logoAlt} /> : null}
          {title ? <h1 className="hero-title">{title}</h1> : null}
          <p className="hero-copy">{copy}</p>
          <div className="hero-actions">
            <ButtonLink href={contactHref} variant="soft">
              <MailIcon /> {contactLabel}
            </ButtonLink>
            <button className="button button-primary" type="button" onClick={openShowreel}>
              <PlayIcon /> {showreelLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
