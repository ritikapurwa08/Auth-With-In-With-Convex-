import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Id } from "../../../convex/_generated/dataModel";
import UpdateSnippetModal from "./use-update-snippets-modal";
import RemoveSnippets from "./use-remove-snippet";
import { useCurrentUser } from "@/api/user";

export const fileTypes = [
  { label: "JavaScript", value: "javascript" },
  { label: "React", value: "react" },
  { label: "Next.js", value: "next_js" },
  { label: "TypeScript", value: "typescript" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
];

interface ProjectFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}

interface CodeBlockSmallProps {
  id: Id<"snippets">;
  userId: Id<"users">;
  projectName: string;
  projectImage?: string;
  projectFiles: ProjectFile[];
}

const CodeBlockSmall: React.FC<CodeBlockSmallProps> = ({
  projectName,
  id,
  userId,
  projectImage,
  projectFiles,
}) => {
  const [activeFile, setActiveFile] = useState(projectFiles[0]?.fileName || "");

  // Helper function to determine language for syntax highlighting
  const getLanguage = (fileType: string) => {
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      html: "html",
      css: "css",
      json: "json",
    };

    const extension = fileType.toLowerCase().replace(".", "");
    return languageMap[extension] || "text";
  };

  const { isLoading: userLoding, user: currentUser } = useCurrentUser();

  const isOwner = currentUser?._id === userId;

  return (
    <Card className="w-full  bg-white dark:bg-gray-800 shadow-lg">
      {/* Project Header */}
      <div className="p-4 flex justify-between w-full border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {projectName}
        </h3>
        {isOwner && (
          <div className="flex flex-row justify-center items-center w-full gap-x-2">
            <UpdateSnippetModal id={id} />
            <RemoveSnippets id={id} />
          </div>
        )}
      </div>

      {/* File Tabs and Code Display */}
      <CardContent className="p-0">
        <Tabs
          defaultValue={activeFile}
          value={activeFile}
          onValueChange={setActiveFile}
          className="w-full"
        >
          {/* File Tabs */}
          <div className="border-b dark:border-gray-700">
            <TabsList className="flex overflow-x-auto p-0 bg-gray-50 dark:bg-gray-900">
              {projectFiles.map((file) => (
                <TabsTrigger
                  key={file.fileName}
                  value={file.fileName}
                  className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  {file.fileName}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Code Content */}
          {projectFiles.map((file) => (
            <TabsContent
              key={file.fileName}
              value={file.fileName}
              className="m-0"
            >
              <div className="relative">
                <div className="absolute right-2 top-2 text-xs text-gray-500 dark:text-gray-400">
                  {file.fileType}
                </div>
                <SyntaxHighlighter
                  language="javascript"
                  style={dark}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0 0 0.5rem 0.5rem",
                    padding: "1.5rem",
                    fontSize: "0.9rem",
                    backgroundColor: "#eeeee",
                  }}
                  showLineNumbers
                  wrapLines
                  wrapLongLines
                >
                  {file.fileCode}
                </SyntaxHighlighter>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeBlockSmall;
