import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface ProjectFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}

interface CodeBlockProps {
  projectFiles: ProjectFile[];
  onSelectFile: (file: string) => void;
}

const CodeBlock = ({ projectFiles }: CodeBlockProps) => {
  const [selectedFile, setSelectedFile] = useState(
    projectFiles[0].fileName || ""
  );
  return (
    <div className="min-w-full">
      <Select value={selectedFile} onValueChange={setSelectedFile}>
        <SelectTrigger className="min-w-full">
          <SelectValue placeholder="Select a file" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Files</SelectLabel>
            {projectFiles.map((file) => (
              <SelectItem
                key={file.fileName}
                value={file.fileName}
                className="flex items-center"
              >
                {file.fileName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CodeBlock;
