import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import HeroWrapper from "@/components/ui/HeroWrapper";
import OverviewVideo from "@/components/sections/OverviewVideo";
import AboutMe from "@/components/sections/AboutMe";
import Ability from "@/components/sections/Ability";
import MyWork from "@/components/sections/MyWork";
import MyExperiences from "@/components/sections/MyExperiences";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroWrapper>
        <Hero />
      </HeroWrapper>
      <OverviewVideo />
      <AboutMe />
      <Ability />
      <MyWork />
      <MyExperiences />
      <Footer />
    </>
  );
}
