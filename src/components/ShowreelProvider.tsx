'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export type ShowreelVariant = 'house' | 'festival' | 'none';

export type VideoPlaybackConfig = {
  playbackId?: string;
  posterSrc?: string;
  posterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
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
  backgroundPosterSrc?: string;
  backgroundPosterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
  backgroundVideoTitle: string;
  backgroundStartTimeSeconds?: number;
  backgroundEndTimeSeconds?: number;
  backgroundPosterTimeSeconds?: number;
  modalPlaybackId?: string;
  modalPosterSrc?: string;
  modalPosterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
  modalVideoTitle: string;
  modalStartTimeSeconds?: number;
  modalEndTimeSeconds?: number;
  modalPosterTimeSeconds?: number;
  modalAriaLabel?: string;
  showreelButtonLabel: string;
  canOpenShowreel: boolean;
  isShowreelOpen: boolean;
  isBackgroundPaused: boolean;
  setPageShowreel: (config: VideoPlaybackConfig | null | undefined) => void;
  setPageBackgroundVideo: (config: VideoPlaybackConfig | null | undefined) => void;
  openShowreel: () => void;
  closeShowreel: () => void;
};

const ShowreelContext = createContext<ShowreelContextValue | null>(null);

type ShowreelProviderProps = {
  children: ReactNode;
};

export function ShowreelProvider({ children }: ShowreelProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageShowreel, setPageShowreel] = useState<VideoPlaybackConfig | null | undefined>(undefined);
  const [pageBackgroundVideo, setPageBackgroundVideo] = useState<VideoPlaybackConfig | null | undefined>(undefined);
  const pathname = usePathname() || '/';
  const housePlaybackId =
    process.env.NEXT_PUBLIC_MUX_HOUSE_SHOWREEL_PLAYBACK_ID || process.env.NEXT_PUBLIC_MUX_SHOWREEL_PLAYBACK_ID;
  const festivalPlaybackId = process.env.NEXT_PUBLIC_MUX_FESTIVAL_SHOWREEL_PLAYBACK_ID;
  const variant: ShowreelVariant = pathname === '/house' ? 'house' : pathname === '/festival' ? 'festival' : 'none';
  const routePlaybackId = variant === 'festival' ? festivalPlaybackId : variant === 'house' ? housePlaybackId : undefined;
  const routePosterSrc = variant === 'festival' ? '/assets/animae-caribe-festival-feature.webp' : '/assets/hero-poster.webp';
  const routePosterMode: 'muxFrame' | 'customImage' | 'fallbackImage' =
    routePlaybackId && (variant === 'house' || variant === 'festival') ? 'muxFrame' : 'fallbackImage';
  const canOpenShowreel = variant === 'house' || variant === 'festival';

  const hasPageShowreelOverride = typeof pageShowreel !== 'undefined';
  const hasPageBackgroundOverride = typeof pageBackgroundVideo !== 'undefined';

  const modalPlaybackId = pageShowreel?.playbackId || routePlaybackId;
  const modalPosterSrc = hasPageShowreelOverride ? pageShowreel?.posterSrc : routePosterSrc;
  const modalPosterMode = hasPageShowreelOverride ? pageShowreel?.posterMode : routePosterMode;
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

  const backgroundPlaybackId = hasPageBackgroundOverride ? pageBackgroundVideo?.playbackId : routePlaybackId;
  const backgroundPosterSrc = hasPageBackgroundOverride ? pageBackgroundVideo?.posterSrc : routePosterSrc;
  const backgroundPosterMode = hasPageBackgroundOverride ? pageBackgroundVideo?.posterMode : routePosterMode;
  const backgroundVideoTitle =
    (hasPageBackgroundOverride ? pageBackgroundVideo?.videoTitle : undefined) ||
    (variant === 'festival'
      ? 'Animae Caribe Festival Hero Background'
      : variant === 'house'
        ? 'Animae Caribe House Showreel'
        : 'Animae Caribe Background');
  const backgroundStartTimeSeconds = hasPageBackgroundOverride ? pageBackgroundVideo?.startTimeSeconds : undefined;
  const backgroundEndTimeSeconds = hasPageBackgroundOverride ? pageBackgroundVideo?.endTimeSeconds : undefined;
  const backgroundPosterTimeSeconds = hasPageBackgroundOverride ? pageBackgroundVideo?.posterTimeSeconds : undefined;

  const value = useMemo(
    () => ({
      variant,
      backgroundPlaybackId,
      backgroundPosterSrc,
      backgroundPosterMode,
      backgroundVideoTitle,
      backgroundStartTimeSeconds,
      backgroundEndTimeSeconds,
      backgroundPosterTimeSeconds,
      modalPlaybackId,
      modalPosterSrc,
      modalPosterMode,
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
      backgroundPosterMode,
      backgroundPosterTimeSeconds,
      backgroundStartTimeSeconds,
      backgroundVideoTitle,
      canOpenShowreel,
      isOpen,
      modalAriaLabel,
      modalEndTimeSeconds,
      modalPlaybackId,
      modalPosterSrc,
      modalPosterMode,
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
