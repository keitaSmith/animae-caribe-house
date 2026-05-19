'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type ShowreelContextValue = {
  playbackId?: string;
  isShowreelOpen: boolean;
  isBackgroundPaused: boolean;
  openShowreel: () => void;
  closeShowreel: () => void;
};

const ShowreelContext = createContext<ShowreelContextValue | null>(null);

type ShowreelProviderProps = {
  children: ReactNode;
};

export function ShowreelProvider({ children }: ShowreelProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const playbackId = process.env.NEXT_PUBLIC_MUX_SHOWREEL_PLAYBACK_ID;

  const value = useMemo(
    () => ({
      playbackId,
      isShowreelOpen: isOpen,
      isBackgroundPaused: isOpen,
      openShowreel: () => {
        if (!playbackId) {
          return;
        }

        setIsOpen(true);
      },
      closeShowreel: () => setIsOpen(false),
    }),
    [isOpen, playbackId]
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
