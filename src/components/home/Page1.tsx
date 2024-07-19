import { useState, useEffect, useRef } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import { ReactTyped } from "react-typed";
import bird1 from "/bird1.webp";
import bird2 from "/bird2.webp";

function Page1() {
  const bird2Ref = useRef<HTMLImageElement>(null);
  const [clipPathValue, setClipPathValue] = useState("inset(0 50% 0 0)");
  const [bounds, setBounds] = useState<{ left: number; right: number }>({ left: 16, right: 256 });

  const handleDrag = (_: DraggableEvent, ui: { x: number }) => {
    const { x } = ui;
    const percent = (x / bounds.right) * 100; // 이미지 너비에 따라 조정
    setClipPathValue(`inset(0 ${100 - percent}% 0 0)`);
  };

  useEffect(() => {
    if (bird2Ref.current) {
      const bird2Width = bird2Ref.current.offsetWidth;
      setBounds({ left: 16, right: bird2Width });
    }
  }, []);

  useEffect(() => {
    if (clipPathValue && bird2Ref.current) {
      bird2Ref.current.style.setProperty("clip-path", clipPathValue);
    }
  }, [clipPathValue]);

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
    <div className="mx-auto p-4 text-center max-w-[calc(100%)] h-[calc(100lvh-4.4rem)] flex flex-col justify-center">
      <div className="relative w-64 min-h-64 mx-auto my-8">
        <img className={`absolute w-64 h-64 transition-filter duration-300 ${bird1loaded ? 'filter-none' : 'filter blur-xl'}`} src={bird2} alt="logo" />
        <img className={`absolute w-64 h-64 transition-filter duration-300 ${bird2loaded ? 'filter-none' : 'filter blur-xl'}`} src={bird1} alt="logo" ref={bird2Ref} />
        <Draggable
          axis="x"
          bounds={bounds} // 동적으로 계산된 bounds 적용
          defaultPosition={{ x: bounds.right / 2, y: 0 }} // 초기 위치
          onDrag={handleDrag}
          nodeRef={bird2Ref}
        >
          <div className="top-0 h-full w-4 bg-[hsla(0,0%,100%,.2)] cursor-pointer" />
        </Draggable>
      </div>
      <h1 className="text-6xl break-keep m-4 text-gradient">
        <ReactTyped className="home" strings={["Hello, World!"]} startDelay={500} typeSpeed={100} />
      </h1>
      <h2 className="text-4xl break-keep text-gradient">One for a line, a line for all.</h2>
    </div>
  );
}

export default Page1;
