import { usePaginatedQuery } from "convex/react";

import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

const BATCH_SIZE = 6;

export type GetMessagesReturnType =
  (typeof api.snippets.getPaginatedSnippets._returnType)["page"];

export const UseGetOwnPaginatedSnippets = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.snippets.getOwnPaginatedSnippets,
    {},
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
