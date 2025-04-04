import { Bars3Icon } from "@heroicons/react/24/outline";

import React from "react";
import { NavLink } from "react-router";

import { type MenuProps } from "@/components/components.d";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu: React.FC<MenuProps> = ({ menuList }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Bars3Icon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent className="font-['DungGeunMo']" side="left">
        <SheetHeader>
          <SheetTitle className="text-2xl">6lueparr0t's Home</SheetTitle>
          <SheetDescription className="text-base">prove your self</SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="text-xl grid gap-4">
          {menuList.map((menu) => {
            let link = null;
            if (menu.path) {
              link = (
                <NavLink to={menu.path} className={"text-gray-800 dark:text-gray-100"}>
                  <div className="grid items-center justify-center md:justify-start gap-4 p-2 dark:hover:bg-gray-900 hover:bg-gray-200">
                    {menu.title}
                  </div>
                </NavLink>
              );
            } else if (menu.src) {
              link = (
                <a key={menu.src} href={menu.src} target="_blank">
                  <div className="grid items-center justify-center md:justify-start gap-4 p-2 dark:hover:bg-gray-900 hover:bg-gray-200">
                    {menu.title}
                  </div>
                </a>
              );
            }
            return (
              <SheetClose key={menu.title} asChild>
                {link}
              </SheetClose>
            );
          })}
        </div>
        <Separator className="my-4" />
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
