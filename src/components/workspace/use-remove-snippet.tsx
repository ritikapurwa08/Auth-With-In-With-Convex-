import React, { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useRemoveSnippets } from "@/api/use-remove-snippets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Hint } from "../ui/hint";

interface RemoveSnippetsProps {
  id: Id<"snippets">;
}

const RemoveSnippets = ({ id }: RemoveSnippetsProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: remove, isPending: removingSnippets } = useRemoveSnippets();

  const handleRemove = () => {
    remove(
      { id },
      {
        onError(error) {
          // You could add toast notifications here
          console.error("Failed to remove snippet:", error);
        },
        onSuccess() {
          setOpen(false);
          toast({
            title: "Snippet removed",
            description: "Snippet has been removed successfully",
          });
          // You could add success toast notification here
        },
        onSettled() {
          // Clean up or additional logic after success/error
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Hint label="Remove Snippets">
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Trash2 className="size-5 text-red-500 " />
          </Button>
        </AlertDialogTrigger>
      </Hint>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Snippet</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this snippet? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={removingSnippets}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={removingSnippets}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {removingSnippets ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveSnippets;
