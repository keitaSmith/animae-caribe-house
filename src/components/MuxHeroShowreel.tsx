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
  const { playbackId, isBackgroundPaused, videoTitle, startTimeSeconds, endTimeSeconds, posterTimeSeconds } =
    useShowreel();

  if (!playbackId) {
    return null;
  }

  const assetStartTime = typeof startTimeSeconds === 'number' ? startTimeSeconds : HERO_SHOWREEL_CLIP.assetStartTime;
  const assetEndTime = typeof endTimeSeconds === 'number' ? endTimeSeconds : HERO_SHOWREEL_CLIP.assetEndTime;
  const thumbnailTime =
    typeof posterTimeSeconds === 'number' ? posterTimeSeconds : assetStartTime || HERO_SHOWREEL_CLIP.thumbnailTime;

  return (
    <div className="hero-video hero-video-layer" aria-hidden="true">
      <HeroMuxPlayer
        className="hero-video-player"
        playbackId={playbackId}
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
          video_title: videoTitle,
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
