import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const UseGetAllBlogs = () => {
  const data = useQuery(api.blog.getAllBlogs);

  const isLoading = data === undefined;
  return {
    data,
    isLoading,
  };
};
