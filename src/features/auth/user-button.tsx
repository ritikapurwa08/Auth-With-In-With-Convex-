"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  BoxIcon,
  Code2Icon,
  Contact2Icon,
  HomeIcon,
  Loader,
  LogOut,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UseCurrentUser } from "@/api/user";
import Link from "next/link";

const UserButton = () => {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { user: currentUser, isLoading: userLoading } = UseCurrentUser();
  const { signOut } = useAuthActions();
  const router = useRouter();

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacterIndex(
        (prevIndex) => (prevIndex + 1) % characters.length
      );
    }, 1000 / characters.length);
    return () => clearInterval(interval);
  }, [characters.length]);

  const handleSignOut = useCallback(async () => {
    setIsPending(true);
    try {
      await signOut().then(() => {
        router.push("/auth");
      });
      router.push("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsPending(false);
    }
  }, [signOut, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-primary/10 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {userLoading ? (
            <AnimatePresence>
              <div
                className={
                  "size-10 rounded-full bg-zinc-600 text-white font-bold flex justify-center items-center relative"
                }
              >
                <motion.div
                  key={characters[currentCharacterIndex]}
                  transition={{ duration: 0.05 }}
                  className={"absolute "}
                >
                  {characters[currentCharacterIndex]}
                </motion.div>
              </div>
            </AnimatePresence>
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser?.image} alt={currentUser?.name} />
              <AvatarFallback className="bg-zinc-600 text-white font-bold">
                {currentUser?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60"
        align="center"
        side="bottom"
        forceMount
      >
        <DropdownMenuItem>
          <HomeIcon className="size-4 text-red-400" />
          <Link href="/">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Code2Icon className="size-4 text-red-400" />
          <Link href="/snippets">Snippets</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BoxIcon className="size-4 text-red-400" />
          <Link href="/blog">Blog</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Contact2Icon className="size-4 text-red-400" />
          <Link href="/contact">Contact</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-col items-start p-1">
              <span className="text-sm font-semibold capitalize">
                {currentUser?.name}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {currentUser?.email}
              </span>
            </div>
            <div>
              <Button
                onClick={handleSignOut}
                onSelect={(event) => {
                  event.preventDefault();
                  if (!userLoading) {
                    handleSignOut().catch((error) =>
                      console.error("Sign out handler failed:", error)
                    );
                  }
                }}
                variant="outline"
                size="icon"
                disabled={userLoading}
              >
                {isPending ? (
                  <Loader className=" size-4 animate-spin" />
                ) : (
                  <LogOut className=" size-4 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
