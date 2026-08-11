import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    defaultLanguage: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    isDiscoverable: v.optional(v.boolean()),
    blockedUserIds: v.optional(v.array(v.string())),
    privacySettings: v.optional(
      v.object({
        allowUsernameDiscovery: v.boolean(),
        requireInviteLink: v.boolean(),
      })
    ),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  conversations: defineTable({
    participantName: v.string(),
    participantAvatar: v.optional(v.string()),
    preferredLanguage: v.string(),
    participantIds: v.array(v.string()),
    participantNames: v.array(v.string()),
    participantLanguages: v.string(),
    unreadCounts: v.string(),
    lastMessagePreview: v.optional(v.string()),
    lastMessageTime: v.optional(v.string()),
    pinned: v.boolean(),
    archived: v.boolean(),
    muted: v.optional(v.boolean()),
    isGroup: v.boolean(),
    inviteCode: v.optional(v.string()),
    inviteOpen: v.optional(v.boolean()),
    typingUserIds: v.optional(v.string()),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    senderName: v.string(),
    content: v.string(),
    translatedContent: v.optional(v.string()),
    originalLanguage: v.optional(v.string()),
    targetLanguage: v.optional(v.string()),
    type: v.string(),
    imageUrl: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    audioUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    transcript: v.optional(v.string()),
    translatedTranscript: v.optional(v.string()),
    replyToId: v.optional(v.string()),
    replyToContent: v.optional(v.string()),
    replyToSender: v.optional(v.string()),
    reactions: v.optional(v.string()),
    deleted: v.optional(v.boolean()),
    edited: v.optional(v.boolean()),
    expiresAt: v.optional(v.string()),
    readBy: v.optional(v.string()),
  }).index("by_conversation", ["conversationId"]),
});