import React, { type PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

import Menu from "@/components/_Common/Menu";
import { ModeToggle } from "@/components/mode-toggle";

const MENU: { path: string; title: string }[] = [
  {
    path: "/",
    title: "/",
  },
  {
    path: "/space",
    title: "space",
  },
];

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="font-['DungGeunMo'] sticky top-0 backdrop-blur-[20px] z-10">
      <div className="flex justify-between items-center pt-4 w-full gap-4 p-4">
        <ul className="hidden md:flex gap-10">
          {MENU.map((menu) => {
            return (
              <li key={menu.path}>
                <NavLink to={menu.path} className={"text-gray-800 hover:text-gray-400  dark:text-gray-100 dark:hover:text-gray-500"}>
                  {menu.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="flex md:hidden">
          <Menu menuList={MENU} />
        </div>
        <div className="flex">
          <ModeToggle />
        </div>
      </div>
      {children}
    </header>
  );
};

export default Header;
