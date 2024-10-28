"use client";

import { useGetAllSnippets } from "@/api/use-snippets-by-member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeBlockSmall from "@/components/workspace/code-block-small";

import CreateSnippetsModal from "@/components/workspace/use-create-snippents-modal";
import { FilterIcon } from "lucide-react";

import React from "react";

const page = () => {
  const { data: allSnippets, isLoading: loadingAllSnippets } =
    useGetAllSnippets();
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
          <CreateSnippetsModal />
          <Button variant="outline" size="lg">
            <span>
              <FilterIcon />
            </span>

            <span>filter</span>
          </Button>
        </div>
      </div>

      {allSnippets?.map((code) => (
        <CodeBlockSmall
          id={code._id}
          userId={code.userId}
          projectFiles={code.projectFiles}
          projectName={code.projectName}
          projectImage={code.projectImage}
        />
      ))}
    </section>
  );
};

export default page;
