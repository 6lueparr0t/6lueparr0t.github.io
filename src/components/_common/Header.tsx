import mainStore from "@/store/main";

import React, { type PropsWithChildren } from "react";
import { NavLink } from "react-router";

import Menu from "@/components/_common/Menu";
// import ServerSentEvent from "@/components/_common/ServerSentEvent";
import { ModeToggle } from "@/components/custom/mode-toggle";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  const { aboutLink } = mainStore();

  const MENU: { title: string; path?: string; src?: string }[] = [
    {
      path: "/",
      title: "/",
    },
    ...(aboutLink ? [{ path: "/about", title: "about" }] : []),
    {
      path: "/space",
      title: "space",
    },
    {
      src: "https://6lueparr0t.bearblog.dev/blog/",
      title: "blog",
    },
    {
      path: "/guest",
      title: "guest",
    },
  ];

  return (
    <header className="font-['DungGeunMo'] sticky top-0 backdrop-blur-[20px] z-10">
      <div className="flex justify-between items-center pt-4 w-full gap-4 p-4">
        <ul className="hidden md:flex gap-10">
          {MENU.map(({ title, path, src }) =>
            src ? (
              <li key={src}>
                <a
                  href={src}
                  target="_blank"
                  className="text-gray-800 hover:text-gray-400 dark:text-gray-100 dark:hover:text-gray-500"
                >
                  {title}
                </a>
              </li>
            ) : path ? (
              <li key={path}>
                <NavLink
                  id={title}
                  to={path}
                  className="text-gray-800 hover:text-gray-400 dark:text-gray-100 dark:hover:text-gray-500"
                >
                  {title}
                </NavLink>
              </li>
            ) : null
          )}
        </ul>
        <div className="flex md:hidden">
          <Menu menuList={MENU} />
        </div>
        <div className="flex">
          <ModeToggle />
        </div>
      </div>
      {children}
      {/* <ServerSentEvent/> */}
    </header>
  );
};

export default Header;
