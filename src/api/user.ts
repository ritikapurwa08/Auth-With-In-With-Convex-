import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const UseCurrentUser = () => {
  const user = useQuery(api.users.getCurrentUser);

  const isLoading = user === undefined;

  return {
    user,
    isLoading,
  };
};
