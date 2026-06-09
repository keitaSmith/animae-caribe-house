'use client';

import ButtonLink from './ButtonLink';
import { MailIcon, PlayIcon } from './Icons';
import MuxHeroShowreel from './MuxHeroShowreel';
import { useShowreel } from './ShowreelProvider';
import { useEffect, useLayoutEffect } from 'react';

type HeroProps = {
  ariaLabel?: string;
  eyebrow?: string;
  logoSrc?: string | null;
  logoAlt?: string;
  title?: string;
  copy?: string;
  showEyebrow?: boolean;
  showLogo?: boolean;
  showTitle?: boolean;
  showCopy?: boolean;
  showActions?: boolean;
  showBackgroundMedia?: boolean;
  contactHref?: string;
  contactLabel?: string;
  showreelLabel?: string;
  backgroundPlaybackId?: string;
  backgroundPosterSrc?: string;
  backgroundPosterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
  backgroundVideoTitle?: string;
  backgroundStartTimeSeconds?: number;
  backgroundEndTimeSeconds?: number;
  backgroundPosterTimeSeconds?: number;
  showreelPlaybackId?: string;
  showreelPosterSrc?: string;
  showreelPosterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
  showreelTitle?: string;
  showreelStartTimeSeconds?: number;
  showreelEndTimeSeconds?: number;
  showreelPosterTimeSeconds?: number;
  showreelAriaLabel?: string;
};

export default function Hero({
  ariaLabel = 'Animae Caribe House introduction',
  eyebrow,
  logoSrc = '/assets/animae-house-logo-white.png',
  logoAlt = 'Animae Caribe House',
  title,
  copy = 'A cinematic digital home for animated stories, creative production, community building and Caribbean imagination.',
  showEyebrow = true,
  showLogo = true,
  showTitle = true,
  showCopy = true,
  showActions = true,
  showBackgroundMedia = true,
  contactHref = 'mailto:info@animaecaribehouse.com',
  contactLabel = 'Get in touch',
  showreelLabel = 'Watch showreel',
  backgroundPlaybackId,
  backgroundPosterSrc,
  backgroundPosterMode,
  backgroundVideoTitle,
  backgroundStartTimeSeconds,
  backgroundEndTimeSeconds,
  backgroundPosterTimeSeconds,
  showreelPlaybackId,
  showreelPosterSrc,
  showreelPosterMode,
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

  useLayoutEffect(() => {
    if (showBackgroundMedia === false) {
      setPageBackgroundVideo(null);
      return () => setPageBackgroundVideo(undefined);
    }

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
      posterMode: backgroundPosterMode,
      videoTitle: backgroundVideoTitle,
      startTimeSeconds: backgroundStartTimeSeconds,
      endTimeSeconds: backgroundEndTimeSeconds,
      posterTimeSeconds: backgroundPosterTimeSeconds,
    });

    return () => setPageBackgroundVideo(undefined);
  }, [
    backgroundEndTimeSeconds,
    backgroundPlaybackId,
    backgroundPosterSrc,
    backgroundPosterMode,
    backgroundPosterTimeSeconds,
    backgroundStartTimeSeconds,
    backgroundVideoTitle,
    setPageBackgroundVideo,
    showBackgroundMedia,
  ]);

  useLayoutEffect(() => {
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
      posterMode: showreelPosterMode,
      videoTitle: showreelTitle,
      startTimeSeconds: showreelStartTimeSeconds,
      endTimeSeconds: showreelEndTimeSeconds,
      posterTimeSeconds: showreelPosterTimeSeconds,
      ariaLabel: showreelAriaLabel,
      buttonLabel: showreelLabel,
    });

    return () => setPageShowreel(undefined);
  }, [
    setPageShowreel,
    showreelAriaLabel,
    showreelEndTimeSeconds,
    showreelLabel,
    showreelPlaybackId,
    showreelPosterSrc,
    showreelPosterMode,
    showreelPosterTimeSeconds,
    showreelStartTimeSeconds,
    showreelTitle,
  ]);

  return (
    <section className="hero-section" id="home" aria-label={ariaLabel}>
      {showBackgroundMedia !== false ? <MuxHeroShowreel /> : null}
      {showBackgroundMedia !== false && !hasMuxBackground ? (
        <div className="hero-poster" style={{ backgroundImage: `url(${activeBackgroundPosterSrc})` }} />
      ) : null}
      <div className="hero-scrim" />

      <div className="container hero-content">
        <div className="hero-card reveal-up">
          {showEyebrow !== false && eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
          {showLogo !== false && logoSrc ? <img className="hero-logo" src={logoSrc} alt={logoAlt} /> : null}
          {showTitle !== false && title ? <h1 className="hero-title">{title}</h1> : null}
          {showCopy !== false ? <p className="hero-copy">{copy}</p> : null}
          {showActions !== false ? (
            <div className="hero-actions">
              <ButtonLink href={contactHref} variant="soft">
                <MailIcon /> {contactLabel}
              </ButtonLink>
              <button className="button button-primary" type="button" onClick={openShowreel}>
                <PlayIcon /> {showreelLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
