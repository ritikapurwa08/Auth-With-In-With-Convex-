import React, { useEffect, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { useFieldArray, useForm } from "react-hook-form";
import { projectSchemaZod, ProjectTypeZod } from "@/api/use-create-snippets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetSnippet } from "@/api/use-get-snippet";
import { snippetFileTypes, useUpdateSnippets } from "@/api/use-update-snippet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, X, Plus, Edit2Icon } from "lucide-react";
import { Hint } from "@/components/ui/hint";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomInput from "@/features/global/form-provider/custom-input";
import { Card, CardContent } from "@/components/ui/card";
import CustomSelect from "@/features/global/form-provider/custom-select";
import CustomTextarea from "@/features/global/form-provider/custom-textarea";

interface UpdateSnippetsFormProps {
  id: Id<"snippets">;
}

const UpdateSnippetForm = ({ id }: UpdateSnippetsFormProps) => {
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

  const { data: currentSnippet } = useGetSnippet({ id });

  const { mutate: updateSnippet, isPending: updatingSnippets } =
    useUpdateSnippets();

  useEffect(() => {
    if (currentSnippet) {
      form.reset({
        projectName: currentSnippet.projectName,
        projectFiles: currentSnippet.projectFiles.map((file) => ({
          fileName: file.fileName,
          fileType: file.fileType,
          fileCode: file.fileCode,
        })),
      });
    }
  }, [currentSnippet, form]);

  const handleSubmit = async (values: ProjectTypeZod) => {
    setError("");

    updateSnippet(
      {
        id,
        projectName: values.projectName,
        projectFiles: values.projectFiles,
        projectImage: "",
      },
      {
        onSuccess(data) {
          toast({
            title: "Success!",
            description: `Project updated successfully here is id ${data}`,
          });
          form.reset();
          setOpen(false);
        },
        onError(error) {
          setError(`failed to update project ${error}`);
        },
        onSettled() {},
      }
    );
  };

  const handleCancel = () => {
    if (
      !form.formState.isDirty ||
      window.confirm(
        "Are  you sure you want to cancel? All unsaved changes will be lost"
      )
    ) {
      setOpen(false);
      form.reset();
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projectFiles",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Hint label="Update Snippets">
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="gap-2">
            <Edit2Icon className="size-5 text-blue-500 font-bold" />
          </Button>
        </DialogTrigger>
      </Hint>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Project
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
                        options={snippetFileTypes}
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
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatingSnippets}
                className="gap-2"
              >
                {updatingSnippets && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Update Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSnippetForm;
