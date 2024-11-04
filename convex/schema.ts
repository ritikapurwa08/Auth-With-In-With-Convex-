import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  blog: defineTable({
    image: v.optional(v.id("_storage")),
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    updatedAt: v.optional(v.number()),
  }),
  reactions: defineTable({
    blogId: v.id("blog"),
    userId: v.id("users"),
    value: v.string(),
  }),

  snippets: defineTable({
    userId: v.id("users"),
    projectName: v.string(),
    projectImage: v.optional(v.string()),
    projectFiles: v.array(
      v.object({
        fileName: v.string(),
        fileType: v.string(),
        fileCode: v.string(),
      })
    ),
  })
    .index("by_user", ["userId"])
    .searchIndex("search_author", { searchField: "userId" })
    .searchIndex("search_files", { searchField: "projectFiles" })
    .searchIndex("search_title", { searchField: "projectName" }),
});

export default schema;
