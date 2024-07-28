import Ash from "@/components/home/Ash";
import Page1 from "@/components/home/Page1";
import Page2 from "@/components/home/Page2";
import Page3 from "@/components/home/Page3";
import Page4 from "@/components/home/Page4";
import Now from "@/components/home/Now";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
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
      <Ash />
      <Page1 />
      <Page2 />
      <Page3 />
      <Page4 />
      <Now />
    </div>
  );
}

export default Home;
