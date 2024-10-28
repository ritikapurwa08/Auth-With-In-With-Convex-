import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, X, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../providers/custom-input";
import CustomSelect from "../providers/custom-select";
import CustomTextarea from "../providers/custom-textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

import {
  fileTypes,
  projectSchemaZod,
  ProjectTypeZod,
  useCreateSnippets,
} from "@/api/use-create-snippets";
import { useCurrentUser } from "@/api/user";
import { useToast } from "@/hooks/use-toast";

const CreateSnippetsModal = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();

  const form = useForm<ProjectTypeZod>({
    resolver: zodResolver(projectSchemaZod),
    defaultValues: {
      projectName: "",
      projectFiles: [
        {
          fileName: "",
          fileType: "",
          fileCode: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projectFiles",
  });

  const { mutate, isPending } = useCreateSnippets();
  const { user: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  const handleSubmit = async (values: ProjectTypeZod) => {
    setError("");

    mutate(
      {
        projectName: values.projectName,
        projectImage: "",
        projectFiles: values.projectFiles,
      },
      {
        onSuccess(data) {
          form.reset();
          setOpen(false);
          toast({
            title: "Success!",
            description: "Project created successfully",
            variant: "default",
          });
          form.reset();
          setOpen(false);
        },
        onError(error) {
          setError("failed to create project");
        },
        onSettled() {},
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <CustomInput
              control={form.control}
              name="projectName"
              label="Project Name"
              placeholder="Enter project name"
              className="w-full"
            />

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">File {index + 1}</h3>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <CustomInput
                        control={form.control}
                        name={`projectFiles.${index}.fileName`}
                        label="File Name"
                        placeholder="Enter file name"
                      />

                      <CustomSelect
                        control={form.control}
                        name={`projectFiles.${index}.fileType`}
                        label="File Type"
                        options={fileTypes}
                        placeholder="Select file type"
                      />
                    </div>

                    <CustomTextarea
                      control={form.control}
                      name={`projectFiles.${index}.fileCode`}
                      label="Code"
                      placeholder="Enter your code here"
                      className="min-h-[150px]"
                    />
                  </CardContent>
                </Card>
              ))}

              {fields.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() =>
                    append({
                      fileName: "",
                      fileType: "",
                      fileCode: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add Another File
                </Button>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (
                    !form.formState.isDirty ||
                    window.confirm(
                      "Are you sure you want to close? Any unsaved changes will be lost."
                    )
                  ) {
                    setOpen(false);
                    form.reset();
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || currentUserLoading}
                className="gap-2"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSnippetsModal;
