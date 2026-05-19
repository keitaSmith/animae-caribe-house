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
  // extraSourceParams: {
  //   asset_start_time: 5,
  //   asset_end_time: 55,
  // },
};

export default function MuxHeroShowreel() {
  const { playbackId, isBackgroundPaused } = useShowreel();

  if (!playbackId) {
    return null;
  }

  return (
    <div className="hero-video hero-video-layer" aria-hidden="true">
      <HeroMuxPlayer
        className="hero-video-player"
        playbackId={playbackId}
        autoPlay="muted"
        // startTime={HERO_SHOWREEL_CLIP.startTime}
        assetStartTime={HERO_SHOWREEL_CLIP.assetStartTime}
        assetEndTime={HERO_SHOWREEL_CLIP.assetEndTime}
        // extraSourceParams={HERO_SHOWREEL_CLIP.extraSourceParams}
        muted
        loop
        paused={isBackgroundPaused}
        playsInline
        streamType="on-demand"
        thumbnailTime={28}
        nohotkeys
        aria-hidden="true"
        tabIndex={-1}
        metadata={{
          video_title: "Animae Caribe House Showreel",
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
