import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import Ash from "./Ash";
import { Gallery } from "./Gallery";

const startDate = dayjs("2017-10-30"); // 2017년 10월 1일을 기준으로 설정
const currentDate = dayjs();

function Page2() {
  const [years, setYears] = useState(0);

  useEffect(() => {
    const diffYears = currentDate.diff(startDate, "year", true); // 소수점 첫째 자리까지 계산
    setYears(parseFloat(diffYears.toFixed(2))); // 소수점 첫째 자리까지 표시
  }, []);
  return (
    <>
      <Ash />
      <div className="mx-auto text-center bg-stone-100 dark:bg-slate-900">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          about me
        </div>
        <div className="flex flex-col  justify-center items-center w-full">
          <div className="flex justify-center items-center p-4 my-16 bg-white shadow-2xl w-72 md:w-[400px] h-[400px] md:h-[550px]">
            <Gallery />
          </div>
          <div className="font-noto mb-16 w-3/4 sm:w-1/2 text-left break-keep">
            <p>안녕하세요.</p>
            <p className="mb-8">
              저는 {years}년차 웹 개발자
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="px-2 h-6 mx-2">임대현</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Daehyun Lim</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              입니다.
            </p>

            <p className="mb-8">{startDate.format("YYYY년 MM월 DD일")},</p>
            <p>
              PHP 웹 개발을 시작으로 BE(Java, Node.js), DevOps(Jenkins, Kubernetes), FE(Javascript,
              React.js & Next.js) 등등
            </p>
            <p className="mb-8">다양한 개발 경험을 가지고 있는 웹 개발자 입니다.</p>

            <p>
              연구실 / 호스팅 서비스 / 코인 거래소 / 숏폼 서비스 등의 도메인에서 업무를 해왔고,
              현재는 프론트엔드 개발에 주로 참여하고 있습니다.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto text-center h-[calc(100lvh)] bg-slate-50 dark:bg-slate-950">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          experience
        </div>
      </div>
      <div className="mx-auto text-center h-[calc(100lvh)] bg-stone-100 dark:bg-slate-900">
        <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4 z-10">
          now
        </div>
      </div>
    </>
  );
}

export default Page2;
