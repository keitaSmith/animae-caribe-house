import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

export default function TeamTeaser() {
  return (
    <section className="section team-teaser">
      <div className="container image-copy-grid">
        <div className="image-frame team-image-frame">
          <img src="/assets/studio-placeholder.webp" alt="Animae Caribe House team placeholder" />
        </div>
        <div className="glass-panel content-panel">
          <span className="section-kicker">The team</span>
          <h2>The people behind the pixels, stories and community.</h2>
          <p>
            Use this section for one strong group photo and a short, warm introduction to the team. The detailed Team page can later show individual profiles, roles, bios and creative credits.
          </p>
          <ButtonLink href="/team" variant="primary">
            Meet the team <ArrowRightIcon />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
