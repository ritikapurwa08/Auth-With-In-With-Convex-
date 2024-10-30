import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/features/global/form-provider/custom-input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CustomTextarea from "@/features/global/form-provider/custom-textarea";
import { toast } from "sonner";
import { blogSchemaZod, blogTypeZod } from "../api/use-create-blog";
import { UseCurrentUser } from "@/api/user";
import ImageUpload from "@/features/upload/image-upload-form";
import { Id } from "../../../../convex/_generated/dataModel";
import { GetBlogById } from "../api/use-get-blog-by-id";

import Image from "next/image";
import { Hint } from "@/components/ui/hint";
import { UseUpdateBlog } from "../api/use-update-blog";
import { UseGetImageUrl } from "@/api/get-image-url";

interface UpdateBlogFormProps {
  id: Id<"blog">;
}

const UpdateBlogForm = ({ id }: UpdateBlogFormProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const { user: currentUser } = UseCurrentUser();
  const { mutate: updateBlog, isPending: updatingBlog } = UseUpdateBlog();
  const { data: currentBlog, isLoading: currentBlogLoading } = GetBlogById({
    id,
  });

  const { imageUrl } = UseGetImageUrl({ storageId: currentBlog?.image });

  const imageUploadRef = useRef<{
    uploadSelectedImage: () => Promise<Id<"_storage"> | undefined>;
    hasSelectedImage: () => boolean;
    clearImage: () => void;
  }>(null);

  const form = useForm<blogTypeZod>({
    resolver: zodResolver(blogSchemaZod),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (currentBlog) {
      form.reset({
        title: currentBlog.title,
        description: currentBlog.description,
      });
    }
  }, [currentBlog, form]);

  const handleSumbit = async (values: blogTypeZod) => {
    setError("");

    if (currentUser?._id) {
      updateBlog(
        {
          id,
          title: values.title,
          description: values.description,

          // Only include image if there's an update or new upload
        },
        {
          onSuccess: (data) => {
            form.reset();
            imageUploadRef.current?.clearImage();
            setOpen(false);
            toast.success(`Project updated successfully, ID: ${data}`);
          },
          onError: (error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An unknown error occurred";
            setError(errorMessage);
            toast.error(`Failed to update project: ${errorMessage}`);
          },
        }
      );
    }
  };

  const handleClose = () => {
    if (
      !form.formState.isDirty || // Also check if there's no image
      window.confirm(
        "Are you sure you want to close? Any unsaved changes will be lost."
      )
    ) {
      setOpen(false);
      form.reset();
      imageUploadRef.current?.clearImage(); // Reset image state when closing
      setError(""); // Clear any errors
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Hint label="update blog">
        <DialogTrigger disabled={currentBlogLoading} asChild>
          <Button variant="outline" size="icon" className="gap-2">
            <Edit2 className="size-5 text-blue-600" />
          </Button>
        </DialogTrigger>
      </Hint>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSumbit)}
            className="space-y-6 flex flex-col"
          >
            {imageUrl ? (
              <div className="flex flex-col gap-2">
                <Image
                  src={imageUrl}
                  alt="ic"
                  className="w-full h-40 overflow-hidden object-cover"
                  height={400}
                  width={400}
                />
              </div>
            ) : (
              <ImageUpload
                ref={imageUploadRef}
                onImageUpload={() => {}}
                className="mb-4"
              />
            )}
            <Card>
              <CardContent className="space-y-4 py-4">
                {currentBlog?.image ? "yes" : "no"}
                <CustomInput
                  control={form.control}
                  name="title"
                  label="Project Name"
                  placeholder="Enter project name"
                  className="w-full"
                />

                <CustomTextarea
                  control={form.control}
                  name="description"
                  label="Code"
                  placeholder="Enter your code here"
                  className="min-h-[150px]"
                />
              </CardContent>
              {error && <CardFooter>{error}</CardFooter>}
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatingBlog} className="gap-2">
                {updatingBlog && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBlogForm;
