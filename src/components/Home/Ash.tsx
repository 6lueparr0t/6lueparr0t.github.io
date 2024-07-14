import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import ash2 from "@/assets/ash2.gif";

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
      ashRef.current?.style.setProperty("left", `${Math.floor(scrollPercentage * 10) / 10}%`);
    });

    return () => clearTimeout(timeout);
  }, [scrollPercentage]);

  return (
    <div ref={ashRef} className="sticky bottom-6">
      <NavLink
        to={"/about"}
        className={"text-gray-800 hover:text-gray-400  dark:text-gray-100 dark:hover:text-gray-500"}
      >
        <img className="sm:w-[20px] sm:h-[20px] w-[16px] h-[16px]" src={ash2} alt="ash-going" />
      </NavLink>
    </div>
  );
}

export default Ash;
