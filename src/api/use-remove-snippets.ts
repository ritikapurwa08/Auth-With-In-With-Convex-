import { useCallback, useMemo, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileCode: z.string().min(1, "Code is required"),
});

export const projectSchemaZod = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectFiles: z
    .array(fileSchema)
    .min(1, "At least one file is required")
    .max(4, "Maximum 4 files allowed"),
});

export type ProjectTypeZod = z.infer<typeof projectSchemaZod>;

type RequestType = {
  id: Id<"snippets">;
};

type ResponseType = Id<"snippets"> | null;

type Options = {
  onSuccess: (data: ResponseType) => void;
  onError: (error: Error) => void;
  onSettled: () => void;
  throwError?: boolean;
};

export const useRemoveSnippets = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.snippets.remove);

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
        setStatus("error");
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
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
  };
};
