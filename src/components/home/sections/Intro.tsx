import { useEffect, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";

import IntroTitle from "../elements/IntroTitle";
import SpaceGrid from "../elements/SpaceGrid";
import bird1 from "/bird1.webp";
import bird2 from "/bird2.webp";

function Intro() {
  const bird2Ref = useRef<HTMLImageElement>(null);
  const [clipPath, setClipPath] = useState("inset(0 100% 0 0)");

  const [value, setValue] = useState<number[]>([0]);

  const handleChange = (newValue: number[]) => {
    setValue(newValue);
    setClipPath(`inset(0 ${100 - newValue[0]}% 0 0)`);
  };

  useEffect(() => {
    if (clipPath && bird2Ref.current) {
      bird2Ref.current.style.setProperty("clip-path", clipPath);
    }
  }, [clipPath]);

  const [bird1loaded, setBird1Loaded] = useState(false);
  const [bird2loaded, setBird2Loaded] = useState(false);

  useEffect(() => {
    const img1 = new Image();
    img1.src = bird1;
    img1.onload = () => setBird1Loaded(true);

    const img2 = new Image();
    img2.src = bird2;
    img2.onload = () => setBird2Loaded(true);
  }, []);

  return (
    <div
      id="intro"
      className="relative mx-auto p-4 text-center max-w-[calc(100%)] h-[calc(100lvh-4.4rem)] flex flex-col justify-center overflow-hidden"
    >
      {/* Space Grid 배경 */}
      <SpaceGrid className="z-0" />

      {/* 콘텐츠 레이어 */}
      <div className="relative z-10 flex flex-col items-center justify-center -mt-36">
        {/* IntroTitle - 이미지 상단에 배치 */}
        <IntroTitle
          initialText="One for a line, a line for all."
          tooltip="한 줄의 코딩, 모두를 위해서."
          className="text-4xl break-keep text-black dark:text-white mb-4"
        />

        <div className="relative w-64 min-h-64 mx-auto my-8">
          <img
            className={`absolute w-64 h-64 duration-100 ${bird1loaded ? "filter-none" : "blur-xl"}`}
            src={bird2}
            alt="logo"
          />
          <img
            className={`absolute w-64 h-64 duration-100 ${bird2loaded ? "filter-none" : "blur-xl"}`}
            src={bird1}
            alt="logo"
            ref={bird2Ref}
          />
        </div>

        <div className="w-64 mx-auto">
          <Slider
            className="w-full"
            value={value}
            max={100}
            step={1}
            onValueChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Intro;
