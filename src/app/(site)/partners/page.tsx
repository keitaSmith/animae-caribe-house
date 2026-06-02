import Image from 'next/image';
import PartnersStrip from '@/components/PartnersStrip';
import { ecosystemPartners } from '@/data/ecosystem';
import { festivalPartners } from '@/data/festival';
import { partners as housePartners } from '@/data/partners';
import { getPartnersPage } from '@/sanity/lib/queries';
import partnersHeroCharacter from '@/../public/assets/characters/CarnivalCharacater02-copy-scaled.webp';

export const metadata = {
  title: 'Partners | Animae Caribe',
  description: 'Featured partners and collaborators across the Animae Caribe ecosystem.',
};

export default async function PartnersPage() {
  const partnersPage = await getPartnersPage();
  const hero = partnersPage?.hero;
  const heroImageSrc = hero?.image?.url || partnersHeroCharacter;
  const heroImageAlt = hero?.image?.alt || 'Illustrated carnival character representing Animae Caribe partners';
  const heroImageWidth = hero?.image?.width || partnersHeroCharacter.width;
  const heroImageHeight = hero?.image?.height || partnersHeroCharacter.height;

  return (
    <section className="page-section page-section-cinematic partners-page">
      <div className="page-cinematic-hero page-cinematic-hero-partners">
        <div className="container festival-programme-page-hero-shell">
          <div className="festival-programme-page-copy">
            <span className="section-kicker">{hero?.eyebrow || 'Partners'}</span>
            <h1>{hero?.title || 'Collaborators across the Animae Caribe ecosystem.'}</h1>
            <p>
              {hero?.description ||
                'Festival and House partners are intentionally kept as separate local data sets so each experience can grow with the right collaborators, sponsors and community relationships.'}
            </p>
          </div>
          <div className="festival-programme-page-side">
            <div className="page-cinematic-character page-cinematic-character-partners">
              <Image
                src={heroImageSrc}
                alt={heroImageAlt}
                width={heroImageWidth}
                height={heroImageHeight}
                className="page-cinematic-character-image"
                priority
                sizes="(max-width: 680px) 72vw, (max-width: 980px) 52vw, 360px"
              />
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
