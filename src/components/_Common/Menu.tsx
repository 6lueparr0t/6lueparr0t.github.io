import React from "react";
import { NavLink } from "react-router-dom";
import { type MenuProps } from "@/components/components.d";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bars3Icon } from "@heroicons/react/24/outline";

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
            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={"text-gray-800 dark:text-gray-100"}
                end
              >
                <div className="grid items-center justify-center md:justify-start gap-4 p-2 dark:hover:bg-gray-900 hover:bg-gray-200">
                  {menu.title}
                </div>
              </NavLink>
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
