import React, { useEffect, useState, type PropsWithChildren } from "react";
import { ClipboardIcon } from '@heroicons/react/24/outline'
import { SnackbarProvider, enqueueSnackbar } from "notistack";

function Copy({ children }: PropsWithChildren<{ children: string }>) {
  const [loaded, setLoaded] = useState(false);
  const copyToClipboard = (event: React.MouseEvent<HTMLDivElement>) => {
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
    <div className="flex items-center gap-2" onClick={copyToClipboard}>
      <SnackbarProvider />
      {children}
      <ClipboardIcon className="w-[24px] h-[24px]"/>
    </div>
  ) : (
    <>{children}</>
  );
}

export default Copy;
