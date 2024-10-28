import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

export const create = mutation({
  args: {
    projectName: v.string(),
    projectImage: v.optional(v.string()),
    projectFiles: v.array(
      v.object({
        fileName: v.string(),
        fileType: v.string(),
        fileCode: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("You must be logged in to create a project");
    }

    const snippetsId = await ctx.db.insert("snippets", {
      userId: userId,
      projectImage: args.projectImage,
      projectFiles: args.projectFiles,
      projectName: args.projectName,
    });

    return snippetsId;
  },
});

export const update = mutation({
  args: {
    id: v.id("snippets"),
    projectName: v.string(),
    projectImage: v.optional(v.string()),
    projectFiles: v.array(
      v.object({
        fileName: v.string(),
        fileType: v.string(),
        fileCode: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Authentication required");
    }

    const existingSnippet = await ctx.db.get(args.id);

    if (!existingSnippet) {
      throw new ConvexError("Project not found");
    }

    if (existingSnippet.userId !== userId) {
      throw new ConvexError("You don't have permission to modify this project");
    }

    await ctx.db.patch(args.id, {
      projectName: args.projectName,
      projectImage: args.projectImage,
      projectFiles: args.projectFiles,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("snippets"),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Authentication required");
    }

    // Fetch the snippet
    const existingSnippet = await ctx.db.get(args.id);

    if (!existingSnippet) {
      throw new ConvexError("Project not found");
    }

    // Verify ownership
    if (existingSnippet.userId !== userId) {
      throw new ConvexError("You don't have permission to delete this project");
    }

    try {
      // If there's an image, delete it from storage
      if (existingSnippet.projectImage) {
        try {
          // Delete the image file from storage
          await ctx.storage.delete(existingSnippet.projectImage);
        } catch (storageError) {
          // Log the error but don't block the snippet deletion
          console.error("Failed to delete project image:", storageError);
        }
      }

      // Delete the snippet from the database
      await ctx.db.delete(args.id);
    } catch (error) {
      throw new ConvexError(`Failed to delete project:`);
    }

    return args.id;
  },
});

export const getById = query({
  args: {
    id: v.id("snippets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Authentication required");
    }

    return await ctx.db.get(args.id);
  },
});

// Helper mutation to clean up orphaned images if needed
export const cleanupOrphanedImage = mutation({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Authentication required");
    }

    try {
      await ctx.storage.delete(args.imageId);
      return {
        success: true,
        message: "Orphaned image deleted successfully",
      };
    } catch (error) {
      throw new ConvexError(`Failed to delete orphaned image: `);
    }
  },
});

export const getMemberSnippets = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const snippets = await ctx.db
      .query("snippets")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return snippets;
  },
});

export const getAllSnippets = query({
  handler: async (ctx) => {
    const snippets = await ctx.db.query("snippets").collect();

    return snippets;
  },
});
