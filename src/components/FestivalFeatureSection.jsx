import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

export default function FestivalFeatureSection() {
  return (
    <section className="section festival-feature-section editorial-feature-section" id="festival">
      <div className="container editorial-feature-inner">
        <div className="editorial-feature-shell">
          <div className="editorial-feature-media festival-feature-media">
            <img
              src="/assets/animae-caribe-festival-feature.webp"
              alt="Animae Caribe Festival 2026 feature collage celebrating 25 years"
            />
          </div>

          <div className="editorial-feature-copy festival-feature-copy">
            <span className="section-kicker">Animae Caribe 2026</span>
            <h2>Celebrating 25 Years</h2>
            <p>
              Five unforgettable days of world-class animation, games, and digital creativity under the Caribbean sun.
            </p>

            <ButtonLink href="https://www.animaecaribe.com/ac2025/" variant="primary" external>
              Find out more <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
