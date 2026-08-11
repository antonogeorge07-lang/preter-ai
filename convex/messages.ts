import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listMessages = query({
  args: { conversationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", { ...args });
  },
});
