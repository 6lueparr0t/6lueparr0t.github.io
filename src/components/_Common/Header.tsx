import React, { type PropsWithChildren } from "react";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header>
      <div className="flex w-full justify-end p-4">
        <div className="self-center px-4">
          {import.meta.env.NODE_ENV === "development" && (
            <div className="self-center">
              <a
                href="/admin/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Admin
              </a>
            </div>
          )}
        </div>
        {children}
      </div>
    </header>
  );
};

export default Header;
