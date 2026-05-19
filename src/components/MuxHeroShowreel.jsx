"use client";

import MuxPlayer from "@mux/mux-player-react";

export default function MuxHeroShowreel() {
  const playbackId = process.env.NEXT_PUBLIC_MUX_SHOWREEL_PLAYBACK_ID;

  if (!playbackId) {
    return null;
  }

  return (
    <div className="hero-video hero-video-layer" aria-hidden="true">
      <MuxPlayer
        className="hero-video-player"
        playbackId={playbackId}
        autoPlay="muted"
        muted
        loop
        playsInline
        streamType="on-demand"
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
