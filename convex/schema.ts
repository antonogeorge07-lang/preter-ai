import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    fullName: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.string(),
    password: v.optional(v.string()),
    
    // Profiles & Audio Preferences
    defaultLanguage: v.string(),
    regionalAccent: v.optional(v.string()),
    autoPlayVoiceNotes: v.optional(v.boolean()),
    
    // Privacy Controls
    privacySettings: v.object({
      allowDiscoverability: v.optional(v.boolean()),
      storeAudioTranscripts: v.optional(v.boolean()),
      e2eEnabled: v.optional(v.boolean()),
    }),

    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  conversations: defineTable({
    participantIds: v.array(v.string()),
    title: v.optional(v.string()),
    isGroup: v.optional(v.boolean()),
    unreadCounts: v.optional(v.string()),
    pinnedUserIds: v.optional(v.string()),
    archivedUserIds: v.optional(v.string()),
    mutedUserIds: v.optional(v.string()),
    typingUserIds: v.optional(v.string()),
    updatedAt: v.number(),
  }),

  messages: defineTable({
    conversationId: v.union(v.id("conversations"), v.string()),
    senderId: v.string(),
    senderName: v.optional(v.string()),
    text: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.string()),
    originalLanguage: v.optional(v.string()),
    targetLanguage: v.optional(v.string()),
    translatedContent: v.optional(v.string()),
    mediaUrl: v.optional(v.string()),
    mediaType: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  }).index("by_conversation", ["conversationId"]),
});
