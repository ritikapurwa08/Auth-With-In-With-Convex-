"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { UseGetPaginatedSnippets } from "@/api/use-paginated-snippets";
import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import SnippetCard from "@/features/snippets/ui/snippets-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, FilterIcon } from "lucide-react";
import Link from "next/link";
import CreateSnippetForm from "@/features/snippets/form/create-snippets-form";

const SnippetsPage = () => {
  const [page, setPage] = React.useState(1);
  const { results: snippets, status, loadMore } = UseGetPaginatedSnippets();
  const totalPages = Math.ceil(snippets.length / 5);

  const LoadingBlog = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SnippetSkeleton key={`blog-${index}`} />
        ))}
      </div>
    );
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    if (newPage > page && status === "CanLoadMore") {
      loadMore();
    }

    setPage(newPage);
  };

  const getCurrentPageSnippets = () => {
    const startIndex = (page - 1) * 6;
    const endIndex = startIndex + 6;
    return snippets.slice(startIndex, endIndex);
  };

  const SnippetsGrid = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {getCurrentPageSnippets().map((snippet) => (
        <SnippetCard
          key={snippet._id}
          id={snippet._id}
          projectFiles={snippet.projectFiles}
          projectName={snippet.projectName}
          userId={snippet.userId}
          projectImage={snippet.projectImage}
        />
      ))}
    </div>
  );

  const isFirstPage = status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";
  const isLastPage = status === "Exhausted";

  const PaginationButtton = () => {
    return (
      <Pagination className="w-full">
        <PaginationContent className="w-full flex justify-between">
          <PaginationItem>
            <Button
              variant="default"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              size="lg"
              className="w-full"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
              <span>Prev</span>
            </Button>
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;

            // Show first page, current page, last page, and neighbors
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              Math.abs(pageNumber - page) <= 1
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <Button
                    variant={pageNumber === page ? "default" : "ghost"}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                </PaginationItem>
              );
            }

            // Show ellipsis for gaps
            if (
              (pageNumber === 2 && page > 3) ||
              (pageNumber === totalPages - 1 && page < totalPages - 2)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <Button
              variant="default"
              disabled={isLastPage || page === totalPages}
              size="lg"
              onClick={() => handlePageChange(page + 1)}
            >
              <span>Next</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="my-4 space-y-4">
        <h1 className="text-3xl font-bold">Snippets</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search snippets..."
              className="max-w-sm"
            />
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
          <div>
            <PaginationButtton />
          </div>
        </div>
      </div>

      <div className="py-2 ">
        {isLoadingMore || isFirstPage ? (
          <>
            <LoadingBlog />
          </>
        ) : (
          <SnippetsGrid />
        )}
      </div>
    </main>
  );
};

export default SnippetsPage;
