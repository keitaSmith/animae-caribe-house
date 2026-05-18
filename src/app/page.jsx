import Hero from '../components/Hero';
import PartnersStrip from '../components/PartnersStrip';
import AboutTeaser from '../components/AboutTeaser';
import SunriseDivider from '../components/SunriseDivider';
import FeaturedWork from '../components/FeaturedWork';
import StatsSection from '../components/StatsSection';
import TeamTeaser from '../components/TeamTeaser';
import ShopTeaser from '../components/ShopTeaser';
import NewsTeaser from '../components/NewsTeaser';

export default function Home() {
  return (
    <>
      <Hero />
      <PartnersStrip />
      <AboutTeaser />
      <SunriseDivider />
      <FeaturedWork />
      <StatsSection />
      <TeamTeaser />
      <ShopTeaser />
      <NewsTeaser />
    </>
  );
}
