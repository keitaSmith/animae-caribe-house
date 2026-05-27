'use client';

import type { ComponentProps, ComponentType } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

type SplitHeroMuxPlayerProps = ComponentProps<typeof MuxPlayer> & {
  tabIndex?: number;
};

const SplitHeroMuxPlayer = MuxPlayer as ComponentType<SplitHeroMuxPlayerProps>;

const experiences = [
  {
    key: 'house',
    href: '/house',
    kicker: 'Animae Caribe House',
    title: 'Visit Animae Caribe House',
    copy: 'A cinematic home for Caribbean animation, creative production, story development and digital talent.',
    cta: 'Enter the House',
    poster: '/assets/hero-poster.webp',
    playbackId:
      process.env.NEXT_PUBLIC_MUX_HOUSE_SHOWREEL_PLAYBACK_ID || process.env.NEXT_PUBLIC_MUX_SHOWREEL_PLAYBACK_ID,
    videoTitle: 'Animae Caribe House Showreel',
  },
  {
    key: 'festival',
    href: '/festival',
    kicker: 'Festival 2026',
    title: 'Explore Festival 2026',
    copy: 'Screenings, workshops, panels, showcases and community moments for Caribbean animation.',
    cta: 'Explore the Festival',
    poster: '/assets/animae-caribe-festival-feature.webp',
    playbackId: process.env.NEXT_PUBLIC_MUX_FESTIVAL_SHOWREEL_PLAYBACK_ID,
    videoTitle: 'Animae Caribe Festival Showreel',
  },
];

export default function EcosystemSplitHero() {
  return (
    <section className="ecosystem-split-hero" id="home" aria-label="Animae Caribe ecosystem gateway">
      <div className="ecosystem-split-frame">
        {experiences.map((experience) => (
          <article className={`ecosystem-panel ecosystem-panel-${experience.key}`} key={experience.key}>
            {experience.playbackId ? (
              <SplitHeroMuxPlayer
                className="ecosystem-panel-video"
                playbackId={experience.playbackId}
                autoPlay="muted"
                muted
                loop
                playsInline
                streamType="on-demand"
                thumbnailTime={28}
                nohotkeys
                tabIndex={-1}
                aria-hidden="true"
                metadata={{
                  video_title: experience.videoTitle,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  '--controls': 'none',
                  '--media-object-fit': 'cover',
                }}
              />
            ) : (
              <div className="ecosystem-panel-poster" style={{ backgroundImage: `url(${experience.poster})` }} />
            )}
            <div className="ecosystem-panel-scrim" />
            <div className="ecosystem-panel-content reveal-up">
              <span className="section-kicker">{experience.kicker}</span>
              <h1>{experience.title}</h1>
              <p>{experience.copy}</p>
              <ButtonLink href={experience.href} variant="soft">
                {experience.cta} <ArrowRightIcon />
              </ButtonLink>
            </div>
          </article>
        ))}
        <svg className="ecosystem-diagonal-slit" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line className="ecosystem-diagonal-slit-core" x1="56" y1="0" x2="32" y2="100" />
          <line className="ecosystem-diagonal-slit-glow" x1="56" y1="0" x2="32" y2="100" />
        </svg>
      </div>
    </section>
  );
}
