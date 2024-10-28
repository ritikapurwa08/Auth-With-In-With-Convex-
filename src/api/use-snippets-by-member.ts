import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useGetAllSnippets = () => {
  const data = useQuery(api.snippets.getAllSnippets);
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
