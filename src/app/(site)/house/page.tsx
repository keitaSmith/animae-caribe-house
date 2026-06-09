import HouseExperience from '@/components/HouseExperience';
import {normalizeSanityPartners} from '@/lib/partners';
import {getHousePartners} from '@/sanity/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Animae Caribe House | Where Digital Creatives Find Community',
  description:
    'A cinematic digital home for Caribbean animation, creative production, community updates and featured work.',
};

export default async function HousePage() {
  const partners = normalizeSanityPartners(await getHousePartners());

  return <HouseExperience partners={partners.length ? partners : null} />;
}
