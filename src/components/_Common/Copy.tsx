import React, { useEffect, useState, type PropsWithChildren } from "react";
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
    <div onClick={copyToClipboard}>
      <SnackbarProvider />
      {children}
    </div>
  ) : (
    <>{children}</>
  );
}

export default Copy;
