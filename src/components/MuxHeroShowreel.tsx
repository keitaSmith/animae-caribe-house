"use client";

import type { ComponentProps, ComponentType } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useShowreel } from "./ShowreelProvider";

type HeroMuxPlayerProps = ComponentProps<typeof MuxPlayer> & {
  tabIndex?: number;
};

const HeroMuxPlayer = MuxPlayer as ComponentType<HeroMuxPlayerProps>;

const HERO_SHOWREEL_CLIP = {
  assetStartTime: 5,
  assetEndTime: 55,
  thumbnailTime: 28,
};

export default function MuxHeroShowreel() {
  const {
    backgroundPlaybackId,
    isBackgroundPaused,
    backgroundVideoTitle,
    backgroundStartTimeSeconds,
    backgroundEndTimeSeconds,
    backgroundPosterTimeSeconds,
  } = useShowreel();

  if (!backgroundPlaybackId) {
    return null;
  }

  const assetStartTime =
    typeof backgroundStartTimeSeconds === 'number' ? backgroundStartTimeSeconds : HERO_SHOWREEL_CLIP.assetStartTime;
  const assetEndTime =
    typeof backgroundEndTimeSeconds === 'number' ? backgroundEndTimeSeconds : HERO_SHOWREEL_CLIP.assetEndTime;
  const thumbnailTime =
    typeof backgroundPosterTimeSeconds === 'number'
      ? backgroundPosterTimeSeconds
      : assetStartTime || HERO_SHOWREEL_CLIP.thumbnailTime;

  return (
    <div className="hero-video hero-video-layer" aria-hidden="true">
      <HeroMuxPlayer
        className="hero-video-player"
        playbackId={backgroundPlaybackId}
        autoPlay="muted"
        assetStartTime={assetStartTime}
        assetEndTime={assetEndTime}
        muted
        loop
        paused={isBackgroundPaused}
        playsInline
        streamType="on-demand"
        thumbnailTime={thumbnailTime}
        nohotkeys
        aria-hidden="true"
        tabIndex={-1}
        metadata={{
          video_title: backgroundVideoTitle,
        }}
        style={{
          width: "100%",
          height: "100%",
          "--controls": "none",
          "--media-object-fit": "cover",
        }}
      />
    </div>
  );
}
