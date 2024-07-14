import { PropsWithChildren, useEffect } from "react";
import { useLocation, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useKey } from "react-use";
import Header from "@/components/_Common/Header";
import Footer from "@/components/_Common/Footer";
import Modal from "@/components/_Common/Modal";
import { ThemeProvider } from "@/components/theme-provider";

import modalStore from "@/store/modal";

const Root: React.FC<PropsWithChildren> = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const navigate = useNavigate();
  const location = useLocation();
  const { pushModals, modals, clearModals } = modalStore();

  useKey("/", () => navigate("/"));

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

  // github pages 404 redirect
  useEffect(() => {
    if (redirect) {
      pushModals({ message: "now loading ...", type: "loading" });
      navigate(redirect);
    }
  }, [redirect, navigate, pushModals]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      {modals.map((modal, index) => (
        <div key={`modal-${index}`} className="font-['DungGeunMo'] h-0">
          <Modal modal={modal} index={index} />
        </div>
      ))}
    </ThemeProvider>
  );
};

export default Root;
