import type {PortableTextBlock} from '@portabletext/types';
import type {SanityImageSource} from '@/sanity/lib/types';
import PortableTextRenderer from '@/sanity/PortableTextRenderer';
import {urlForImage} from '@/sanity/lib/image';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

type FestivalFeatureSectionProps = {
  kicker?: string;
  title?: string;
  copy?: string;
  body?: PortableTextBlock[] | null;
  image?: SanityImageSource | null;
  showImage?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  showCta?: boolean;
};

function buildFeatureImageUrl(image?: SanityImageSource | null) {
  return urlForImage(image)?.width(960).height(1080).fit('crop').auto('format').url() || image?.url;
}

export default function FestivalFeatureSection({
  kicker = 'Animae Caribe 2026',
  title = 'Celebrating 25 Years',
  copy = 'Five unforgettable days of world-class animation, games, and digital creativity under the Caribbean sun.',
  body,
  image,
  showImage = true,
  ctaHref = 'https://www.animaecaribe.com/ac2025/',
  ctaLabel = 'Find out more',
  showCta = true,
}: FestivalFeatureSectionProps) {
  const imageUrl = buildFeatureImageUrl(image);

  return (
    <section className="section festival-feature-section editorial-feature-section" id="festival">
      <div className="container editorial-feature-inner">
        <div className="editorial-feature-shell">
          {showImage !== false ? (
            <div className="editorial-feature-media festival-feature-media">
              <img
                src={imageUrl || '/assets/animae-caribe-festival-feature.webp'}
                alt={image?.alt || 'Animae Caribe Festival 2026 feature collage celebrating 25 years'}
              />
            </div>
          ) : null}

          <div className="editorial-feature-copy festival-feature-copy">
            <span className="section-kicker">{kicker}</span>
            <h2>{title}</h2>
            {body?.length ? <PortableTextRenderer value={body} /> : <p>{copy}</p>}

            {showCta !== false ? (
              <ButtonLink href={ctaHref} variant="primary" external={Boolean(ctaHref && !ctaHref.startsWith('/'))}>
                {ctaLabel} <ArrowRightIcon />
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
