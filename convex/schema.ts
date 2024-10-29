import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  courses: defineTable({
    name: v.string(),
    price: v.number(),
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
  }).index("by_user", ["userId"]),
});

export default schema;
