import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    image: v.optional(v.id("_storage")),
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a blog post.");
    }
    const blogId = await ctx.db.insert("blog", {
      image: args.image,
      description: args.description,
      title: args.title,
      userId: userId,
    });

    return blogId;
  },
});

export const update = mutation({
  args: {
    id: v.id("blog"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a blog post.");
    }

    const blog = await ctx.db.get(args.id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.userId !== userId) {
      throw new ConvexError(
        "You do not have permission to update this blog post."
      );
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("blog"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in to create a blog post.");
    }

    const blog = await ctx.db.get(args.id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.image) {
      await ctx.storage.delete(blog.image);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const getById = query({
  args: { id: v.id("blog") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in to create a blog post.");
    }
    const blog = await ctx.db.get(args.id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog;
  },
});

export const getAllBlogs = query({
  handler: async (ctx) => {
    const results = await ctx.db.query("blog").order("desc").collect();

    return results;
  },
});

export const RemoveBlogImage = mutation({
  args: {
    blogId: v.id("blog"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in to create a blog post.");
    }
    const blog = await ctx.db.get(args.blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.image) {
      await ctx.storage.delete(blog.image);
    }

    await ctx.db.patch(args.blogId, {
      image: undefined,
    });

    return args.blogId;
  },
});
