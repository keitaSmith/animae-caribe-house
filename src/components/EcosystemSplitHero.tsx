'use client';

import type { ComponentProps, ComponentType } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';
import type { SanityUmbrellaHomePage } from '../sanity/lib/types';

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

type EcosystemSplitHeroProps = {
  content?: SanityUmbrellaHomePage['splitHero'] | null;
};

export default function EcosystemSplitHero({content}: EcosystemSplitHeroProps) {
  if (content?.isVisible === false) {
    return null;
  }

  const panelContent = [content?.leftPanel, content?.rightPanel];

  return (
    <section className="ecosystem-split-hero" id="home" aria-label="Animae Caribe ecosystem gateway">
      <div className="ecosystem-split-frame">
        {experiences.map((experience, index) => {
          const panel = panelContent[index];
          const href = panel?.cta?.href || experience.href;
          const ctaLabel = panel?.cta?.label || experience.cta;
          const playbackId = panel?.video?.muxPlaybackId || experience.playbackId;
          const poster =
            panel?.video?.posterMode === 'customImage'
              ? panel.video.customPosterImage?.url || panel.backgroundImageUrl || experience.poster
              : panel?.video?.fallbackImage?.url || panel?.backgroundImageUrl || experience.poster;
          const thumbnailTime =
            typeof panel?.video?.posterTimeSeconds === 'number' ? panel.video.posterTimeSeconds : 28;
          const assetStartTime = panel?.video?.startTimeSeconds;
          const assetEndTime = panel?.video?.endTimeSeconds;
          const showEyebrow = panel?.showEyebrow !== false;
          const showTitle = panel?.showTitle !== false;
          const showDescription = panel?.showDescription !== false;
          const showCta = panel?.showCta !== false && Boolean(ctaLabel && href);
          const showMedia = panel?.showMedia !== false;

          return (
            <article className={`ecosystem-panel ecosystem-panel-${experience.key}`} key={experience.key}>
              {showMedia ? (
                playbackId ? (
                  <SplitHeroMuxPlayer
                    className="ecosystem-panel-video"
                    playbackId={playbackId}
                    autoPlay="muted"
                    muted
                    loop
                    playsInline
                    streamType="on-demand"
                    assetStartTime={assetStartTime}
                    assetEndTime={assetEndTime}
                    thumbnailTime={thumbnailTime}
                    nohotkeys
                    tabIndex={-1}
                    aria-hidden="true"
                    metadata={{
                      video_title: panel?.video?.title || experience.videoTitle,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      '--controls': 'none',
                      '--media-object-fit': 'cover',
                    }}
                  />
                ) : (
                  <div className="ecosystem-panel-poster" style={{backgroundImage: `url(${poster})`}} />
                )
              ) : null}
              <div className="ecosystem-panel-scrim" />
              <div className="ecosystem-panel-content reveal-up">
                {showEyebrow ? <span className="section-kicker">{panel?.eyebrow || experience.kicker}</span> : null}
                {showTitle ? <h1>{panel?.title || experience.title}</h1> : null}
                {showDescription ? <p>{panel?.description || experience.copy}</p> : null}
                {showCta ? (
                  <ButtonLink href={href} variant="soft">
                    {ctaLabel} <ArrowRightIcon />
                  </ButtonLink>
                ) : null}
              </div>
            </article>
          );
        })}
        <svg className="ecosystem-diagonal-slit" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line className="ecosystem-diagonal-slit-core" x1="56" y1="0" x2="32" y2="100" />
          <line className="ecosystem-diagonal-slit-glow" x1="56" y1="0" x2="32" y2="100" />
        </svg>
      </div>
    </section>
  );
}
