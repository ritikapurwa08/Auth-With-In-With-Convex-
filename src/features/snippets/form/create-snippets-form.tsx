import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, PlusCircle, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/features/global/form-provider/custom-input";
import { Card, CardContent } from "@/components/ui/card";
import CustomSelect from "@/features/global/form-provider/custom-select";
import CustomTextarea from "@/features/global/form-provider/custom-textarea";
import {
  fileTypes,
  projectSchemaZod,
  ProjectTypeZod,
  useCreateSnippets,
} from "@/api/use-create-snippets";
import { toast } from "sonner";

const CreateSnippetForm = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

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

  const { mutate: createSnippets, isPending: creatingSnippets } =
    useCreateSnippets();

  const handleSumbit = async (values: ProjectTypeZod) => {
    setError("");

    createSnippets(
      {
        projectName: values.projectName,
        projectFiles: values.projectFiles,
        projectImage: "",
      },
      {
        onSuccess(data) {
          form.reset();
          setOpen(false);

          toast.success(`Project created successfully here is id ${data}`);
        },
        onError() {
          setError(error);
          toast.success(`Failed to create project ${error}`);

          setOpen(true);
        },
        onSettled() {},
      }
    );
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
                      <h1 className="font-bold text-lg">File {index + 1}</h1>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="size-5 text-red-600" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full bg-green-600/80 gap-2"
                  size="lg"
                  onClick={() =>
                    append({
                      fileName: "",
                      fileType: "",
                      fileCode: "",
                    })
                  }
                >
                  <Plus className="size-5 " />
                  Add Another File
                </Button>
              )}
            </div>
            <DialogFooter>
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
                disabled={creatingSnippets}
                className="gap-2"
              >
                {creatingSnippets && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSnippetForm;
