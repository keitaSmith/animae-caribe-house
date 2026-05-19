export type FeaturedProject = {
  title: string;
  category: string;
  image: string;
  alt: string;
  description: string;
};

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'Character Design',
    category: 'Visual Development',
    image: '/assets/characters/CarnivalCharacater-scaled.webp',
    alt: 'Original character design from Animae Caribe House',
    description:
      'A curated glimpse into the animated stories, visual worlds and creative energy shaped through Animae Caribe House.',
  },
  {
    title: 'Animation Worlds',
    category: 'Concept & Design',
    image: '/assets/characters/RobotFIN-scaled.webp',
    alt: 'Character artwork from Animae Caribe House',
    description:
      'From character ideas and storyboards to environments and animation-ready visual development.',
  },
  {
    title: 'Creative Concepts',
    category: 'Featured Work',
    image: '/assets/characters/Spin-And-Scratch-_Mother-Mouse_Turnaround-1-scaled.webp',
    alt: 'Animae Caribe House visual development artwork',
    description:
      'A space where script, storyboard, design and production support come together for digital creators.',
  },
];
