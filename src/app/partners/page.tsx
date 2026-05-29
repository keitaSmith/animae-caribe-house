import PartnersStrip from '../../components/PartnersStrip';
import { ecosystemPartners } from '../../data/ecosystem';
import { festivalPartners } from '../../data/festival';
import { partners as housePartners } from '../../data/partners';

export const metadata = {
  title: 'Partners | Animae Caribe',
  description: 'Featured partners and collaborators across the Animae Caribe ecosystem.',
};

export default function PartnersPage() {
  return (
    <section className="page-section page-section-cinematic partners-page">
      <div className="page-cinematic-hero page-cinematic-hero-partners">
        <div className="container festival-programme-page-hero-shell">
          <div className="festival-programme-page-copy">
            <span className="section-kicker">Partners</span>
            <h1>Collaborators across the Animae Caribe ecosystem.</h1>
            <p>
            Festival and House partners are intentionally kept as separate local data sets so each experience can grow
            with the right collaborators, sponsors and community relationships.
            </p>
          </div>
          <div className="festival-programme-page-side">
            <div className="page-cinematic-ghost page-cinematic-ghost-partners" aria-hidden="true">
              <div className="page-cinematic-ghost-node page-cinematic-ghost-node-top" />
              <div className="page-cinematic-ghost-node page-cinematic-ghost-node-left" />
              <div className="page-cinematic-ghost-node page-cinematic-ghost-node-right" />
              <div className="page-cinematic-ghost-node page-cinematic-ghost-node-bottom" />
              <div className="page-cinematic-ghost-connection page-cinematic-ghost-connection-a" />
              <div className="page-cinematic-ghost-connection page-cinematic-ghost-connection-b" />
              <div className="page-cinematic-ghost-connection page-cinematic-ghost-connection-c" />
            </div>
          </div>
        </div>
      </div>

      <PartnersStrip items={ecosystemPartners} kicker="Featured ecosystem partners" ariaLabel="Ecosystem partners" />
      <PartnersStrip items={festivalPartners} kicker="Festival collaborators" ariaLabel="Festival partners" />
      <PartnersStrip items={housePartners} kicker="House collaborators" ariaLabel="House partners" />
    </section>
  );
}
