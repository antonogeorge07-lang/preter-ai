import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.optional(v.string()),
    name: v.optional(v.string()),
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    defaultLanguage: v.optional(v.string()),
    isDiscoverable: v.optional(v.boolean()),
    privacySettings: v.optional(v.any()),
    createdAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  conversations: defineTable({
    participantIds: v.array(v.string()),
    title: v.optional(v.string()),
    isGroup: v.optional(v.boolean()),
    pinnedUserIds: v.optional(v.string()),
    archivedUserIds: v.optional(v.string()),
    mutedUserIds: v.optional(v.string()),
    typingUserIds: v.optional(v.string()),
    unreadCounts: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  }),

  messages: defineTable({
    conversationId: v.union(v.id("conversations"), v.string()),
    senderId: v.string(),
    text: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.string()),
    senderName: v.optional(v.string()),
    translatedContent: v.optional(v.string()),
    originalLanguage: v.optional(v.string()),
    targetLanguage: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }).index("by_conversation", ["conversationId"]),
});
