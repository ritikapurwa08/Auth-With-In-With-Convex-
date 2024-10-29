import React, { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import UpdateSnippetModal from "./use-update-snippets-modal";
import RemoveSnippets from "./use-remove-snippet";
import { useCurrentUser } from "@/api/user";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { SelectDemo } from "./file-selector";
import CopyCode from "./file-copy-code";

interface ProjectFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}
interface ProjectShowCaseProps {
  id: Id<"snippets">;
  userId: Id<"users">;
  projectName: string;
  projectImage?: string;
  projectFiles: ProjectFile[];
}

const ProjectShowCaseSmall = ({
  id,
  projectFiles,
  projectName,
  userId,
  projectImage,
}: ProjectShowCaseProps) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(
    projectFiles.length > 0 ? projectFiles[0] : null
  );
  const { isLoading: userLoading, user: currentUser } = useCurrentUser();

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file);
  };

  const isOwner = currentUser?._id === userId;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div id="project-name">
            <CardTitle className="text-sm truncate ">{projectName}</CardTitle>
          </div>
          <div id="project-options" className="flex flex-row gap-x-1">
            {isOwner && <UpdateSnippetModal id={id} />}
            {isOwner && <RemoveSnippets id={id} />}
            <SelectDemo
              projectFiles={projectFiles}
              onSelectFile={handleFileSelect}
            />
            {selectedFile && (
              <CopyCode
                code={selectedFile.fileCode}
                fileName={selectedFile.fileName}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div id="show-selected-file-code">
          <div className="relative w-full">
            <div className="custom-scrollbar overflow-auto max-h-40">
              <SyntaxHighlighter
                language={selectedFile?.fileType.toLowerCase() || "javascript"}
                style={atomOneDark}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  background: "rgb(40, 44, 52)",
                  borderRadius: "0.5rem",
                  fontSize: "0.675rem",
                }}
              >
                {selectedFile?.fileCode || ""}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectShowCaseSmall;
