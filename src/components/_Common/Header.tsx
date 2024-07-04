import React, { type PropsWithChildren } from "react";
import { ModeToggle } from "@/components/mode-toggle";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header>
      <div className="flex justify-end items-center w-full gap-4 p-4">
        {process.env.NODE_ENV === "development" && (
          <a
            href="/admin/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Admin
          </a>
        )}
        <ModeToggle />
      </div>
      {children}
    </header>
  );
};

export default Header;
