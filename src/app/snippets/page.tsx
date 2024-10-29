"use client";

import { UseGetAllSnippets } from "@/api/use-snippets-by-member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterIcon } from "lucide-react";
import React from "react";
import CreateSnippetForm from "@/features/snippets/form/create-snippets-form";
import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import SnippetCard from "@/features/snippets/ui/snippets-card";

const page = () => {
  const { data: allSnippets, isLoading: isLoading } = UseGetAllSnippets();

  return (
    <section className="flex flex-col w-full">
      <div
        id="snippets-header"
        className="flex flex-row justify-between w-full p-4"
      >
        <h1 className="text-4xl font-bold">Snippets</h1>
        <div className="flex flex-row gap-x-4 items-center justify-center">
          <div>
            <Input type="text" />
          </div>
          <CreateSnippetForm />
          <Button variant="outline" size="lg">
            <span>
              <FilterIcon />
            </span>

            <span>filter</span>
          </Button>
        </div>
      </div>

      <div className="grid mx-auto  mt-6 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SnippetSkeleton key={index} />
            ))
          : allSnippets?.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                id={snippet._id}
                {...snippet}
                loading={false}
              />
            ))}
      </div>
    </section>
  );
};

export default page;
