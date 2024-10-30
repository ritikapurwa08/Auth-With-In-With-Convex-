import { useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";

type RequestType = {
  blogId: Id<"blog">;
  storageId: Id<"_storage"> | undefined;
};

type ResponseType = Id<"blog"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const RemoveBlogImage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.blog.RemoveBlogImage);

  const mutate = useCallback(async (values: RequestType, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setStatus("pending");

      const response = await mutation(values);
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      options?.onError?.(error as Error);
      if (options?.throwError) {
        throw error;
      }
    } finally {
      setStatus("settled");
      options?.onSettled?.();
    }
  }, []);

  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
    mutate,
  };
};
