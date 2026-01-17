import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuViewport,
} from "./ui/navigation-menu";

import { ModeToggle } from "./mode-toggle";
import MobileNavClient from "./MobileNav";

const Navbar = () => {
  return (
    <NavigationMenu className="bg-background/60 backdrop-blur-xs fixed z-50">
      <NavigationMenuList className="w-dvw h-16 px-4 max-md:px-2 items-center">
        <NavigationMenuItem className="mr-auto">
          <Link className="text-base font-mont py-3 font-bold" href="/">
            Shad Themes
          </Link>
        </NavigationMenuItem>
        <MobileNavClient />
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
};

export default Navbar;
