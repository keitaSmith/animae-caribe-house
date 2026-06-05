import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {AboutSectionHero, AboutSectionMain} from '@/components/AboutSectionComponents';
import {getAboutSectionFallback} from '@/lib/aboutSectionPages';
import {getAboutSectionPage, getActiveAboutJobListings} from '@/sanity/lib/queries';

type AboutSectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = 'force-dynamic';

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function generateMetadata({params}: AboutSectionPageProps): Promise<Metadata> {
  const {slug} = await params;
  const fallback = getAboutSectionFallback(slug);

  if (!fallback) {
    return {
      title: 'About | Animae Caribe',
    };
  }

  const page = await getAboutSectionPage(slug);
  const title = page?.seo?.seoTitle || page?.hero?.title || fallback.hero.title;
  const description = page?.seo?.seoDescription || page?.hero?.description || fallback.hero.description;
  const image = page?.seo?.seoImage || page?.hero?.image;

  return {
    title: `${title} | Animae Caribe`,
    description,
    openGraph: {
      title: `${title} | Animae Caribe`,
      description,
      type: 'website',
      images: image?.url ? [{url: image.url, alt: image.alt || title}] : undefined,
    },
  };
}

export default async function AboutSectionPage({params}: AboutSectionPageProps) {
  const {slug} = await params;
  const fallback = getAboutSectionFallback(slug);

  if (!fallback) {
    notFound();
  }

  const page = await getAboutSectionPage(slug);
  const jobs =
    fallback.pageType === 'liveWorkPlayLocal' ? (await getActiveAboutJobListings(todayIsoDate())) || [] : undefined;

  return (
    <section className="page-section page-section-cinematic about-section-page">
      <AboutSectionHero page={page} fallback={fallback} />
      <AboutSectionMain page={page} fallback={fallback} jobs={jobs} />
    </section>
  );
}
