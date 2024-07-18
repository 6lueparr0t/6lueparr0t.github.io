import Ash from "@/components/Home/Ash";
import Page1 from "@/components/Home/Page1";
import Page2 from "@/components/Home/Page2";
import Page3 from "@/components/Home/Page3";
import Page4 from "@/components/Home/Page4";
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
