import { Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateSnippetForm from "../form/update-snippets-form";
import RemoveSnippetDialog from "../form/remove-snippet-dialog";
import { useCurrentUser } from "@/api/user";
import { useState } from "react";
import FileSelector from "@/features/global/file-selector";
import CopyCode from "@/features/global/copy-code";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
interface SnippetFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}
interface SnippetCardProps {
  id: Id<"snippets">;
  userId: Id<"users">;
  projectName: string;
  projectImage?: string;
  projectFiles: SnippetFile[];
}

const SnippetCard = ({
  id,
  projectFiles,
  projectName,
  userId,
}: SnippetCardProps) => {
  const [selectedFile, setSelectedFile] = useState<SnippetFile | null>(
    projectFiles.length > 0 ? projectFiles[0] : null
  );
  const { user: currentUser } = useCurrentUser();

  const isOwner = currentUser?._id === userId;
  const handleFileSelect = (file: SnippetFile) => {
    setSelectedFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div id="project-name">
            <CardTitle className="text-sm lg:max-w-48 truncate max-w-40 ">
              {projectName}
            </CardTitle>
          </div>
          <div id="project-options" className="flex flex-row gap-x-1">
            {isOwner && <UpdateSnippetForm id={id} />}
            {isOwner && <RemoveSnippetDialog id={id} />}
            <FileSelector
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

export default SnippetCard;
