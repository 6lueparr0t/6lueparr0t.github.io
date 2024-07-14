import { useState, useEffect, useRef } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import { ReactTyped } from "react-typed";
import bird1 from "/public/bird1.webp";
import bird2 from "/public/bird2.webp";

function Page1() {
  const bird2Ref = useRef<HTMLImageElement>(null);
  const [clipPathValue, setClipPathValue] = useState("inset(0 50% 0 0)");
  const [bounds, setBounds] = useState<{ left: number; right: number }>({ left: 6, right: 256 });

  useEffect(() => {
    if (bird2Ref.current) {
      const bird2Width = bird2Ref.current.offsetWidth;
      setBounds({ left: 6, right: bird2Width });
    }
  }, []);

  const handleDrag = (_: DraggableEvent, ui: { x: number }) => {
    const { x } = ui;
    const percent = (x / bounds.right) * 100; // 이미지 너비에 따라 조정
    setClipPathValue(`inset(0 ${100 - percent}% 0 0)`);
  };

  useEffect(() => {
    if (clipPathValue && bird2Ref.current) {
      bird2Ref.current.style.setProperty("clip-path", clipPathValue);
    }
  }, [clipPathValue]);

  return (
    <div className="mx-auto p-4 text-center max-w-[calc(100%)] h-[calc(100lvh-4.4rem)] flex flex-col justify-center">
      <div className="relative w-64 h-64 mx-auto my-8">
        <img className="absolute w-64 h-64 " src={bird2} alt="logo" />
        <img className="absolute w-64 h-64 " src={bird1} alt="logo" ref={bird2Ref} />
        <Draggable
          axis="x"
          bounds={bounds} // 동적으로 계산된 bounds 적용
          defaultPosition={{ x: bounds.right / 2, y: 0 }} // 초기 위치
          onDrag={handleDrag}
          nodeRef={bird2Ref}
        >
          <div
            className="absolute top-0 h-full w-2 bg-gray-950 cursor-pointer"
            onDoubleClick={() => {
              setClipPathValue(`inset(0 50% 0 0)`);
            }}
          />
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
