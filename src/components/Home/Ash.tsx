import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import ash2 from "@/assets/home/ash2.gif";

function Ash() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const ashRef = useRef<HTMLImageElement>(null);

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const currentScrollHeight = documentHeight - windowHeight;
    const currentScrollY = window.scrollY;

    // 스크롤 위치의 백분율 계산
    const percentage = (currentScrollY / currentScrollHeight) * 100;
    setScrollPercentage(percentage);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // Cleanup 이벤트 리스너
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const left = Math.min((Math.floor(scrollPercentage * 10) / 10) * 1.25, 96);
      ashRef.current?.style.setProperty("left", `calc(${left}%)`);
    });

    return () => clearTimeout(timeout);
  }, [scrollPercentage]);

  return (
    <div ref={ashRef} className="fixed my-2 sm:mx-8 bottom-0 z-10">
      <NavLink
        to={"/about"}
        className={
          "text-gray-800 hover:text-gray-400  dark:text-gray-100 dark:hover:text-gray-500"
        }
      >
        <img className="w-[12px] min-w-[12px] h-[12px] min-h-[12px] sm:w-[20px] sm:h-[20px] sm:min-w-[20px] sm:min-h-[20px]" src={ash2} alt="ash-going" />
      </NavLink>
    </div>
  );
}

export default Ash;
