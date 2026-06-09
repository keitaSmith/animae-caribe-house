import type {PortableTextBlock} from '@portabletext/types';
import { featuredProjects } from '../data/projects';
import PortableTextRenderer from '@/sanity/PortableTextRenderer';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon, MailIcon } from './Icons';

type FeaturedWorkProps = {
  title?: string;
  copy?: string;
  body?: PortableTextBlock[] | null;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  showCta?: boolean;
};

export default function FeaturedWork({
  title = 'Featured Projects',
  copy = 'A curated look at the stories, visual worlds and creative experiments taking shape inside Animae Caribe House. We Animate in Sunshine.',
  body,
  primaryCtaHref = '/portfolio',
  primaryCtaLabel = 'View portfolio',
  secondaryCtaHref = 'mailto:info@animaecaribehouse.com',
  secondaryCtaLabel = 'Get in touch',
  showCta = true,
}: FeaturedWorkProps) {
  return (
    <section className="section featured-work" id="featured-work">
      <div className="container featured-work-header centered">
        <h2>{title}</h2>
        {body?.length ? (
          <PortableTextRenderer value={body} />
        ) : (
          <p>{copy}</p>
        )}
        {showCta !== false ? (
          <div className="featured-work-actions">
            <ButtonLink href={primaryCtaHref} variant="outline">
              {primaryCtaLabel} <ArrowRightIcon />
            </ButtonLink>
            <ButtonLink href={secondaryCtaHref} variant="soft">
              <MailIcon /> {secondaryCtaLabel}
            </ButtonLink>
          </div>
        ) : null}
      </div>

      <div className="container work-grid">
        {featuredProjects.map((project) => (
          <article className="work-card glass-card" key={project.title}>
            <img src={project.image} alt={project.alt} />
            <div className="work-card-body">
              <span>{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
