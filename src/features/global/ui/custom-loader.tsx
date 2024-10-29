import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

import React from "react";

interface CustomLoaderProps {
  title?: string;
}

const CustomLoader = ({ title }: CustomLoaderProps) => {
  return (
    <span className="flex flex-row items-center justify-center gap-x-2">
      <span className="animate-spin flex justify-center items-center">
        <Loader className="size-5" />
      </span>

      {title && <span className={cn("text-gray-300")}>{title}</span>}
    </span>
  );
};

export default CustomLoader;
