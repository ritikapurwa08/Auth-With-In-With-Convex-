import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import Link from "next/link";
const FilterSnippets = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <FilterIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="w-56">
        <DropdownMenuItem>
          <Link href="/snippets">All Snippets</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/snippets/my-snippets">Your Snippets</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>TypeScript</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterSnippets;
