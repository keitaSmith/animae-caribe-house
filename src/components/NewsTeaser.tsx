import { articles } from '../data/articles';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

export default function NewsTeaser() {
  return (
    <section className="section news-teaser">
      <div className="container section-heading-row">
        <div>
          <span className="section-kicker">News and articles</span>
          <h2>A place for updates while events are happening.</h2>
        </div>
        <ButtonLink href="/news" variant="outline">
          Read articles <ArrowRightIcon />
        </ButtonLink>
      </div>

      <div className="container article-grid compact">
        {articles.slice(0, 3).map((article) => (
          <article className="article-card glass-card" key={article.title}>
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
