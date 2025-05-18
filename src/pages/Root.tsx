import { PropsWithChildren, useEffect } from "react";

import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router";

import modalStore from "@/store/modal";

import Cookie from "@/components/common/Cookie";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import { ThemeProvider } from "@/components/custom/theme-provider";

const Root: React.FC<PropsWithChildren> = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const navigate = useNavigate();
  const location = useLocation();
  const { pushModals, modals, clearModals } = modalStore();

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "/") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modals]);

  useEffect(() => {
    clearModals();
    window.scrollTo({ top: 0, behavior: "instant" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
      <Cookie />
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
