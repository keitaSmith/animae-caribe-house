import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import PortableTextRenderer from '@/sanity/PortableTextRenderer';
import {
  NewsMediaAdjacentNav,
  NewsMediaCard,
  NewsMediaHero,
} from '@/components/NewsMediaComponents';
import {formatNewsMediaDate, getNewsMediaRepository} from '@/lib/newsMedia';

type NewsMediaDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function buildYouTubeEmbedUrl(videoId?: string, embedUrl?: string) {
  if (embedUrl) {
    return embedUrl;
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
}

export async function generateMetadata({params}: NewsMediaDetailPageProps): Promise<Metadata> {
  const {slug} = await params;
  const item = await getNewsMediaRepository().getBySlug(slug);

  if (!item) {
    return {
      title: 'News & Media | Animae Caribe',
    };
  }

  const title = item.seoTitle || `${item.title} | Animae Caribe`;
  const description = item.seoDescription || item.excerpt || item.description;
  const imageUrl = item.seoImageUrl || item.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: item.publishedAt,
      images: imageUrl ? [{url: imageUrl, alt: item.imageAlt || item.title}] : undefined,
    },
  };
}

export default async function NewsMediaDetailPage({params}: NewsMediaDetailPageProps) {
  const {slug} = await params;
  const repository = getNewsMediaRepository();
  const [item, recent, adjacent] = await Promise.all([
    repository.getBySlug(slug),
    repository.getRecent(slug, 3),
    repository.getAdjacent(slug),
  ]);

  if (!item) {
    notFound();
  }

  const embedUrl = item.type === 'video' ? buildYouTubeEmbedUrl(item.youtubeVideoId, item.embedUrl) : undefined;
  const terms = [...item.categories, ...item.tags];

  return (
    <section className="page-section page-section-cinematic news-media-page">
      <NewsMediaHero />

      <article className="container news-media-detail">
        <div className="news-media-detail-header">
          <span className="section-kicker">{item.type === 'video' ? 'Video' : 'Article'}</span>
          <h1>{item.title}</h1>
          <div className="news-media-detail-meta">
            <time dateTime={item.publishedAt}>{formatNewsMediaDate(item.publishedAt)}</time>
            {item.author ? <span>By {item.author}</span> : null}
            {item.sourceLabel ? <span>{item.sourceLabel}</span> : null}
          </div>
          {terms.length ? (
            <div className="news-media-term-row news-media-detail-terms" aria-label="Categories and tags">
              {terms.map((term) => (
                <span key={term}>{term}</span>
              ))}
            </div>
          ) : null}
        </div>

        {item.type === 'video' ? (
          <div className="news-media-video-shell">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="news-media-card-placeholder">
                <span>Video unavailable</span>
              </div>
            )}
          </div>
        ) : item.imageUrl ? (
          <figure className="news-media-detail-image">
            <img src={item.imageUrl} alt={item.imageAlt || item.title} />
          </figure>
        ) : null}

        <div className="news-media-detail-body">
          {item.type === 'article' ? (
            item.body?.length ? <PortableTextRenderer value={item.body} /> : item.excerpt ? <p>{item.excerpt}</p> : null
          ) : (
            <>
              {item.description || item.excerpt ? <p>{item.description || item.excerpt}</p> : null}
              {item.matchedKeywords.length ? (
                <div className="news-media-matched-keywords">
                  <span className="contact-detail-label">Matched keywords</span>
                  <div className="news-media-term-row">
                    {item.matchedKeywords.slice(0, 8).map((keyword) => (
                      <span key={keyword}>{keyword}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </article>

      <div className="container news-media-detail-footer">
        <NewsMediaAdjacentNav adjacent={adjacent} />

        {recent.length ? (
          <section className="news-media-recent" aria-labelledby="recent-news-media">
            <div className="news-media-feed-heading">
              <span className="section-kicker">Recent posts</span>
              <h2 id="recent-news-media">More from News &amp; Media</h2>
            </div>
            <div className="news-media-grid news-media-grid-compact">
              {recent.map((recentItem) => (
                <NewsMediaCard item={recentItem} compact key={`${recentItem.type}-${recentItem.id}`} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
