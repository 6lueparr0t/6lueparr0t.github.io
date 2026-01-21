import { useEffect, useRef, useState } from "react";

import modalStore from "@/store/modal";

import CoinConfetti from "@/components/confetti/coin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import Door from "../elements/Door";

function MontyHall() {
  const { pushModals } = modalStore();

  const [count, setCount] = useState(0);
  const [party, setParty] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState<{ x: number; y: number } | undefined>(
    undefined
  );
  const [rewardCount, setRewarddCount] = useState(0);
  const [reloadCount, setReloadCount] = useState(0);
  const [doorOpenCheck, setDoorOpenCheck] = useState<string[]>([]);
  const [gifts, setGifts] = useState([
    { id: 0, status: "win", open: false, reward: "🎁" },
    { id: 1, status: "bomb", open: false, reward: "💣" },
    { id: 2, status: "poop", open: false, reward: "💩" },
  ]);

  const rerollHandler = () => {
    setParty(false);
    setDoorOpenCheck([]);
    setCount(0);
    setReloadCount((prev) => prev + 1);
    setGifts((prev) => {
      let newGifts;
      do {
        newGifts = [...prev]
          .sort(() => Math.random() - 0.5)
          .map((gift) => ({ ...gift, open: false }));
      } while (
        JSON.stringify(newGifts.map((item) => item.reward)) ===
        JSON.stringify(prev.map((item) => item.reward))
      );

      return newGifts;
    });
  };

  const initializeHandler = () => {
    setParty(false);
    setDoorOpenCheck([]);
    setCount(0);
    setRewarddCount(0);
    setReloadCount(0);
    setGifts((prev) => {
      return prev.map((gift) => ({ ...gift, open: false }));
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "r" || event.key === "ㄱ") {
        rerollHandler();
      }
      if (event.key === "R" || event.key === "ㄲ") {
        initializeHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const prevRewardCountRef = useRef(0);

  useEffect(() => {
    // rewardCount가 증가했을 때만 confetti 발생
    if (rewardCount > prevRewardCountRef.current) {
      setParty(true);
      setTimeout(() => {
        setParty(false);
      }, 2000);
    }
    prevRewardCountRef.current = rewardCount;
  }, [rewardCount]);

  useEffect(() => {
    console.log(party);
  }, [party]);

  return (
    <div id="graduate-school" className="mx-auto text-center bg-stone-100 dark:bg-zinc-900">
      <div className="text-xl md:text-2xl top-[0.4rem] md:top-[0.2rem] inline-block sticky justify-center py-4">
        graduate school
      </div>
      <CoinConfetti active={party} position={confettiPosition} />
      <Alert variant={"default"}>
        <AlertTitle className="text-xl">
          몬티 홀 문제&nbsp;
          <a
            className="text-blue-600 dark:text-blue-400"
            href="https://ko.wikipedia.org/wiki/%EB%AA%AC%ED%8B%B0_%ED%99%80_%EB%AC%B8%EC%A0%9C"
            target="_blank"
            rel="noreferrer"
          >
            #
          </a>
        </AlertTitle>
        <AlertDescription className="mt-4 leading-relaxed font-noto text-base justify-center">
          1. 문제를 풀기 전에 먼저 문을 선택합니다. <br />
          2. 문을 선택한 후, 진행자는 다른 문 중 하나를 열어서 상품이 없다는 것을 보여줍니다. <br />
          3. 선택을 바꾸는 것이 유리할까요?
        </AlertDescription>
      </Alert>
      <div className="p-16">
        <div className="flex flex-col justify-center overflow-x-auto">
          <div className="flex flex-row m-auto gap-10 md:gap-20 lg:gap-44 ">
            {gifts.map((gift, i) => (
              <Door
                key={gift.id}
                id={i}
                status={gift.status}
                gift={gift}
                gifts={gifts}
                setGifts={setGifts}
                count={count}
                setCount={setCount}
                setRewarddCount={setRewarddCount}
                doorOpenCheck={doorOpenCheck}
                setDoorOpenCheck={setDoorOpenCheck}
                onWinPosition={setConfettiPosition}
              >
                {gift.reward}
              </Door>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4">
            현재 성공 확률 :{" "}
            {(Math.floor((rewardCount / (reloadCount + 1)) * 100 * 100) / 100).toFixed(2)}%
          </div>
          <Button className="mx-2" onClick={rerollHandler}>
            다시하기{reloadCount > 0 && `(${reloadCount})`} (r)
          </Button>
          <Button className="mx-2" onClick={initializeHandler}>
            초기화 (R)
          </Button>
        </div>

        <div className="font-noto w-full md:w-3/4 lg:w-1/2 m-auto text-left break-keep">
          <div className="border-t border-slate-500 my-8" />
          <div className="mb-8">
            대학원 시절을 떠올리면 몬티 홀 문제가 가장 먼저 떠오릅니다.
            <br />그 밖에도 정지 문제, 인공지능 윤리학, Skip List 등등..
          </div>

          <div className="mb-8">
            저는 2022년 3월에 <Button className="px-2 h-6 mx-2">연세대 공학대학원</Button>{" "}
            컴퓨터소프트웨어과 석사과정에 입학하여 2024년 2월에 졸업했습니다.
          </div>

          <div className="mb-8">
            AI 기술의 핵심 분야인 데이터마이닝(Selenium + BS4, Clustering, Classification), 자연어
            처리(Transformer 기반의 LLM, BERT, GPT 계열 모델), 추천시스템(Collaborative Filtering,
            Content-Based Filtering, Matrix Factorization, Deep Learning 기반 모델)을 중심으로
            학습했고,
          </div>
          <p>이후 가상화폐 거래소를 다녔던 배경 지식을 기반으로 &nbsp;</p>
          <p>
            <span
              className="text-blue-600 dark:text-blue-400 cursor-pointer"
              onClick={() => {
                pushModals({
                  message: (
                    <>
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/LcShtTiDGsU?si=UfBiJ78xGNMdFAfC"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </>
                  ),
                  type: "alert",
                  confirmMessage: "닫기",
                });
              }}
            >
              클라우드 컴퓨팅 기반의 CBDC 구축 및 최적화 연구 프로젝트
            </span>
            에 참여하기도 했습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MontyHall;
