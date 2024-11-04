"use client";

import React, { memo, useMemo } from "react";
import { UseGetPaginatedSnippets } from "@/api/use-paginated-snippets";
import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import SnippetCard from "@/features/snippets/ui/snippets-card";
import CreateSnippetForm from "@/features/snippets/form/create-snippets-form";
import PaginationComponent from "@/features/snippets/ui/pagination";
import FilterSnippets from "@/features/snippets/ui/filter-snippets";
import SearchComponent, {
  SearchedSnippetType,
  useSnippetsSearch,
} from "@/features/snippets/ui/searched-component";

const LoadingBlog = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <SnippetSkeleton key={`skeleton-${index}`} />
    ))}
  </div>
));

LoadingBlog.displayName = "LoadingBlog";

const SnippetsGrid = memo(({ items }: { items: SearchedSnippetType[] }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {items.map((snippet) => (
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
));

SnippetsGrid.displayName = "SnippetsGrid";

const SnippetsPage = () => {
  const [page, setPage] = React.useState(1);
  const { results: snippets, status, loadMore } = UseGetPaginatedSnippets();
  const { searchText, searchResults, handleSearch, isSearching } =
    useSnippetsSearch();

  const totalPages = useMemo(
    () => Math.ceil(snippets.length / 4),
    [snippets.length]
  );

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    if (newPage > page && status === "CanLoadMore") {
      await loadMore();
    }

    setPage(newPage);
  };

  const currentPageSnippets = useMemo(() => {
    const startIndex = (page - 1) * 6;
    const endIndex = startIndex + 6;
    return snippets.slice(startIndex, endIndex);
  }, [page, snippets]);

  const isFirstPage = status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";
  const isLastPage = status === "Exhausted";

  return (
    <main className="container flex flex-col gap-y-4 mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-row justify-between items-center gap-2">
          <h1 className="text-3xl font-bold text-black">Snippets</h1>
        </div>

        <div className="flex flex-row gap-2">
          <SearchComponent
            value={searchText}
            onChange={handleSearch}
            className="w-8/12"
          />
          <FilterSnippets />
          <CreateSnippetForm />
        </div>

        <div>
          {!isSearching && (
            <PaginationComponent
              currentPage={page}
              isLastPage={isLastPage}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>

      <div className="py-2">
        {isFirstPage || isLoadingMore ? (
          <LoadingBlog />
        ) : isSearching ? (
          <SnippetsGrid items={searchResults} />
        ) : (
          <SnippetsGrid items={currentPageSnippets} />
        )}
      </div>
    </main>
  );
};

export default SnippetsPage;
