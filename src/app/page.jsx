import Hero from '../components/Hero';
import PartnersStrip from '../components/PartnersStrip';
import AboutTeaser from '../components/AboutTeaser';
import ServicesSection from '../components/ServicesSection';
import SunriseDivider from '../components/SunriseDivider';
import FeaturedWork from '../components/FeaturedWork';
import StatsSection from '../components/StatsSection';
import TeamTeaser from '../components/TeamTeaser';
import FestivalFeatureSection from '../components/FestivalFeatureSection';
import NewsTeaser from '../components/NewsTeaser';
import FaqSection from '../components/FaqSection';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <PartnersStrip />
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
