"use client";

import React, { useEffect, useRef, useState } from "react";
// import { format, isToday, isYesterday } from "date-fns";
import { FilterIcon } from "lucide-react";

import { UseGetPaginatedSnippets } from "@/api/use-paginated-snippets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateSnippetForm from "@/features/snippets/form/create-snippets-form";
import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import SnippetCard from "@/features/snippets/ui/snippets-card";

// Constants

const SKELETON_COUNT = 6;
const LOADING_MORE_COUNT = 3;

// Helper functions
// const formatDateLabel = (dateStr: string): string => {
//   const date = new Date(dateStr);
//   if (isToday(date)) return "Today";
//   if (isYesterday(date)) return "Yesterday";
//   return format(date, "EEEE, MMMM d");
// };

const SnippetsPage: React.FC = () => {
  const { loadMore, results, status } = UseGetPaginatedSnippets();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Handle scroll to detect when near bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 800; // Start loading earlier

      setIsNearBottom(documentHeight - scrollPosition < threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer setup with immediate loading
  useEffect(() => {
    const currentRef = loadMoreRef.current;

    if (currentRef) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && status === "CanLoadMore") {
            loadMore();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "400px", // Load earlier
        }
      );

      observer.observe(currentRef);
      return () => observer.disconnect();
    }
  }, [loadMore, status]);

  // Show loading skeletons when near bottom and can load more
  const showLoadingMore =
    status === "LoadingMore" || (isNearBottom && status === "CanLoadMore");

  return (
    <main className="container mx-auto px-4 pt-8 pb-20">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Snippets</h1>

        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search snippets..."
            className="max-w-sm"
          />
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>

        <CreateSnippetForm />
      </div>

      <div className="space-y-6">
        {status === "LoadingFirstPage" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <SnippetSkeleton key={`initial-loading-${index}`} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results?.map((snippet) => (
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

            {/* Loading more snippets animation */}
            {showLoadingMore && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4 animate-fade-in">
                {Array.from({ length: LOADING_MORE_COUNT }).map((_, index) => (
                  <SnippetSkeleton key={`load-more-${index}`} />
                ))}
              </div>
            )}

            {/* End of list message */}
            {status === "Exhausted" && results && results.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You&apos;ve reached the end of the list</p>
              </div>
            )}

            {/* Empty state */}
          </>
        )}

        {/* Load more trigger */}
        {status !== "Exhausted" && <div ref={loadMoreRef} className="h-4" />}
      </div>
    </main>
  );
};

export default SnippetsPage;

// Add this to your globals.css or equivalent
