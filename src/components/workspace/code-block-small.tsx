import React, { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useCurrentUser } from "@/api/user";
import { Button } from "../ui/button";
import { ChevronRight, Pencil, FileCode, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Hint } from "../ui/hint";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface ProjectFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}

interface ShowCodeSmallProps {
  id: Id<"snippets">;
  userId: Id<"users">;
  projectName: string;
  projectImage?: string;
  projectFiles: ProjectFile[];
}

const CodeView = ({
  projectFiles,
  selectedFile,
}: {
  projectFiles: ProjectFile[];
  selectedFile: string;
}) => {
  const selectedFileData = projectFiles.find(
    (file) => file.fileName === selectedFile
  );

  return (
    <div className="relative w-full">
      <div className="custom-scrollbar overflow-auto max-h-40">
        <SyntaxHighlighter
          language={selectedFileData?.fileType.toLowerCase() || "javascript"}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "rgb(40, 44, 52)",
            borderRadius: "0.5rem",
            fontSize: "0.675rem",
          }}
        >
          {selectedFileData?.fileCode || ""}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const FileSelector = ({
  projectFiles,
  selectedFile,
  onSelectFile,
}: {
  projectFiles: ProjectFile[];
  selectedFile: string;
  onSelectFile: (fileName: string) => void;
}) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar-x pb-2">
      {projectFiles.map((file) => (
        <Button
          key={file.fileName}
          variant={selectedFile === file.fileName ? "secondary" : "outline"}
          size="sm"
          className="flex items-center gap-2 shrink-0"
          onClick={() => onSelectFile(file.fileName)}
        >
          <FileCode className="h-4 w-4" />
          <span>{file.fileName}</span>
          {selectedFile === file.fileName && (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ))}
    </div>
  );
};

const ShowCodeSmall = ({
  id,
  projectFiles,
  projectName,
  userId,
  projectImage,
}: ShowCodeSmallProps) => {
  const { isLoading: userLoading, user: currentUser } = useCurrentUser();
  const [selectedFile, setSelectedFile] = useState(
    projectFiles[0]?.fileName || ""
  );

  const isOwner = currentUser?._id === userId;

  return (
    <Card className="w-full h-96 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{projectName}</CardTitle>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Hint label="Edit Project">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </Hint>
            <Hint label="Delete Project">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </Hint>
            <Hint label="Select File"></Hint>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <FileSelector
          projectFiles={projectFiles}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
        />
        <div className="flex-1 min-h-0">
          <CodeView projectFiles={projectFiles} selectedFile={selectedFile} />
        </div>
      </CardContent>
    </Card>
  );
};

// Add this CSS to your global styles
const styles = `
  
`;

export default ShowCodeSmall;
