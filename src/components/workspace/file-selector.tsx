// SelectDemo.tsx
import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Hint } from "../ui/hint";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}

interface SelectDemoProps {
  projectFiles: ProjectFile[];
  onSelectFile: (selectedFile: ProjectFile) => void;
}

export function SelectDemo({ projectFiles, onSelectFile }: SelectDemoProps) {
  const [selectedFile, setSelectedFile] = React.useState<ProjectFile | null>(
    projectFiles.length > 0 ? projectFiles[0] : null
  );
  const [open, setOpen] = React.useState(false);

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file);
    onSelectFile(file); // Pass selected file to the parent
    setOpen(false); // Close dropdown after selection
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Hint label="Select a file">
        <DropdownMenuTrigger
          className="size-9 flex justify-center items-center"
          asChild
        >
          <Button onClick={() => setOpen(!open)} variant="outline" size="icon">
            <ChevronsUpDown className="" />
          </Button>
        </DropdownMenuTrigger>
      </Hint>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-[200px] p-2 rounded-md shadow-lg"
      >
        <DropdownMenuLabel className="font-semibold">Files</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projectFiles.map((file) => (
          <DropdownMenuItem
            key={file.fileName}
            onClick={() => handleFileSelect(file)}
            className="flex items-center  space-x-2 cursor-pointer"
          >
            {selectedFile?.fileName === file.fileName && (
              <Check className="text-green-500" aria-hidden="true" />
            )}
            <span className={cn("", selectedFile?.fileName && "ml-8")}>
              {file.fileName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
