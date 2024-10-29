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
import { Loader, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UseCurrentUser } from "@/api/user";

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
        className="w-80"
        align="end"
        side="bottom"
        forceMount
      >
        <div className="flex flex-row">
          <DropdownMenuItem className="">
            <div className="flex flex-col items-start p-1">
              <span className="text-sm font-semibold">{currentUser?.name}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {currentUser?.email}
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center p-2 text-sm"
            onSelect={(event) => {
              event.preventDefault();
              if (!userLoading) {
                handleSignOut().catch((error) =>
                  console.error("Sign out handler failed:", error)
                );
              }
            }}
            disabled={userLoading}
          >
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>
              {userLoading
                ? "Loading..."
                : isPending
                  ? "Signing out..."
                  : "Sign out"}
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
