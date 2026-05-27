import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

type AboutTeaserProps = {
  kicker?: string;
  title?: string;
  copy?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function AboutTeaser({
  kicker = 'About us',
  title = 'A creative house for Caribbean animation, talent and digital storytelling.',
  copy = 'Animae Caribe House brings digital creatives together around animation, story development, visual culture and community. The website should feel like a living showcase: cinematic, inviting and built to grow as new work, articles and updates are added.',
  ctaHref = '/about',
  ctaLabel = 'Read about the house',
}: AboutTeaserProps) {
  return (
    <section className="section about-teaser" id="about-preview">
      <div className="container split-grid">
        <div>
          <span className="section-kicker">{kicker}</span>
          <h2>{title}</h2>
        </div>
        <div className="stacked-copy">
          <p>{copy}</p>
          <ButtonLink href={ctaHref} variant="outline">
            {ctaLabel} <ArrowRightIcon />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
