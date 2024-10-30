import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const BlogCardLoading = () => {
  return (
    <div>
      <Skeleton className="h-60" />

      <div>
        <h2>
          <Skeleton className="h-60" />
        </h2>
      </div>
    </div>
  );
};

export default BlogCardLoading;
