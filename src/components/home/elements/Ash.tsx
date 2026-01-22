import { useEffect, useRef, useState } from "react";

import { NavLink } from "react-router";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import ash2 from "@/assets/home/ash2.gif";

const message = [
  "안녕하세요?",
  "[tip] / 키를 누르면 메인으로 갑니다.",
  "[tip] 몬티 홀 문제에서 1, 2, 3번 키를 눌러보세요.",
  "[tip] r 은 다시 하기, R 은 초기화 입니다.",
  <NavLink
    to={"/about"}
    className={"text-gray-800 hover:text-gray-400  dark:text-gray-100 dark:hover:text-gray-500"}
  >
    제 소개 더 보실래요? [click]
  </NavLink>,
];

const RESPONSIVE_SIZE = 640;

function Ash() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [count, setCount] = useState(message.length - 1);

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
    let ashSize = 20;
    if (window) {
      ashSize = window.innerWidth < RESPONSIVE_SIZE ? 20 : 32;
    }
    const timeout = setTimeout(() => {
      const left = Math.min((Math.floor(scrollPercentage * 10) / 10) * 1, 98);
      ashRef.current?.style.setProperty("left", `calc(${left}% - ${ashSize}px)`);
    });

    return () => clearTimeout(timeout);
  }, [scrollPercentage]);

  return (
    <div ref={ashRef} className="fixed my-2 mx-0 bottom-0 z-10 cursor-pointer">
      <Popover onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <img
            className="w-[20px] min-w-[20px] h-[20px] min-h-[20px] sm:w-[32px] sm:h-[32px] sm:min-w-[32px] sm:min-h-[32px]"
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
