import type { Partner } from '../data/partners';
import { splitPartnersIntoBalancedRows } from '@/lib/partners';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

type PartnersStripProps = {
  items?: Partner[];
  kicker?: string;
  intro?: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaVariant?: 'primary' | 'soft' | 'outline';
  ariaLabel?: string;
};

export default function PartnersStrip({
  items = [],
  kicker = 'Partners and collaborators',
  intro,
  ctaHref,
  ctaLabel,
  ctaVariant = 'outline',
  ariaLabel = 'Partners',
}: PartnersStripProps) {
  const rows = splitPartnersIntoBalancedRows(items);

  if (!rows.length) {
    return null;
  }

  return (
    <section className="partners-section" aria-label={ariaLabel}>
      <div className="container">
        {kicker ? <p className="section-kicker">{kicker}</p> : null}
        {intro ? <p className="partners-section-intro">{intro}</p> : null}
        <div className="partner-marquee-shell">
          <div className="partner-marquee" data-row-count={rows.length}>
            {rows.map((row, rowIndex) => {
              const isReverse = rowIndex % 2 === 1;
              const duplicatedRow = [...row, ...row];

              return (
                <div className="partner-marquee-row" key={`partner-row-${rowIndex}`}>
                  <div
                    className={isReverse ? 'partner-marquee-track is-reverse' : 'partner-marquee-track'}
                    style={{ ['--partner-count' as string]: String(row.length) }}
                  >
                    {duplicatedRow.map((partner, itemIndex) => (
                      <div
                        className="partner-logo"
                        key={`${partner.src}-${rowIndex}-${itemIndex}`}
                        aria-hidden={itemIndex >= row.length ? 'true' : undefined}
                      >
                        <img src={partner.src} alt={itemIndex < row.length ? partner.name : ''} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {ctaHref && ctaLabel ? (
          <div className="partners-section-actions">
            <ButtonLink href={ctaHref} variant={ctaVariant}>
              {ctaLabel} <ArrowRightIcon />
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
