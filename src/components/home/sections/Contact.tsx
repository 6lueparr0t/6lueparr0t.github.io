import { useState } from "react";

// 항상 마지막 페이지로
function Contact() {
  const [isWobbling, setIsWobbling] = useState(true);

  const handleClick = () => {
    setIsWobbling(!isWobbling);
  };

  return (
    <div id="contact" className="mx-auto text-center">
      <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
        contact
      </div>

      <div className="flex flex-col justify-center items-center mx-8">
        <div className="mb-16 text-center break-keep">
          <div
            className="relative translate-y-28 sm:translate-y-36 opacity-80 cursor-pointer"
            onClick={handleClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#0099ff"
                fillOpacity="1"
                d="M0,256L60,229.3C120,203,240,149,360,149.3C480,149,600,203,720,213.3C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div
            className={`font-['Tossface'] inline-block text-7xl sm:text-8xl text-center my-8 cursor-pointer ${
              isWobbling ? "animate-ship" : ""
            }`}
            onClick={handleClick}
          >
            🏄‍♂️
          </div>
          <div className="relative text-xl">
            <p className="my-2">제 역량과 잠재력을 마음껏 펼칠 수 있는 곳을 찾고 있습니다.</p>
            <p className="my-2">메일로 연락 부탁드립니다.</p>
            감사합니다.<p className="font-['Tossface'] text-4xl">🙇‍♂️</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
