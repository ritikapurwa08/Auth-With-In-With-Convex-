import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

interface GetUserByIdProps {
  id: Id<"users">;
}

export const GetUserById = ({ id }: GetUserByIdProps) => {
  const data = useQuery(api.users.getUserById, { id });
  const isLoading = data === undefined;
  return {
    data,
    isLoading,
  };
};
