import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

export default function TeamTeaser() {
  return (
    <section className="section team-teaser editorial-feature-section" id="team-preview">
      <div className="container editorial-feature-inner">
        <div className="editorial-feature-shell team-feature-shell">
          <div className="editorial-feature-media team-feature-media">
          <img src="/assets/team.webp" alt="Animae Caribe House team" />
          </div>
          <div className="editorial-feature-copy team-feature-copy">
            <span className="section-kicker">The team</span>
            <h2>The people behind the pixels, stories and community.</h2>
            <p>
              Use this section for one strong group photo and a short, warm introduction to the team. The detailed Team
              page can later show individual profiles, roles, bios and creative credits.
            </p>
            <ButtonLink href="/team" variant="primary">
              Meet the team <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
