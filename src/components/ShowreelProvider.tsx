'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export type ShowreelVariant = 'house' | 'festival' | 'none';

export type VideoPlaybackConfig = {
  playbackId?: string;
  posterSrc?: string;
  videoTitle?: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  posterTimeSeconds?: number;
  ariaLabel?: string;
  buttonLabel?: string;
};

type ShowreelContextValue = {
  variant: ShowreelVariant;
  backgroundPlaybackId?: string;
  backgroundPosterSrc: string;
  backgroundVideoTitle: string;
  backgroundStartTimeSeconds?: number;
  backgroundEndTimeSeconds?: number;
  backgroundPosterTimeSeconds?: number;
  modalPlaybackId?: string;
  modalPosterSrc: string;
  modalVideoTitle: string;
  modalStartTimeSeconds?: number;
  modalEndTimeSeconds?: number;
  modalPosterTimeSeconds?: number;
  modalAriaLabel?: string;
  showreelButtonLabel: string;
  canOpenShowreel: boolean;
  isShowreelOpen: boolean;
  isBackgroundPaused: boolean;
  setPageShowreel: (config: VideoPlaybackConfig | null) => void;
  setPageBackgroundVideo: (config: VideoPlaybackConfig | null) => void;
  openShowreel: () => void;
  closeShowreel: () => void;
};

const ShowreelContext = createContext<ShowreelContextValue | null>(null);

type ShowreelProviderProps = {
  children: ReactNode;
};

export function ShowreelProvider({ children }: ShowreelProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageShowreel, setPageShowreel] = useState<VideoPlaybackConfig | null>(null);
  const [pageBackgroundVideo, setPageBackgroundVideo] = useState<VideoPlaybackConfig | null>(null);
  const pathname = usePathname() || '/';
  const housePlaybackId =
    process.env.NEXT_PUBLIC_MUX_HOUSE_SHOWREEL_PLAYBACK_ID || process.env.NEXT_PUBLIC_MUX_SHOWREEL_PLAYBACK_ID;
  const festivalPlaybackId = process.env.NEXT_PUBLIC_MUX_FESTIVAL_SHOWREEL_PLAYBACK_ID;
  const variant: ShowreelVariant = pathname === '/house' ? 'house' : pathname === '/festival' ? 'festival' : 'none';
  const routePlaybackId = variant === 'festival' ? festivalPlaybackId : variant === 'house' ? housePlaybackId : undefined;
  const routePosterSrc = variant === 'festival' ? '/assets/animae-caribe-festival-feature.webp' : '/assets/hero-poster.webp';
  const canOpenShowreel = variant === 'house' || variant === 'festival';

  const modalPlaybackId = pageShowreel?.playbackId || routePlaybackId;
  const modalPosterSrc = pageShowreel?.posterSrc || routePosterSrc;
  const modalVideoTitle =
    pageShowreel?.videoTitle ||
    (variant === 'festival'
      ? 'Animae Caribe Festival Showreel'
      : variant === 'house'
        ? 'Animae Caribe House Showreel'
        : 'Animae Caribe Showreel');
  const modalStartTimeSeconds = pageShowreel?.startTimeSeconds;
  const modalEndTimeSeconds = pageShowreel?.endTimeSeconds;
  const modalPosterTimeSeconds = pageShowreel?.posterTimeSeconds;
  const modalAriaLabel = pageShowreel?.ariaLabel;
  const showreelButtonLabel =
    pageShowreel?.buttonLabel ||
    (variant === 'festival' ? 'Watch festival reel' : 'Watch showreel');

  const backgroundPlaybackId = pageBackgroundVideo?.playbackId || routePlaybackId;
  const backgroundPosterSrc = pageBackgroundVideo?.posterSrc || routePosterSrc;
  const backgroundVideoTitle =
    pageBackgroundVideo?.videoTitle ||
    (variant === 'festival'
      ? 'Animae Caribe Festival Hero Background'
      : variant === 'house'
        ? 'Animae Caribe House Showreel'
        : 'Animae Caribe Background');
  const backgroundStartTimeSeconds = pageBackgroundVideo?.startTimeSeconds;
  const backgroundEndTimeSeconds = pageBackgroundVideo?.endTimeSeconds;
  const backgroundPosterTimeSeconds = pageBackgroundVideo?.posterTimeSeconds;

  const value = useMemo(
    () => ({
      variant,
      backgroundPlaybackId,
      backgroundPosterSrc,
      backgroundVideoTitle,
      backgroundStartTimeSeconds,
      backgroundEndTimeSeconds,
      backgroundPosterTimeSeconds,
      modalPlaybackId,
      modalPosterSrc,
      modalVideoTitle,
      modalStartTimeSeconds,
      modalEndTimeSeconds,
      modalPosterTimeSeconds,
      modalAriaLabel,
      showreelButtonLabel,
      canOpenShowreel,
      isShowreelOpen: isOpen,
      isBackgroundPaused: isOpen,
      setPageShowreel,
      setPageBackgroundVideo,
      openShowreel: () => {
        if (!canOpenShowreel) {
          return;
        }

        setIsOpen(true);
      },
      closeShowreel: () => setIsOpen(false),
    }),
    [
      backgroundEndTimeSeconds,
      backgroundPlaybackId,
      backgroundPosterSrc,
      backgroundPosterTimeSeconds,
      backgroundStartTimeSeconds,
      backgroundVideoTitle,
      canOpenShowreel,
      isOpen,
      modalAriaLabel,
      modalEndTimeSeconds,
      modalPlaybackId,
      modalPosterSrc,
      modalPosterTimeSeconds,
      modalStartTimeSeconds,
      modalVideoTitle,
      showreelButtonLabel,
      variant,
    ]
  );

  return <ShowreelContext.Provider value={value}>{children}</ShowreelContext.Provider>;
}

export function useShowreel() {
  const context = useContext(ShowreelContext);

  if (!context) {
    throw new Error('useShowreel must be used within a ShowreelProvider.');
  }

  return context;
}
