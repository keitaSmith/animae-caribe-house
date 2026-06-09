import Hero from './Hero';
import PartnersStrip from './PartnersStrip';
import AboutTeaser from './AboutTeaser';
import ServicesSection from './ServicesSection';
import SunriseDivider from './SunriseDivider';
import FeaturedWork from './FeaturedWork';
import StatsSection from './StatsSection';
import TeamTeaser from './TeamTeaser';
import FestivalFeatureSection from './FestivalFeatureSection';
import NewsTeaser from './NewsTeaser';
import FaqSection from './FaqSection';
import type { Partner } from '../data/partners';

type HouseExperienceProps = {
  partners?: Partner[] | null;
};

export default function HouseExperience({partners}: HouseExperienceProps) {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <PartnersStrip items={partners || undefined} />
      <ServicesSection />
      <SunriseDivider />
      <FeaturedWork />
      <StatsSection />
      <TeamTeaser />
      <FestivalFeatureSection />
      <NewsTeaser />
      <FaqSection />
    </>
  );
}
