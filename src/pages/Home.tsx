import { lazy, Suspense, useEffect } from "react";

const Ash = lazy(() => import("@/components/home/elements/Ash"));
const Intro = lazy(() => import("@/components/home/sections/Intro"));
const About = lazy(() => import("@/components/home/sections/About"));
const Experiences = lazy(() => import("@/components/home/sections/Experiences"));
const MontyHall = lazy(() => import("@/components/home/sections/MontyHall"));
const Contact = lazy(() => import("@/components/home/sections/Contact"));

function Home() {
  useEffect(() => {
    document.title = "6lueparr0t's Home";

    const scrollToHash = () => {
      if (window.location.hash) {
        const element = document.querySelector(window.location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="font-['DungGeunMo']">
      <Suspense fallback={<></>}>
        <Ash />
        <Intro />
        <About />
        <Experiences />
        <MontyHall />
        <Contact />
      </Suspense>
    </div>
  );
}

export default Home;
