import { partners } from '../data/partners';

export default function PartnersStrip() {
  return (
    <section className="partners-section" aria-label="Partners">
      <div className="container">
        <p className="section-kicker">Partners and collaborators</p>
        <div className="partner-marquee">
          {partners.map((partner) => (
            <div className="partner-logo glass-tile" key={partner}>
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
