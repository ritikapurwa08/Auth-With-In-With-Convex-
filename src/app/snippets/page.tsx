"use client";

import React, { useState, useMemo } from "react";
import { FilterIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseGetPaginatedSnippets } from "@/api/use-paginated-snippets";
import CreateSnippetForm from "@/features/snippets/form/create-snippets-form";
import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import SnippetCard from "@/features/snippets/ui/snippets-card";
import Link from "next/link";
import { useDebounce } from "@/features/global/use-debounce";

const SKELETON_COUNT = 6;
const LOADING_MORE_COUNT = 3;

const SnippetsPage = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Use Convex's pagination hook
  const { results, status, loadMore } = UseGetPaginatedSnippets();

  // Memoize the filtered results
  const filteredResults = useMemo(() => {
    if (!results) return [];
    if (!debouncedSearch) return results;

    return results.filter((snippet) =>
      snippet.projectName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [results, debouncedSearch]);

  // Handle load more with loading state
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      await loadMore();
    } finally {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 500);
    }
  };

  const SkeletonGrid = ({ count }: { count: number }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SnippetSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  const SnippetGrid = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredResults.map((snippet) => (
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

  return (
    <main className="container mx-auto px-4 pt-8 pb-20">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Snippets</h1>

        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search snippets..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/snippets/my-snippets">Your Snippets</Link>
          </Button>
          <CreateSnippetForm />
        </div>
      </div>

      <div className="space-y-6">
        {status === "LoadingFirstPage" ? (
          <SkeletonGrid count={SKELETON_COUNT} />
        ) : (
          <>
            <SnippetGrid />

            {(status === "LoadingMore" || isLoadingMore) && (
              <div className="mt-4 animate-fade-in">
                <SkeletonGrid count={LOADING_MORE_COUNT} />
              </div>
            )}

            {status === "CanLoadMore" && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="min-w-[200px]"
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}

            {status === "Exhausted" && filteredResults.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You&apos;ve reached the end of the list</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default React.memo(SnippetsPage);
