"use client";

import React from "react";

import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import SnippetCard from "@/features/snippets/ui/snippets-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateSnippetForm from "@/features/snippets/form/create-snippets-form";
import Searchbar from "@/features/snippets/ui/searchbar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FilterIcon } from "lucide-react";

interface SnippetsDiscoverProps {
  searchParams: {
    search: string;
  };
}

const SnippetsDiscove = ({ searchParams }: SnippetsDiscoverProps) => {
  const { search } = searchParams;

  const snippetsData = useQuery(api.snippets.getSnippetsBySearch, {
    search: search || "",
  });

  const LoadingBlog = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SnippetSkeleton key={`blog-${index}`} />
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="my-4 space-y-4">
        <h1 className="text-3xl font-bold">Snippets</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-4">
            <Searchbar />
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Button variant="outline" size="icon">
              <FilterIcon className="size-4" />
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/snippets/my-snippets">Your Snippets</Link>
            </Button>
            <CreateSnippetForm />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snippetsData ? (
          <>
            {snippetsData.length > 0 ? (
              <div className="podcast_grid">
                {snippetsData?.map((snippets) => (
                  <SnippetCard
                    key={snippets._id}
                    id={snippets._id}
                    {...snippets}
                  />
                ))}
              </div>
            ) : (
              "Nothing found "
            )}
          </>
        ) : (
          <LoadingBlog />
        )}
      </div>
    </main>
  );
};

export default SnippetsDiscove;
