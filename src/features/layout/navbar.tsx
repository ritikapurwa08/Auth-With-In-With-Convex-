"use client";

import React from "react";

import { SiCodeblocks } from "react-icons/si";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import UserButton from "../auth/user-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathName = usePathname();
  const isActive = (path: string) => {
    if (pathName === path) {
      return true;
    }
  };

  return (
    <nav className=" items-center border-b max-w-7xl w-full mx-auto p-3 justify-center grid grid-cols-12 ">
      <div className="prose prose-sm lg:prose-base w-full col-span-5 justify-start   flex flex-row  items-center gap-2">
        <span>
          <SiCodeblocks className="size-8" />
        </span>
        <h1>Code Snippets</h1>
      </div>
      <div className=" hidden lg:flex col-span-6 flex-row items-center justify-center gap-2">
        <Button
          variant={isActive("/") ? "default" : "outline"}
          size="lg"
          asChild
        >
          <Link href="/">Home</Link>
        </Button>
        <Button
          variant={isActive("/snippets") ? "default" : "outline"}
          size="lg"
          asChild
        >
          <Link href="/snippets">Snippets</Link>
        </Button>
        <Button
          variant={isActive("/blog") ? "default" : "outline"}
          size="lg"
          asChild
        >
          <Link href="/blog">Blogs</Link>
        </Button>
        <Button
          variant={isActive("/contact") ? "default" : "outline"}
          size="lg"
          asChild
        >
          <Link href="/contact">Contact</Link>
        </Button>
      </div>

      <div className="flex justify-center col-span-1">
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
