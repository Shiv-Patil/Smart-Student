"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "~/components/ui/NavigationMenu";

import ActiveLink from "../(shared)/ActiveLink";

const StudentNav = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <ActiveLink href="/">Home</ActiveLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ActiveLink href="/academics">Academics</ActiveLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ActiveLink href="/finance">Finance</ActiveLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default StudentNav;
