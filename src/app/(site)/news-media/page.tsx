import type {Metadata} from 'next';
import {NewsMediaCard, NewsMediaEmptyState, NewsMediaHero, NewsMediaPagination} from '@/components/NewsMediaComponents';
import {getNewsMediaRepository} from '@/lib/newsMedia';

type NewsMediaPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: 'News & Media | Animae Caribe',
  description:
    'Follow the latest Animae Caribe stories, festival coverage, interviews, videos, and creative updates.',
  openGraph: {
    title: 'News & Media | Animae Caribe',
    description:
      'Follow the latest Animae Caribe stories, festival coverage, interviews, videos, and creative updates.',
    type: 'website',
  },
};

function parsePage(value?: string | string[]) {
  const pageValue = Array.isArray(value) ? value[0] : value;
  const page = Number(pageValue || 1);

  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export default async function NewsMediaPage({searchParams}: NewsMediaPageProps) {
  const {page} = await searchParams;
  const repository = getNewsMediaRepository();
  const feed = await repository.getPage(parsePage(page));

  return (
    <section className="page-section page-section-cinematic news-media-page">
      <NewsMediaHero />

      <div className="container news-media-feed">
        <div className="news-media-feed-heading">
          <span className="section-kicker">Archive</span>
          <h2>Latest stories and media</h2>
        </div>

        {feed.items.length ? (
          <>
            <div className="news-media-grid">
              {feed.items.map((item) => (
                <NewsMediaCard item={item} key={`${item.type}-${item.id}`} />
              ))}
            </div>
            <NewsMediaPagination currentPage={feed.currentPage} totalPages={feed.totalPages} />
          </>
        ) : (
          <NewsMediaEmptyState />
        )}
      </div>
    </section>
  );
}
