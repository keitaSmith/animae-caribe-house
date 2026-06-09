import type {Metadata} from 'next';
import HouseExperience from '@/components/HouseExperience';
import {normalizeSanityPartners} from '@/lib/partners';
import {getHousePage, getHousePartners, getRecentPosts} from '@/sanity/lib/queries';

export const revalidate = 60;

const defaultMetadata: Metadata = {
  title: 'Animae Caribe House | Where Digital Creatives Find Community',
  description:
    'A cinematic digital home for Caribbean animation, creative production, community updates and featured work.',
};

export async function generateMetadata(): Promise<Metadata> {
  const housePage = await getHousePage();
  const seo = housePage?.seo;

  return {
    title: seo?.seoTitle || defaultMetadata.title,
    description: seo?.seoDescription || defaultMetadata.description,
  };
}

export default async function HousePage() {
  const [housePage, sanityPartners, recentPosts] = await Promise.all([
    getHousePage(),
    getHousePartners(),
    getRecentPosts(),
  ]);
  const partners = normalizeSanityPartners(sanityPartners);

  return (
    <HouseExperience
      content={housePage}
      partners={partners.length ? partners : null}
      posts={recentPosts?.length ? recentPosts : null}
    />
  );
}
