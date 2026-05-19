import { featuredProjects } from '../../data/projects';

export const metadata = {
  title: 'Portfolio | Animae Caribe House',
};

export default function Portfolio() {
  return (
    <section className="page-section">
      <div className="container page-hero centered narrow-heading">
        <span className="section-kicker">Portfolio</span>
        <h1>Featured projects and production windows.</h1>
        <p>
          Start with image-led project cards. Later, each card can link to a dedicated case study, embedded video, credits and behind-the-scenes article.
        </p>
      </div>

      <div className="container work-grid large-grid">
        {featuredProjects.concat(featuredProjects).map((project, index) => (
          <article className="work-card glass-card" key={`${project.title}-${index}`}>
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
