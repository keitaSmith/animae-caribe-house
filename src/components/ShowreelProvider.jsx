'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const ShowreelContext = createContext(null);

export function ShowreelProvider({ children }) {
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
