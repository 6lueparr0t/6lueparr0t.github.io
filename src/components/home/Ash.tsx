import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import ash2 from "@/assets/home/ash2.gif";

const message: (string | JSX.Element)[] = [
  "안녕하세요?",
  "아직 작업 해야될게 더 남았는데..",
  "[tip] ' / ' 키를 누르면 메인으로 갑니다.",
  <NavLink
    to={"/about"}
    className={"text-gray-800 hover:text-gray-400  dark:text-gray-100 dark:hover:text-gray-500"}
  >
    제 소개 더 보실래요? [click]
  </NavLink>,
];

function Ash() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [count, setCount] = useState(0);

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

  const handlePopoverOpenChange = (open: boolean) => {
    if (open === true) {
      setCount((prevCount) => (prevCount + 1) % message.length);
    }
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
      const left = Math.min((Math.floor(scrollPercentage * 10) / 10) * 1.25, 96.8);
      ashRef.current?.style.setProperty("left", `calc(${left}%)`);
    });

    return () => clearTimeout(timeout);
  }, [scrollPercentage]);

  return (
    <div ref={ashRef} className="fixed my-2 mx-0 sm:mx-2 md:mx-2 lg:mx-4 bottom-0 z-10 cursor-pointer">
      <Popover onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <img
            className="w-[12px] min-w-[12px] h-[12px] min-h-[12px] sm:w-[20px] sm:h-[20px] sm:min-w-[20px] sm:min-h-[20px]"
            src={ash2}
            alt="ash-going"
          />
        </PopoverTrigger>
        <PopoverContent className="font-['DungGeunMo']">{message[count]}</PopoverContent>
      </Popover>
    </div>
  );
}

export default Ash;
