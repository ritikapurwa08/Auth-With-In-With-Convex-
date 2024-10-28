import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

interface useGetSnippet {
  id: Id<"snippets">;
}

export const useGetSnippet = ({ id }: useGetSnippet) => {
  const data = useQuery(api.snippets.getById, { id });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
