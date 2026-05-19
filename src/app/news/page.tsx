import { articles } from '../../data/articles';

export const metadata = {
  title: 'News & Articles | Animae Caribe House',
};

export default function News() {
  return (
    <section className="page-section">
      <div className="container page-hero centered narrow-heading">
        <span className="section-kicker">News and articles</span>
        <h1>Updates, stories and event coverage.</h1>
        <p>
          This starter uses static article data. Later, Sanity can power this page so the team can publish articles from an editor at /admin.
        </p>
      </div>

      <div className="container article-grid">
        {articles.concat(articles).map((article, index) => (
          <article className="article-card glass-card" key={`${article.title}-${index}`}>
            <span>{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <small>{article.date}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
