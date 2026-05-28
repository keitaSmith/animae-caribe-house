import type { SanityVenueSection } from '../sanity/lib/types';
import ButtonLink from './ButtonLink';
import { ExternalIcon, MapPinIcon } from './Icons';

type FestivalVenueSectionProps = {
  content?: SanityVenueSection | null;
};

export default function FestivalVenueSection({ content }: FestivalVenueSectionProps) {
  const hasMap = Boolean(content?.googleMapsEmbedUrl);
  const hasMapLink = Boolean(content?.googleMapsUrl && content?.mapCtaLabel);
  const hasDetails = Boolean(content?.venueName || content?.address || content?.heading || content?.description);
  const mapVariant = content?.mapButtonStyle || 'primary';

  if (content?.isVisible === false || (!hasMap && !hasMapLink && !hasDetails)) {
    return null;
  }

  return (
    <section className="section festival-venue-section" id="festival-venue">
      <div className="container festival-venue-shell">
        <div className="festival-venue-copy">
          {content?.eyebrow ? <span className="section-kicker">{content.eyebrow}</span> : null}
          {content?.heading ? <h2>{content.heading}</h2> : null}
          {content?.description ? <p>{content.description}</p> : null}

          {content?.venueName || content?.address ? (
            <div className="festival-venue-details">
              {content?.venueName ? (
                <strong>
                  <MapPinIcon /> {content.venueName}
                </strong>
              ) : null}
              {content?.address ? <p>{content.address}</p> : null}
            </div>
          ) : null}

          {hasMapLink ? (
            <ButtonLink href={content?.googleMapsUrl || '#'} variant={mapVariant} external>
              {content?.mapCtaLabel} <ExternalIcon />
            </ButtonLink>
          ) : null}
        </div>

        <div className="festival-venue-map-frame">
          {hasMap ? (
            <iframe
              src={content?.googleMapsEmbedUrl}
              title={content?.venueName || content?.heading || 'Festival venue map'}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : hasMapLink ? (
            <div className="festival-venue-map-fallback">
              <p>{content?.venueName || 'Festival venue'}</p>
              <ButtonLink href={content?.googleMapsUrl || '#'} variant={mapVariant} external>
                {content?.mapCtaLabel} <ExternalIcon />
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
