import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface UseGetImageUrlProps {
  storageId: Id<"_storage"> | undefined;
}

export const UseGetImageUrl = ({ storageId }: UseGetImageUrlProps) => {
  const getImageUrl = useQuery(
    api.upload.getUrl,
    storageId ? { storageId } : "skip"
  );

  const imageUrl = getImageUrl;

  const isLoading = !imageUrl;

  return {
    imageUrl,
  };
};
