import { useEffect, useState, type PropsWithChildren } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

interface CopyProps extends PropsWithChildren {
  title?: string;
  icon?: string;
  children: string;
}

const Copy: React.FC<CopyProps> = ({ title, icon, children }) => {
  const [loaded, setLoaded] = useState(false);
  const copyToClipboard = (/*event: React.MouseEvent<HTMLDivElement>*/) => {
    navigator.clipboard
      .writeText(children)
      .then(() => {
        enqueueSnackbar("클립보드에 복사되었습니다!", {
          autoHideDuration: 2000,
          variant: "success",
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
    <span className="flex flex-row items-center gap-2 cursor-pointer" onClick={copyToClipboard}>
      <SnackbarProvider maxSnack={10} autoHideDuration={3000} disableWindowBlurListener={true} />
      {title || title === "" ? title : children}
      {icon ? icon : <ClipboardIcon className="w-[24px] h-[24px]" />}
    </span>
  ) : (
    <>{children}</>
  );
};

export default Copy;
