import { PropsWithChildren, useEffect } from "react";
import ReactGA from 'react-ga4';
import { useLocation, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/_common/Header";
import Footer from "@/components/_common/Footer";
import Modal from "@/components/_common/Modal";
import { ThemeProvider } from "@/components/custom/theme-provider";

import modalStore from "@/store/modal";
import Cookie from "@/components/_common/Cookie";

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
  }, []);

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modals]);

  useEffect(() => {
    document.title = "6lueparr0t's Home";
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
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
