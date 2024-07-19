import Ash from "@/components/home/Ash";
import Page1 from "@/components/home/Page1";
import Page2 from "@/components/home/Page2";
import Page3 from "@/components/home/Page3";
import Page4 from "@/components/home/Page4";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    window.scrollTo({top:0, behavior: 'smooth'});
  }, []);

  return (
    <div className="font-['DungGeunMo']">
      <Ash />
      <Page1/>
      <Page2/>
      <Page3/>
      <Page4/>
    </div>
  );
}

export default Home;
