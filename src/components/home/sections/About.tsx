import { useLayoutEffect, useState } from "react";

import AnimatedNumbers from "react-animated-numbers";

import { diffInYears } from "@/lib/date";

import Chip from "@/components/common/Chip";
import { Gallery } from "@/components/common/Gallery";

const startDate = new Date("2017-10-30");
const currentDate = new Date();

function About() {
  const [years, setYears] = useState(0);

  useLayoutEffect(() => {
    setYears(diffInYears(startDate, currentDate));
  }, []);

  return (
    <div id="about" className="mx-auto text-center bg-stone-100 dark:bg-zinc-900">
      <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
        about me
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <Gallery />
        <div className="font-noto mb-16 w-3/4 sm:w-1/2 text-left break-keep">
          <p>안녕하세요.</p>
          <div className="flex mb-8">
            저는
            <Chip
              title={
                <AnimatedNumbers
                  includeComma
                  transitions={(index) => ({
                    type: "spring",
                    duration: index + 0.2,
                  })}
                  animateToNumber={years}
                />
              }
              content={<span>2017.10.30 ~ </span>}
            />
            년차 웹 개발자
            <Chip title={<>임대현</>} content={<p>Daehyun Lim</p>} />
            입니다.
          </div>

          <p>
            PHP 웹 개발을 시작으로 BE(Java, Node.js), DevOps(Jenkins, Kubernetes), FE(Javascript,
            React.js & Next.js) 등
          </p>
          <p className="mb-8">웹 관련 개발 경험을 가지고 있습니다.</p>

          <p className="mb-8">
            연구실, 호스팅 서비스, 가상화폐 거래소, 동영상 숏폼 서비스 등의 도메인에서 업무를
            해왔고, 현재는 React.js 를 활용한 프론트엔드 개발에 주력하고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
