import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import OverviewVideo from "@/components/sections/OverviewVideo";
import AboutMe from "@/components/sections/AboutMe";
import Ability from "@/components/sections/Ability";
import MyWork from "@/components/sections/MyWork";

export default function Home() {
  return (
    <>
      <div style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Hero />
      </div>
      <OverviewVideo />
      <AboutMe />
      <Ability />
      <MyWork />
    </>
  );
}
