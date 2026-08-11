import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all active conversations for a specific user
export const getUserConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("conversations").collect();
    return all.filter((c) => c.participantIds.includes(args.userId));
  },
});

// Create a new 1:1 or group conversation
export const createConversation = mutation({
  args: {
    participantName: v.string(),
    participantAvatar: v.optional(v.string()),
    preferredLanguage: v.string(),
    participantIds: v.array(v.string()),
    participantNames: v.array(v.string()),
    participantLanguages: v.string(), // JSON string map { userId: lang }
    inviteCode: v.optional(v.string()),
    isGroup: v.boolean(),
  },
  handler: async (ctx, args) => {
    const conversationId = await ctx.db.insert("conversations", {
      ...args,
      unreadCounts: "{}",
      pinned: false,
      archived: false,
      muted: false,
      inviteOpen: !!args.inviteCode,
    });
    return conversationId;
  },
});

// Toggle conversation state (pin, archive, mute)
export const updateConversationState = mutation({
  args: {
    conversationId: v.id("conversations"),
    pinned: v.optional(v.boolean()),
    archived: v.optional(v.boolean()),
    muted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { conversationId, ...updates } = args;
    await ctx.db.patch(conversationId, updates);
  },
});

// Update typing status for a participant
export const setTypingStatus = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    if (!conv) return;

    let typingIds: string[] = [];
    try {
      typingIds = JSON.parse(conv.typingUserIds || "[]");
    } catch {
      typingIds = [];
    }

    const alreadyIn = typingIds.includes(args.userId);
    if (args.isTyping && !alreadyIn) {
      typingIds.push(args.userId);
    } else if (!args.isTyping && alreadyIn) {
      typingIds = typingIds.filter((id) => id !== args.userId);
    }

    await ctx.db.patch(args.conversationId, {
      typingUserIds: JSON.stringify(typingIds),
    });
  },
});
