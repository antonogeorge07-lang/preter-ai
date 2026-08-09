import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listMessages = query({
  args: { conversation_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversation_id", args.conversation_id))
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    conversation_id: v.string(),
    sender_id: v.string(),
    sender_name: v.optional(v.string()),
    content: v.optional(v.string()),
    translated_content: v.optional(v.string()),
    type: v.optional(v.string()),
    image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
    });
  },
});
