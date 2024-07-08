import React, { type PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

const MENU: { path: string; title: string }[] = [
  {
    path: "/",
    title: "/",
  },
  {
    path: "/about",
    title: "about",
  },
];

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header>
      <div className="flex justify-between items-center w-full gap-4 p-4">
        <ul className="flex gap-6">
          {MENU.map((menu) => {
            return (
              <li key={menu.path}>
                <NavLink to={menu.path} className={"text-gray-800 hover:text-gray-400  dark:text-gray-100 dark:hover:text-gray-500"} end>
                  {menu.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="flex">
          <ModeToggle />
        </div>
      </div>
      {children}
    </header>
  );
};

export default Header;
