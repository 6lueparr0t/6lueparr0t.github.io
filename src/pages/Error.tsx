import { Button } from "@/components/ui/button";
import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  // you don't need to explicitly set error to `unknown`
  const error = useRouteError();
  let message: string;

  if (isRouteErrorResponse(error)) {
    message = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else {
    console.error(error);
    message = "Unknown error";
  }

  return (
    <div id="error-page" className="flex flex-col gap-8 justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-slate-400">
        <i>{message}</i>
      </p>
      <Link to={"/home"}>
        <Button>go to home</Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
