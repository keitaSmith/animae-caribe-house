'use client';

import ButtonLink from './ButtonLink';
import { MailIcon, PlayIcon } from './Icons';
import MuxHeroShowreel from './MuxHeroShowreel';
import { useShowreel } from './ShowreelProvider';
import { useEffect } from 'react';

type HeroProps = {
  ariaLabel?: string;
  logoSrc?: string | null;
  logoAlt?: string;
  title?: string;
  copy?: string;
  contactHref?: string;
  contactLabel?: string;
  showreelLabel?: string;
  backgroundPlaybackId?: string;
  backgroundPosterSrc?: string;
  backgroundVideoTitle?: string;
  backgroundStartTimeSeconds?: number;
  backgroundEndTimeSeconds?: number;
  backgroundPosterTimeSeconds?: number;
  showreelPlaybackId?: string;
  showreelPosterSrc?: string;
  showreelTitle?: string;
  showreelStartTimeSeconds?: number;
  showreelEndTimeSeconds?: number;
  showreelPosterTimeSeconds?: number;
  showreelAriaLabel?: string;
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
  backgroundPlaybackId,
  backgroundPosterSrc,
  backgroundVideoTitle,
  backgroundStartTimeSeconds,
  backgroundEndTimeSeconds,
  backgroundPosterTimeSeconds,
  showreelPlaybackId,
  showreelPosterSrc,
  showreelTitle,
  showreelStartTimeSeconds,
  showreelEndTimeSeconds,
  showreelPosterTimeSeconds,
  showreelAriaLabel,
}: HeroProps) {
  const {
    openShowreel,
    backgroundPlaybackId: activeBackgroundPlaybackId,
    backgroundPosterSrc: activeBackgroundPosterSrc,
    setPageShowreel,
    setPageBackgroundVideo,
  } = useShowreel();
  const hasMuxBackground = Boolean(activeBackgroundPlaybackId);

  useEffect(() => {
    if (
      !backgroundPlaybackId &&
      !backgroundPosterSrc &&
      !backgroundVideoTitle &&
      typeof backgroundStartTimeSeconds !== 'number' &&
      typeof backgroundEndTimeSeconds !== 'number' &&
      typeof backgroundPosterTimeSeconds !== 'number'
    ) {
      return undefined;
    }

    setPageBackgroundVideo({
      playbackId: backgroundPlaybackId,
      posterSrc: backgroundPosterSrc,
      videoTitle: backgroundVideoTitle,
      startTimeSeconds: backgroundStartTimeSeconds,
      endTimeSeconds: backgroundEndTimeSeconds,
      posterTimeSeconds: backgroundPosterTimeSeconds,
    });

    return () => setPageBackgroundVideo(null);
  }, [
    backgroundEndTimeSeconds,
    backgroundPlaybackId,
    backgroundPosterSrc,
    backgroundPosterTimeSeconds,
    backgroundStartTimeSeconds,
    backgroundVideoTitle,
    setPageBackgroundVideo,
  ]);

  useEffect(() => {
    if (
      !showreelLabel &&
      !showreelPlaybackId &&
      !showreelPosterSrc &&
      !showreelTitle &&
      typeof showreelStartTimeSeconds !== 'number' &&
      typeof showreelEndTimeSeconds !== 'number' &&
      typeof showreelPosterTimeSeconds !== 'number' &&
      !showreelAriaLabel
    ) {
      return undefined;
    }

    setPageShowreel({
      playbackId: showreelPlaybackId,
      posterSrc: showreelPosterSrc,
      videoTitle: showreelTitle,
      startTimeSeconds: showreelStartTimeSeconds,
      endTimeSeconds: showreelEndTimeSeconds,
      posterTimeSeconds: showreelPosterTimeSeconds,
      ariaLabel: showreelAriaLabel,
      buttonLabel: showreelLabel,
    });

    return () => setPageShowreel(null);
  }, [
    setPageShowreel,
    showreelAriaLabel,
    showreelEndTimeSeconds,
    showreelLabel,
    showreelPlaybackId,
    showreelPosterSrc,
    showreelPosterTimeSeconds,
    showreelStartTimeSeconds,
    showreelTitle,
  ]);

  return (
    <section className="hero-section" id="home" aria-label={ariaLabel}>
      <MuxHeroShowreel />
      {!hasMuxBackground ? (
        <div className="hero-poster" style={{ backgroundImage: `url(${activeBackgroundPosterSrc})` }} />
      ) : null}
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
