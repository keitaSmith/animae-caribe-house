export type FeaturedProject = {
  title: string;
  category: string;
  image: string;
  description: string;
};

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'Stories in motion',
    category: 'Featured Work',
    image: '/assets/portfolio-gallery.webp',
    description:
      'A curated glimpse into the animated stories, visual worlds and creative energy shaped through Animae Caribe House.',
  },
  {
    title: 'Caribbean character worlds',
    category: 'Concept & Design',
    image: '/assets/creator-seaside.webp',
    description:
      'From character ideas and storyboards to environments and animation-ready visual development.',
  },
  {
    title: 'Creative production house',
    category: 'Studio Process',
    image: '/assets/studio-placeholder.webp',
    description:
      'A space where script, storyboard, design and production support come together for digital creators.',
  },
];
