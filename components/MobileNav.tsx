"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
const navLinks = [
  { name: "Create", link: "/create" },
];
const MobileNavClient = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();


  return isMobile ? (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription hidden>Mobile Navigation Bar</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {navLinks.map((item, idx) => (
            <Link key={idx} href={item.link} className="block">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={() => setDrawerOpen(false)}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <>
      {navLinks.map((item, idx) => (
        <Button key={idx} asChild
            className="text-xs"
            variant={"ghost"}
            size={"sm"}
          >
        <Link href={item.link}>
            {item.name}
        </Link>
          </Button>
      ))}
    </>
  );
};

export default MobileNavClient;
