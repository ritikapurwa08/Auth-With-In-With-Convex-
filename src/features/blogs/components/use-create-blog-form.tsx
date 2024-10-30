import React, { useRef, useState } from "react";
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
import { Loader2, PlusCircle } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/features/global/form-provider/custom-input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CustomTextarea from "@/features/global/form-provider/custom-textarea";
import { toast } from "sonner";
import {
  blogSchemaZod,
  blogTypeZod,
  UseCreateBlog,
} from "../api/use-create-blog";
import { UseCurrentUser } from "@/api/user";
import ImageUpload from "@/features/upload/image-upload-form";
import { Id } from "../../../../convex/_generated/dataModel";

const CreateBlogForm = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

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

  const { user: currentUser } = UseCurrentUser();
  const { mutate: createBlog, isPending: creatingBlog } = UseCreateBlog();

  const handleSumbit = async (values: blogTypeZod) => {
    setError("");

    if (!currentUser?._id) {
      setError("User not authenticated");
      toast.error("Failed to create project: User not authenticated");
      return;
    }

    let imageId: Id<"_storage"> | undefined;
    if (imageUploadRef.current?.hasSelectedImage()) {
      imageId = await imageUploadRef.current.uploadSelectedImage();
    }

    createBlog(
      {
        userId: currentUser._id,
        title: values.title,
        description: values.description,
        image: imageId, // This will be undefined if no image was uploaded
      },
      {
        onSuccess(data) {
          // Reset both form and image state
          form.reset();
          imageUploadRef.current?.clearImage();
          setOpen(false);
          toast.success(`Project created successfully here is id ${data}`);
        },
        onError(error) {
          if (error instanceof Error) {
            setError(error.message);
            toast.error(`Failed to create project: ${error.message}`);
          } else {
            setError("An unknown error occurred");
            toast.error("Failed to create project: An unknown error occurred");
          }
        },
      }
    );
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
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <PlusCircle className="size-5 text-green-600" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSumbit)}
            className="space-y-6"
          >
            <Card>
              <CardContent className="space-y-4 py-4">
                <ImageUpload
                  ref={imageUploadRef}
                  onImageUpload={() => {}}
                  className="mb-4"
                />

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
              <Button type="submit" disabled={creatingBlog} className="gap-2">
                {creatingBlog && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogForm;
