import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  courses: defineTable({
    name: v.string(),
    price: v.number(),
  }),

  //
  //  workspace schema
  //
  // workspaces: defineTable({
  //     name: v.string(),
  //     joinCode: v.string(),
  //     userId: v.id("users"),
  // }),
  // members: defineTable({
  //     userId: v.id("users"),
  //     workspaceId: v.id("workspaces"),
  //     role: v.union(v.literal("admin"), v.literal("member")),
  // })
  //     .index("by_user_id", ["userId"])
  //     .index("by_workspace_id", ["workspaceId"])
  //     .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  // channels: defineTable({
  //     name: v.string(),
  //     workspaceId: v.id("workspaces"),
  // }).index("by_workspace_id", ["workspaceId"]),
  // conversations: defineTable({
  //     workspaceId: v.id("workspaces"),
  //     memberOneId: v.id("members"),
  //     memberTwoId: v.id("members"),
  // }).index("by_workspace_id", ["workspaceId"]),
  // messages: defineTable({
  //     body: v.string(),
  //     image: v.optional(v.id("_storage")),
  //     memberId: v.id("members"),
  //     workspaceId: v.id("workspaces"),
  //     channelId: v.optional(v.id("channels")),
  //     parentMessageId: v.optional(v.id("messages")),
  //     conversationId: v.optional(v.id("conversations")),
  //     updatedAt: v.optional(v.number()),
  // })
  //     .index("by_workspacedId", ["workspaceId"])
  //     .index("by_parentMessageId", ["parentMessageId"])
  //     .index("by_member_id", ["memberId"])
  //     .index("by_conversationId", ["conversationId"])
  //     .index("by_channelId_byParentMessageId_byConversationId", [
  //         "channelId",
  //         "parentMessageId",
  //         "conversationId",
  //     ]),
  // reactions: defineTable({
  //     workspaceId: v.id("workspaces"),
  //     messageId: v.id("messages"),
  //     memberId: v.id("members"),
  //     value: v.string(),
  // })
  //     .index("by_workspace_id", ["workspaceId"])
  //     .index("by_message_id", ["messageId"])
  //     .index("by_member_id", ["memberId"]),
});

export default schema;
