import { Check, ChevronsUpDown } from "lucide-react";

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

interface FileSelectorProps {
  projectFiles: ProjectFile[];
  onSelectFile: (selectedFile: ProjectFile) => void;
}

import React, { useState } from "react";
import { Hint } from "@/components/ui/hint";
import { Button } from "@/components/ui/button";

const FileSelector = ({ onSelectFile, projectFiles }: FileSelectorProps) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(
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
};

export default FileSelector;
