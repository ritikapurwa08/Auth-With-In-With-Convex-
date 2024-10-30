import { z } from "zod";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useCallback, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export type BlogConvexType = Doc<"blog">;

export type RequestType = {
  image?: Id<"_storage"> | undefined;
  title: string;
  description: string;
  userId: Id<"users">;
  updatedAt?: number;
};

export type ResponseType = Id<"blog"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const blogSchemaZod = z.object({
  title: z
    .string()
    .min(5, "blog title must be at least 5 character")
    .max(50, "blog title cannot exceed more than 50 character"),
  description: z
    .string()
    .min(40, "words cannot be less then 40 character")
    .max(1000, "words cannot be more than 1000 words"),
});

export type blogTypeZod = z.infer<typeof blogSchemaZod>;

export const UseCreateBlog = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.blog.create);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
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
    },
    [mutation]
  );

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
