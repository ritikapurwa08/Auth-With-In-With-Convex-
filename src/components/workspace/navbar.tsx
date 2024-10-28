"use client";

import React from "react";
import UserButton from "../auth/user-button";
import { SiCodeblocks } from "react-icons/si";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathName = usePathname();
  const isActive = (path: string) => {
    if (pathName === path) {
      return true;
    }
  };

  return (
    <nav className="flex border w-full h-14 p-2">
      <div className="flex max-w-7xl justify-between items-center w-full mx-auto">
        <Link href="/" id="logo" className="flex flex-row items-center gap-x-2">
          <SiCodeblocks />
          <span className="font-bold">Code Snippets</span>
        </Link>
        <div className=" flex flex-row gap-x-3 ">
          <Link
            href="/"
            className={cn("", isActive("/") && "underline underline-offset-2")}
          >
            Home
          </Link>
          <Link
            href="/snippets"
            className={cn(
              "",
              isActive("/snippets") && "underline underline-offset-2"
            )}
          >
            Snippets
          </Link>
          <Link
            href="/blog"
            className={cn(
              "",
              isActive("/blog") && "underline underline-offset-2"
            )}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className={cn(
              "",
              isActive("/contact") && "underline underline-offset-2"
            )}
          >
            Contact
          </Link>
        </div>
        <div>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
