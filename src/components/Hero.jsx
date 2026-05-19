'use client';

import ButtonLink from './ButtonLink';
import { ArrowRightIcon, PlayIcon } from './Icons';
import MuxHeroShowreel from './MuxHeroShowreel';
import { useShowreel } from './ShowreelProvider';

export default function Hero() {
  const { openShowreel, playbackId } = useShowreel();
  const hasMuxShowreel = Boolean(playbackId);

  return (
    <section className="hero-section" id="home" aria-label="Animae Caribe House introduction">
      <MuxHeroShowreel />
      {!hasMuxShowreel ? <div className="hero-poster" style={{ backgroundImage: 'url(/assets/hero-poster.webp)' }} /> : null}
      <div className="hero-scrim" />

      <div className="container hero-content">
        <div className="hero-card reveal-up">
          <span className="eyebrow">Caribbean animation / digital culture / creative community</span>
          <img className="hero-logo" src="/assets/animae-house-logo-white.png" alt="Animae Caribe House" />
          <p className="hero-copy">
            A cinematic digital home for animated stories, creative production, community building and Caribbean imagination.
          </p>
          <div className="hero-actions">
            <ButtonLink href="#featured-work" variant="soft">
              <ArrowRightIcon /> Check our work
            </ButtonLink>
            <ButtonLink variant="primary" onClick={openShowreel} type="button">
              <PlayIcon /> Watch showreel
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
