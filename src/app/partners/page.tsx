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
    <section className="page-section partners-page">
      <div className="container page-hero split-grid">
        <div>
          <span className="section-kicker">Partners</span>
          <h1>Collaborators across the Animae Caribe ecosystem.</h1>
        </div>
        <p>
          Festival and House partners are intentionally kept as separate local data sets so each experience can grow
          with the right collaborators, sponsors and community relationships.
        </p>
      </div>

      <PartnersStrip items={ecosystemPartners} kicker="Featured ecosystem partners" ariaLabel="Ecosystem partners" />
      <PartnersStrip items={festivalPartners} kicker="Festival collaborators" ariaLabel="Festival partners" />
      <PartnersStrip items={housePartners} kicker="House collaborators" ariaLabel="House partners" />
    </section>
  );
}
