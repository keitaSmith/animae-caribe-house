'use client';

import { useEffect, useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { useShowreel } from './ShowreelProvider';

export default function ShowreelModal() {
  const { playbackId, isShowreelOpen, closeShowreel } = useShowreel();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isShowreelOpen) {
      return undefined;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarCompensation = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';

    if (scrollbarCompensation > 0) {
      body.style.paddingRight = `${scrollbarCompensation}px`;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeShowreel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [closeShowreel, isShowreelOpen]);

  if (!isShowreelOpen || !playbackId) {
    return null;
  }

  return (
    <div
      className="showreel-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Play the Animae Caribe House showreel"
      onClick={closeShowreel}
    >
      <div className="showreel-modal-shell" onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
        <button
          ref={closeButtonRef}
          className="showreel-modal-close"
          type="button"
          aria-label="Close showreel"
          onClick={closeShowreel}
        >
          <span aria-hidden="true">X</span>
        </button>

        <div className="showreel-modal-player-frame">
          <MuxPlayer
            className="showreel-modal-player"
            playbackId={playbackId}
            autoPlay
            playsInline
            streamType="on-demand"
            thumbnailTime={28}
            metadata={{
              video_title: 'Animae Caribe House Showreel',
            }}
            style={{
              width: '100%',
              height: '100%',
              '--media-object-fit': 'cover',
            }}
          />
        </div>
      </div>
    </div>
  );
}
