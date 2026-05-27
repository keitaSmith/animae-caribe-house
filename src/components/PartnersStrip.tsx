import { partners } from '../data/partners';
import type { Partner } from '../data/partners';

type PartnersStripProps = {
  items?: Partner[];
  kicker?: string;
  ariaLabel?: string;
};

export default function PartnersStrip({
  items = partners,
  kicker = 'Partners and collaborators',
  ariaLabel = 'Partners',
}: PartnersStripProps) {
  return (
    <section className="partners-section" aria-label={ariaLabel}>
      <div className="container">
        {kicker ? <p className="section-kicker">{kicker}</p> : null}
        <div className="partner-marquee">
          {items.map((partner) => (
            <div className="partner-logo" key={partner.src}>
              <img src={partner.src} alt={partner.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
