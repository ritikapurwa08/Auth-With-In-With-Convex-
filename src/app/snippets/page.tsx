"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FilterIcon } from "lucide-react";
import { UseGetPaginatedSnippets } from "@/api/use-paginated-snippets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateSnippetForm from "@/features/snippets/form/create-snippets-form";
import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import SnippetCard from "@/features/snippets/ui/snippets-card";
import Link from "next/link";
import { useDebounce } from "@/features/global/use-debounce";

// You'll need to create this hook

const SKELETON_COUNT = 6;
const LOADING_MORE_COUNT = 3;

const SnippetsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Memoize the pagination hook to prevent unnecessary re-fetching
  const { loadMore, results, status } = UseGetPaginatedSnippets();

  // Memoize the intersection observer callback
  const observerCallback = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && status === "CanLoadMore") {
        loadMore();
      }
    },
    [loadMore, status]
  );

  // Memoize the intersection observer options
  const observerOptions = useMemo(
    () => ({
      threshold: 0.1,
      rootMargin: "400px",
    }),
    []
  );

  // Memoize the load more ref setup
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [observerCallback, observerOptions]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Memoize the filtered results
  const filteredResults = useMemo(() => {
    if (!results) return [];
    if (!debouncedSearch) return results;

    return results.filter((snippet) =>
      snippet.projectName.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [results, debouncedSearch]);

  // Memoize the loading states
  const showLoadingMore = useMemo(
    () => status === "LoadingMore" || status === "CanLoadMore",
    [status]
  );

  // Memoize the skeleton grid
  const SkeletonGrid = useCallback(
    ({ count }: { count: number }) => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <SnippetSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    ),
    []
  );

  // Memoize the snippet grid
  const SnippetGrid = useCallback(
    () => (
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
    ),
    [filteredResults]
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
        </div>

        <CreateSnippetForm />
      </div>

      <div className="space-y-6">
        {status === "LoadingFirstPage" ? (
          <SkeletonGrid count={SKELETON_COUNT} />
        ) : (
          <>
            <SnippetGrid />

            {showLoadingMore && (
              <div className="mt-4 animate-fade-in">
                <SkeletonGrid count={LOADING_MORE_COUNT} />
              </div>
            )}

            {status === "Exhausted" && filteredResults.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You&apos;ve reached the end of the list</p>
              </div>
            )}
          </>
        )}

        {status !== "Exhausted" && <div ref={loadMoreRef} className="h-4" />}
      </div>
    </main>
  );
};

export default React.memo(SnippetsPage);
