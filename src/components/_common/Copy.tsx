import ReactGA from 'react-ga4';
import { useEffect, useState, type PropsWithChildren } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const Copy = ({ children }: PropsWithChildren<{ children: string }>) => {
  const [loaded, setLoaded] = useState(false);
  const copyToClipboard = (/*event: React.MouseEvent<HTMLDivElement>*/) => {
    navigator.clipboard
      .writeText(children)
      .then(() => {
        enqueueSnackbar("클립보드에 복사되었습니다!", {
          autoHideDuration: 2000,
          variant: "success",
        });

        ReactGA.event({
          category: 'copy',
          action: `Copied to clipboard: ${children}`,
          label: 'Copy Text',
          value: 1
        });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { autoHideDuration: 2000, variant: "error" });
      });
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? (
    <div className="flex items-center gap-2" onClick={copyToClipboard}>
      <SnackbarProvider />
      {children}
      <ClipboardIcon className="w-[24px] h-[24px]" />
    </div>
  ) : (
    <>{children}</>
  );
};

export default Copy;
