import { usePaginatedQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

const BATCH_SIZE = 6;

interface SnippetFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}

export type SnippetType = {
  _id: Id<"snippets">;
  _creationTime: number;
  projectName: string;
  projectFiles: SnippetFile[];
  userId: Id<"users">;
  projectImage?: string;
  formattedDate: string;
};

export type PaginationStatus =
  | "LoadingFirstPage"
  | "LoadingMore"
  | "CanLoadMore"
  | "Exhausted";

export const UseGetPaginatedSnippets = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.snippets.getPaginatedSnippets,
    {},
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results: results as SnippetType[],
    status: status as PaginationStatus,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
