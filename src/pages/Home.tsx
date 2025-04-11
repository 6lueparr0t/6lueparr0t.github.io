import { lazy, Suspense, useEffect } from "react";

const Ash = lazy(() => import("@/components/home/Ash"));
const Page1 = lazy(() => import("@/components/home/Page1"));
const Page2 = lazy(() => import("@/components/home/Page2"));
const Page3 = lazy(() => import("@/components/home/Page3"));
const Page4 = lazy(() => import("@/components/home/Page4"));
const Contact = lazy(() => import("@/components/home/Contact"));

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
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
        <Contact />
      </Suspense>
    </div>
  );
}

export default Home;
