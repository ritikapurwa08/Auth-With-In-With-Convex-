import React from "react";
import { BlogConvexType } from "../api/use-create-blog";
import Image from "next/image";
import { format } from "date-fns";
import { GetUserById } from "@/api/use-get-user-by-id";
import { UseCurrentUser } from "@/api/user";
import UpdateBlogForm from "./use-update-blog-form";
import RemoveBlogDialog from "./use-remove-blog-dialog";
import { UseGetImageUrl } from "@/api/get-image-url";
import { toast } from "sonner";
import { RemoveBlogImage } from "../api/use-remove-image";
import { Button } from "@/components/ui/button";
import { Loader, Trash2Icon } from "lucide-react";
import { Hint } from "@/components/ui/hint";

const BlogCard = ({
  _creationTime,
  _id,
  description,
  title,
  userId,
  image,
  updatedAt,
}: BlogConvexType) => {
  const { data: user, isLoading: userLoading } = GetUserById({ id: userId });
  const { user: currentUser } = UseCurrentUser();
  const isOwner = currentUser?._id === userId;

  const { imageUrl } = UseGetImageUrl({ storageId: image });
  const { mutate: removeImage, isPending: RemovingImage } = RemoveBlogImage();

  const handleImageDelete = () => {
    removeImage(
      {
        blogId: _id,
        storageId: image,
      },
      {
        onSuccess: () => {
          toast.success("Image removed successfully");
        },
        onError: (error) => {
          toast.error(`failed to remove image ${error} `);
        },
      }
    );
  };

  return (
    <div className="prose prose-sm sm:prose  lg:prose-lg max-w-none border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {imageUrl && image && (
        <div className="h-80 overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 text-xs">{description}</p>
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div>
            {!userLoading && user && (
              <span className="font-medium text-gray-700">By: {user.name}</span>
            )}
            <span>
              {updatedAt
                ? `Last edited: ${format(new Date(updatedAt), "PP")}`
                : "Edited"}
            </span>
          </div>
          <span>Created on: {format(new Date(_creationTime), "PP")}</span>
        </div>
        {isOwner && (
          <div className="flex gap-2 mt-4">
            <UpdateBlogForm id={_id} />
            <RemoveBlogDialog id={_id} />
          </div>
        )}
        {imageUrl && image && (
          <Hint side="right" label="remove image">
            <div className="absolute top-2 right-2">
              <Button
                onClick={handleImageDelete}
                variant="outline"
                size="icon"
                className="bg-white hover:bg-gray-100 transition-colors duration-300"
              >
                {RemovingImage ? (
                  <Loader className="animate-spin size-3.5 text-muted-foreground" />
                ) : (
                  <Trash2Icon className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </Hint>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
