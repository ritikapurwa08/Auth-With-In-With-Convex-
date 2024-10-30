import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface GetBlogByIdProps {
  id: Id<"blog">;
}

export const GetBlogById = ({ id }: GetBlogByIdProps) => {
  const data = useQuery(api.blog.getById, { id });
  const isLoading = data === undefined;
  return {
    data,
    isLoading,
  };
};
