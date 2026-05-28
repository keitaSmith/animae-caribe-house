'use client';

import { useEffect, useRef, useState } from 'react';
import type { SanityCalendarSection } from '../sanity/lib/types';
import { DownloadIcon } from './Icons';
import ButtonLink from './ButtonLink';

type FestivalCalendarSectionProps = {
  content?: SanityCalendarSection | null;
};

function getDownloadHref(content?: SanityCalendarSection | null) {
  return content?.downloadFileUrl || content?.downloadUrl || content?.calendarImage?.url || '';
}

export default function FestivalCalendarSection({ content }: FestivalCalendarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const imageUrl = content?.calendarImage?.url;
  const imageAlt = content?.calendarImage?.alt || content?.heading || 'Festival programme image';
  const downloadHref = getDownloadHref(content);
  const canDownload = Boolean(downloadHref);
  const downloadVariant = content?.downloadButtonStyle || 'outline';

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (content?.isVisible === false || !imageUrl) {
    return null;
  }

  return (
    <>
      <section className="section festival-calendar-section" id="festival-calendar">
        <div className="container">
          <div className="festival-calendar-shell">
            <div className="festival-calendar-copy">
              {content?.eyebrow ? <span className="section-kicker">{content.eyebrow}</span> : null}
              {content?.heading ? <h2>{content.heading}</h2> : null}
              {content?.description ? <p>{content.description}</p> : null}
              {canDownload ? (
                <ButtonLink href={downloadHref} variant={downloadVariant} external>
                  <DownloadIcon /> {content?.downloadLabel || 'Download programme'}
                </ButtonLink>
              ) : null}
            </div>

            <button
              className="festival-calendar-preview"
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label={`Open ${content?.modalTitle || content?.heading || 'festival calendar'} larger`}
            >
              <img src={imageUrl} alt={imageAlt} />
            </button>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div
          className="showreel-modal-overlay festival-image-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={content?.modalTitle || content?.heading || 'Festival calendar image'}
          onClick={() => setIsOpen(false)}
        >
          <div className="showreel-modal-shell festival-image-modal-shell" onClick={(event) => event.stopPropagation()}>
            <button
              ref={closeButtonRef}
              className="showreel-modal-close"
              type="button"
              aria-label="Close programme image"
              onClick={() => setIsOpen(false)}
            >
              <span aria-hidden="true">X</span>
            </button>

            <div className="festival-image-modal-frame">
              {content?.modalTitle ? <h3 className="festival-image-modal-title">{content.modalTitle}</h3> : null}
              <div className="festival-image-modal-poster">
                <img src={imageUrl} alt={imageAlt} />
              </div>
              {canDownload ? (
                <div className="festival-image-modal-actions">
                  <ButtonLink href={downloadHref} variant={downloadVariant} external>
                    <DownloadIcon /> {content?.downloadLabel || 'Download programme'}
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
