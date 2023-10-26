"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "~/components/ui/NavigationMenu";

import ActiveLink from "../(shared)/ActiveLink";

const ProfNav = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <ActiveLink href="/">Home</ActiveLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ActiveLink href="/grading">Grading</ActiveLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ProfNav;
