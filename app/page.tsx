import { HeroSection } from "@/components/home/HeroSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { PopularMoviesSection } from "@/components/home/PopularMoviesSection";
import { PopularTVSection } from "@/components/home/PopularTVSection";
import { AnimeSpotlightSection } from "@/components/home/AnimeSpotlightSection";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <HeroSection />

      <div className="relative mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-6 sm:space-y-12 sm:px-6 sm:pt-8 lg:space-y-14 lg:px-8">
        <TrendingSection />
        <PopularMoviesSection />
        <PopularTVSection />
        <AnimeSpotlightSection />
      </div>
    </div>
  );
}