import React, { useEffect, useRef } from "react";
import modalStore from "@/store/modal";
import type { Modal } from "@/components/components.d";

import { Button } from "@/components/ui/button";

interface ModalProps extends React.PropsWithChildren {
  modal: Modal;
  index: number;
}

const Modal: React.FC<ModalProps> = ({ modal, index }) => {
  const { popModals } = modalStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      modalRef.current?.focus();
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const closeModal = () => {
    popModals();
    setTimeout(() => {
      if (modal?.prevRef?.current) modal?.prevRef?.current?.focus();
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
        className={`fixed z-${Number(10000 + index)} inset-0 overflow-y-auto`}
        onKeyDown={keyDownLockHandler}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden align-middle h-screen" aria-hidden="true"></span>

          <div className="inline-block align-middle bg-white dark:bg-slate-950 rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 max-w-lg w-full">
            <div className="bg-white dark:bg-slate-950 mt-8">
              <div className="text-xl font-bold text-center">{modal.message}</div>
            </div>
            <div className="bg-white dark:bg-slate-950 py-4 justify-around px-6 flex">
              {modal.type === "alert" && (
                <Button
                  // text-black bg-white hover:bg-slate-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900
                  variant={'default'}
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
