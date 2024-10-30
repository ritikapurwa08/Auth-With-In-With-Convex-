"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseGetAllBlogs } from "@/features/blogs/api/use-get-all-blogs";
import BlogCard from "@/features/blogs/components/blog-card";
import CreateBlogForm from "@/features/blogs/components/use-create-blog-form";
import SnippetSkeleton from "@/features/snippets/ui/snippets-loading-card";
import { FilterIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  const { data: blogs, isLoading: blogsLoading } = UseGetAllBlogs();

  const LoadingBlog = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SnippetSkeleton key={`blog-${index}`} />
        ))}
      </div>
    );
  };

  const BlogGrid = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs?.map((blog) => <BlogCard key={blog._id} {...blog} />)}
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 pt-8 pb-20">
      <div className="h-full w-full items-center justify-center">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">Blogs</h1>

          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search blogs..."
              className="max-w-sm"
            />
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/snippets/my-snippets">Your Blogs</Link>
            </Button>
            <CreateBlogForm />
          </div>
        </div>
        <div className="py-6 container mx-auto">
          {blogsLoading ? <LoadingBlog /> : <BlogGrid />}
        </div>
      </div>
    </main>
  );
};

export default page;
