"use client";

import Link from "next/link";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "~/components/ui/NavigationMenu";
import { usePathname } from "next/navigation";

const ActiveLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  return (
    <Link href={href} passHref legacyBehavior>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle()}
        active={pathname === href}
      >
        {children}
      </NavigationMenuLink>
    </Link>
  );
};

export default ActiveLink;
