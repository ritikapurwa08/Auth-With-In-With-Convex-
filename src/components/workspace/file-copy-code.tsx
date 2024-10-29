import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToast } from "@/hooks/use-toast";
import { Hint } from "../ui/hint";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

const CopyCode = ({ code, fileName }: { code: string; fileName: string }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!code) return;

    setCopied(true);
    toast({
      title: "Code Copied",
      description: `${fileName} code has been copied to clipboard.`,
      duration: 2000,
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Hint label={`copy ${fileName} code`}>
      <div className="relative inline-block">
        <CopyToClipboard text={code || ""} onCopy={handleCopy}>
          <Button
            variant="outline"
            size="icon"
            className="transition-all duration-200"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground hover:text-primary" />
            )}
          </Button>
        </CopyToClipboard>
      </div>
    </Hint>
  );
};

export default CopyCode;
