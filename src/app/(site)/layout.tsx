import type {ReactNode} from 'react';

import SiteShell from '@/components/SiteShell';
import {DEFAULT_FESTIVAL_YEAR} from '@/lib/festivalRoutes';
import {getActiveFestivalEdition} from '@/sanity/lib/queries';

export const metadata = {
  title: 'Animae Caribe House | Where Digital Creatives Find Community',
  description:
    'A cinematic digital home for Caribbean animation, creative production, community updates and featured work.',
};

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({children}: SiteLayoutProps) {
  const activeEdition = await getActiveFestivalEdition();
  const currentFestivalYear = activeEdition?.year || DEFAULT_FESTIVAL_YEAR;

  return <SiteShell currentFestivalYear={currentFestivalYear}>{children}</SiteShell>;
}
