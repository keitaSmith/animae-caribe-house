import { featuredProjects } from '../data/projects';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

export default function FeaturedWork() {
  return (
    <section className="section featured-work" id="featured-work">
      <div className="container section-heading-row">
        <div>
          <span className="section-kicker">Featured work</span>
          <h2>Project windows today. Full case studies tomorrow.</h2>
        </div>
        <ButtonLink href="/portfolio" variant="outline">
          View portfolio <ArrowRightIcon />
        </ButtonLink>
      </div>

      <div className="container work-grid">
        {featuredProjects.map((project) => (
          <article className="work-card glass-card" key={project.title}>
            <img src={project.image} alt="" />
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
