'use client';

import {useEffect, useState} from 'react';
import type {SanityAboutGalleryImage} from '@/sanity/lib/types';

type AboutGalleryLightboxProps = {
  images: SanityAboutGalleryImage[];
};

export default function AboutGalleryLightbox({images}: AboutGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? undefined : images[activeIndex];
  const showControls = images.length > 1;

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    });
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    });
  };

  useEffect(() => {
    if (!activeImage) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
        return;
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((currentIndex) => {
          if (currentIndex === null) {
            return currentIndex;
          }

          return currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        });
        return;
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((currentIndex) => {
          if (currentIndex === null) {
            return currentIndex;
          }

          return currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImage, images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div className="about-gallery-grid">
        {images.map((image, index) => (
          <button
            className="about-gallery-item"
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${image.caption || image.alt || 'gallery image'} larger`}
          >
            {image.url ? <img src={image.url} alt={image.alt || image.caption || ''} loading="lazy" /> : null}
            {image.caption ? <span>{image.caption}</span> : null}
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          className="showreel-modal-overlay festival-image-modal-overlay about-gallery-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.caption || activeImage.alt || 'Gallery image'}
          onClick={() => setActiveIndex(null)}
        >
          <div className="showreel-modal-shell festival-image-modal-shell about-gallery-modal-shell" onClick={(event) => event.stopPropagation()}>
            <button className="showreel-modal-close" type="button" aria-label="Close gallery image" onClick={() => setActiveIndex(null)}>
              <span />
              <span />
            </button>
            {showControls ? (
              <>
                <button
                  className="about-gallery-modal-arrow about-gallery-modal-arrow-previous"
                  type="button"
                  aria-label="Previous gallery image"
                  onClick={showPreviousImage}
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  className="about-gallery-modal-arrow about-gallery-modal-arrow-next"
                  type="button"
                  aria-label="Next gallery image"
                  onClick={showNextImage}
                >
                  <span aria-hidden="true">›</span>
                </button>
              </>
            ) : null}
            <div className="festival-image-modal-frame">
              {activeImage.caption ? <h3 className="festival-image-modal-title">{activeImage.caption}</h3> : null}
              <div className="festival-image-modal-poster">
                <img src={activeImage.url} alt={activeImage.alt || activeImage.caption || ''} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
