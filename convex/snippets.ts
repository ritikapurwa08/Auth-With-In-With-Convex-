import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";

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
      throw new ConvexError(`Failed to delete project:${error}`);
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
      throw new ConvexError(`Failed to delete orphaned image:${error}`);
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

export const getPaginatedSnippets = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Query snippets with pagination
    const results = await ctx.db
      .query("snippets")
      .order("desc")
      .paginate(args.paginationOpts);

    // Process and return results
    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (snippet) => {
          const formattedDate = new Date(
            snippet._creationTime
          ).toLocaleDateString();
          // Add any additional processing here if needed
          return {
            ...snippet,
            formattedDate,
          };
        })
      ),
    };
  },
});

export const getOwnPaginatedSnippets = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Query snippets with pagination
    const results = await ctx.db
      .query("snippets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    // Process and return results
    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (snippet) => {
          // Add any additional processing here if needed
          return {
            ...snippet,
            formattedDate: new Date(snippet._creationTime).toLocaleDateString(),
          };
        })
      ),
    };
  },
});

export const getSnippetsBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("snippets").order("desc").collect();
    }
    const authorSearch = await ctx.db
      .query("snippets")
      .withSearchIndex("search_author", (q) => q.search("userId", args.search))

      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("snippets")
      .withSearchIndex("search_title", (q) =>
        q.search("projectName", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    const searchBody = await ctx.db
      .query("snippets")
      .withSearchIndex("search_files", (q) =>
        q.search("projectFiles", args.search)
      )
      .take(10);

    if (searchBody.length > 0) {
      return searchBody;
    }
  },
});
