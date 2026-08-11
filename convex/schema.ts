import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    defaultLanguage: v.optional(v.string()),
    isDiscoverable: v.optional(v.boolean()),
    privacySettings: v.optional(v.any()),
    resetToken: v.optional(v.string()),
    resetTokenExpires: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  conversations: defineTable({
    participantIds: v.array(v.string()),
    title: v.optional(v.string()),
    isGroup: v.optional(v.boolean()),
    unreadCounts: v.optional(v.string()),
    pinnedUserIds: v.optional(v.string()),
    archivedUserIds: v.optional(v.string()),
    mutedUserIds: v.optional(v.string()),
    typingUserIds: v.optional(v.string()),
  }),

  messages: defineTable({
    conversationId: v.string(),
    senderId: v.string(),
    senderName: v.optional(v.string()),
    content: v.string(),
    translatedContent: v.optional(v.string()),
    originalLanguage: v.optional(v.string()),
    targetLanguage: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    type: v.optional(v.string()),
  }).index("by_conversation", ["conversationId"]),
});
