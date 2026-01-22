import React, { useEffect, useRef } from "react";

import modalStore from "@/store/modal";

import type { Modal } from "@/components/components.d";
import { Button } from "@/components/ui/button";

import cat1 from "@/assets/loading/cat1.webp";
import cat2 from "@/assets/loading/cat2.webp";
import dog from "@/assets/loading/dog.webp";

interface ModalProps extends React.PropsWithChildren {
  modal: Modal;
  index?: number;
}

const Modal: React.FC<ModalProps> = ({ modal }) => {
  const { popModals } = modalStore();
  const modalRef = useRef<HTMLDivElement>(null);

  // 이미지 소스 배열의 타입을 지정
  const images: string[] = [cat1, cat2, dog];

  const loadingImg = (): string => {
    // 0부터 images 배열의 길이까지 랜덤 인덱스를 생성
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  useEffect(() => {
    // loading 타입일 때만 포커스 강제
    if (modal.type === "loading") {
      const interval = setInterval(() => {
        modalRef.current?.focus();
      }, 10);

      return () => {
        clearInterval(interval);
      };
    }
  }, [modal.type]);

  const closeModal = () => {
    const scrollY = window.scrollY;
    popModals();
    setTimeout(() => {
      if (modal?.prevRef?.current) {
        modal.prevRef.current.focus({ preventScroll: true });
      }
      window.scrollTo(0, scrollY);
    }, 10);
  };

  const keyDownLockHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      closeModal();
    }
  };

  return (
    <div className="flex items-center justify-center h-0">
      <div
        ref={modalRef}
        tabIndex={0}
        className={`fixed z-50 inset-0 overflow-y-auto`}
        onKeyDown={keyDownLockHandler}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden align-middle h-screen" aria-hidden="true"></span>

          <div
            className={`flex flex-col justify-center items-center bg-white dark:bg-zinc-950 rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 ${
              modal.type === "confirm" ? "max-w-2xl" : "max-w-4xl"
            } w-full z-50`}
          >
            <div className="bg-white dark:bg-zinc-950 mt-6 px-6">
              <div
                className={`flex ${
                  modal.type !== "loading" ? "flex-col" : "flex-row"
                } ${modal.type === "confirm" ? "text-lg" : "text-xl"} font-bold text-center`}
              >
                {modal.message}{" "}
                {modal.type === "loading" && (
                  <span className="animate-spin rounded-full relative mx-4">|</span>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-950 py-4 justify-around px-6 flex w-full">
              {modal.type === "loading" && (
                <div className="flex justify-center items-center">
                  <img src={loadingImg()} />
                </div>
              )}
              {modal.type === "alert" && (
                <Button
                  // text-black bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900
                  variant={"default"}
                  onClick={closeModal}
                >
                  {modal.confirmMessage || "확인"}
                </Button>
              )}
              {modal.type === "confirm" && modal.optionComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
