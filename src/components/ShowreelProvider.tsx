'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export type ShowreelVariant = 'house' | 'festival' | 'none';

export type PageShowreelConfig = {
  playbackId?: string;
  posterSrc?: string;
  videoTitle?: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  posterTimeSeconds?: number;
  ariaLabel?: string;
};

type ShowreelContextValue = {
  variant: ShowreelVariant;
  playbackId?: string;
  posterSrc: string;
  videoTitle: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  posterTimeSeconds?: number;
  ariaLabel?: string;
  canOpenShowreel: boolean;
  isShowreelOpen: boolean;
  isBackgroundPaused: boolean;
  setPageShowreel: (config: PageShowreelConfig | null) => void;
  openShowreel: () => void;
  closeShowreel: () => void;
};

const ShowreelContext = createContext<ShowreelContextValue | null>(null);

type ShowreelProviderProps = {
  children: ReactNode;
};

export function ShowreelProvider({ children }: ShowreelProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageShowreel, setPageShowreel] = useState<PageShowreelConfig | null>(null);
  const pathname = usePathname() || '/';
  const housePlaybackId =
    process.env.NEXT_PUBLIC_MUX_HOUSE_SHOWREEL_PLAYBACK_ID || process.env.NEXT_PUBLIC_MUX_SHOWREEL_PLAYBACK_ID;
  const festivalPlaybackId = process.env.NEXT_PUBLIC_MUX_FESTIVAL_SHOWREEL_PLAYBACK_ID;
  const variant: ShowreelVariant = pathname === '/house' ? 'house' : pathname === '/festival' ? 'festival' : 'none';
  const routePlaybackId = variant === 'festival' ? festivalPlaybackId : variant === 'house' ? housePlaybackId : undefined;
  const playbackId = pageShowreel?.playbackId || routePlaybackId;
  const routePosterSrc = variant === 'festival' ? '/assets/animae-caribe-festival-feature.webp' : '/assets/hero-poster.webp';
  const posterSrc = pageShowreel?.posterSrc || routePosterSrc;
  const videoTitle =
    pageShowreel?.videoTitle ||
    (variant === 'festival'
      ? 'Animae Caribe Festival Showreel'
      : variant === 'house'
        ? 'Animae Caribe House Showreel'
        : 'Animae Caribe Showreel');
  const startTimeSeconds = pageShowreel?.startTimeSeconds;
  const endTimeSeconds = pageShowreel?.endTimeSeconds;
  const posterTimeSeconds = pageShowreel?.posterTimeSeconds;
  const ariaLabel = pageShowreel?.ariaLabel;
  const canOpenShowreel = variant === 'house' || variant === 'festival';

  const value = useMemo(
    () => ({
      variant,
      playbackId,
      posterSrc,
      videoTitle,
      startTimeSeconds,
      endTimeSeconds,
      posterTimeSeconds,
      ariaLabel,
      canOpenShowreel,
      isShowreelOpen: isOpen,
      isBackgroundPaused: isOpen,
      setPageShowreel,
      openShowreel: () => {
        if (!canOpenShowreel) {
          return;
        }

        setIsOpen(true);
      },
      closeShowreel: () => setIsOpen(false),
    }),
    [ariaLabel, canOpenShowreel, endTimeSeconds, isOpen, playbackId, posterSrc, posterTimeSeconds, startTimeSeconds, variant, videoTitle]
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
