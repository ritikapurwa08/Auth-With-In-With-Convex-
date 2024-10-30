import React, { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useGenerateUploadUrl } from "./use-generate-upload-url";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Id } from "../../../convex/_generated/dataModel";

interface ImageUploadProps {
  onImageUpload: (storageId: Id<"_storage"> | undefined) => void;
  className?: string;
}

const ImageUpload = React.forwardRef<
  {
    uploadSelectedImage: () => Promise<Id<"_storage"> | undefined>;
    hasSelectedImage: () => boolean;
    clearImage: () => void;
  },
  ImageUploadProps
>(({ onImageUpload, className = "" }, ref) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const uploadImage = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);

        // Generate upload URL
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Failed to generate upload URL");

        // Upload the image
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();
        onImageUpload(storageId);
        return storageId;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl, onImageUpload]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Only create preview and store the file
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setSelectedFile(file);
        // Don't upload yet - just notify parent that a file is selected
        onImageUpload(undefined);
      }
    },
    [onImageUpload]
  );

  const clearImage = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
    onImageUpload(undefined);
  }, [onImageUpload]);

  // Expose the upload function to parent
  React.useImperativeHandle(
    ref,
    () => ({
      uploadSelectedImage: async () => {
        if (selectedFile) {
          return await uploadImage(selectedFile);
        }
        return undefined;
      },
      hasSelectedImage: () => !!selectedFile,
      clearImage,
    }),
    [selectedFile, uploadImage, clearImage]
  );

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
        disabled={isUploading}
      />

      {!preview ? (
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-12 h-12 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </label>
      ) : (
        <div className="relative w-full h-64">
          <Image
            height={400}
            width={256}
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            onClick={clearImage}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="text-white flex items-center gap-2">
            <Upload className="animate-bounce" />
            Uploading...
          </div>
        </div>
      )}
    </div>
  );
});

ImageUpload.displayName = "ImageUpload";
export default ImageUpload;
