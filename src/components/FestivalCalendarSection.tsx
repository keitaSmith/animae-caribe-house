'use client';

import { useEffect, useRef, useState } from 'react';
import type { SanityCalendarSection } from '../sanity/lib/types';
import { DownloadIcon } from './Icons';

type FestivalCalendarSectionProps = {
  content?: SanityCalendarSection | null;
};

function getDownloadDetails(content?: SanityCalendarSection | null) {
  const rawImageUrl = content?.calendarImage?.url;

  if (!rawImageUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(rawImageUrl);
    const extensionMatch = parsedUrl.pathname.match(/\.([a-zA-Z0-9]+)$/);
    const extension = extensionMatch?.[1]?.toLowerCase() || 'jpg';
    const safeExtension = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(extension) ? extension : 'jpg';
    const filename = `animae-caribe-festival-calendar.${safeExtension}`;
    parsedUrl.searchParams.set('dl', filename);

    return {
      href: parsedUrl.toString(),
      filename,
    };
  } catch {
    return {
      href: rawImageUrl,
      filename: 'animae-caribe-festival-calendar.jpg',
    };
  }
}

function renderDownloadButton(
  details: { href: string; filename: string } | null,
  label: string,
  variant: string,
  className?: string
) {
  if (!details) {
    return null;
  }

  return (
    <a className={`button button-${variant}${className ? ` ${className}` : ''}`} href={details.href} download={details.filename}>
      <DownloadIcon /> {label}
    </a>
  );
}

export default function FestivalCalendarSection({ content }: FestivalCalendarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const imageUrl = content?.calendarImage?.url;
  const imageAlt = content?.calendarImage?.alt || content?.heading || 'Festival programme image';
  const downloadDetails = getDownloadDetails(content);
  const canDownload = Boolean(downloadDetails?.href);
  const downloadVariant = content?.downloadButtonStyle || 'outline';
  const downloadLabel = content?.downloadLabel || 'Download programme';

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
              {renderDownloadButton(downloadDetails, downloadLabel, downloadVariant)}
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
                  {renderDownloadButton(downloadDetails, downloadLabel, downloadVariant)}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
