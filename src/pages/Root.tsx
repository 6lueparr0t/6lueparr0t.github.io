import { PropsWithChildren, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "@/components/_Common/Header";
import Footer from "@/components/_Common/Footer";
import Modal from "@/components/_Common/Modal";
import { ThemeProvider } from "@/components/theme-provider"

import modalStore from "@/store/modal";

const Root : React.FC<PropsWithChildren> = () => {
  const location = useLocation();
  const { modals, clearModals } = modalStore();

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modals]);

  useEffect(() => {
    clearModals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header/>
      <main>
        <Outlet />
        {modals.map((modal, index) => (
          <div key={`modal-${index}`} className="h-0">
            <Modal modal={modal} index={index} />
          </div>
        ))}
      </main>
      <Footer/>
    </ThemeProvider>
  );
};

export default Root;
