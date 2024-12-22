import { Button } from "@/components/ui/button";
import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router";
import { Link } from "react-router";

function isErrorWithStatus(error: unknown): error is { status: number } {
  return typeof error === "object" && error !== null && "status" in error;
}

const ErrorPage: React.FC = () => {
  const error: unknown = useRouteError();
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

  const errorStatus: number = isErrorWithStatus(error) ? error.status : 500;

  return (
    <div id="error-page" className="flex flex-col gap-8 justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <div className="w-[600px]">
        <img src={`https://http.cat/${errorStatus}`} alt="error cat" />
      </div>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-zinc-400">
        <i>{message}</i>
      </p>
      <Link to={"/"}>
        <Button>go to home</Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
