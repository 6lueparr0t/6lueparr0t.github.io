import Page1 from "@/components/Home/Page1";
import Page2 from "@/components/Home/Page2";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    window.scrollTo({top:0, behavior: 'smooth'});
  }, []);

  return (
    <div className="font-['DungGeunMo']">
      <Page1/>
      <Page2/>
    </div>
  );
}

export default Home;
