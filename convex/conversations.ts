import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("conversations").collect();
    return all.filter((c) => c.participantIds.includes(args.userId));
  },
});

export const create = mutation({
  args: {
    participantIds: v.array(v.string()),
    title: v.optional(v.string()),
    isGroup: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      participantIds: args.participantIds,
      title: args.title,
      isGroup: args.isGroup,
      unreadCounts: "{}",
      pinnedUserIds: "[]",
      archivedUserIds: "[]",
      mutedUserIds: "[]",
      typingUserIds: "[]",
    });
  },
});

export const toggleState = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
    action: v.string(), // "pin" | "archive" | "mute"
  },
  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    if (!conv) return;

    let fieldKey: "pinnedUserIds" | "archivedUserIds" | "mutedUserIds" = "pinnedUserIds";
    if (args.action === "archive") fieldKey = "archivedUserIds";
    if (args.action === "mute") fieldKey = "mutedUserIds";

    const currentList: string[] = JSON.parse(conv[fieldKey] || "[]");
    const updatedList = currentList.includes(args.userId)
      ? currentList.filter((id) => id !== args.userId)
      : [...currentList, args.userId];

    await ctx.db.patch(args.conversationId, {
      [fieldKey]: JSON.stringify(updatedList),
    });
  },
});

export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    if (!conv) return;

    let typingIds: string[] = JSON.parse(conv.typingUserIds || "[]");
    if (args.isTyping) {
      if (!typingIds.includes(args.userId)) typingIds.push(args.userId);
    } else {
      typingIds = typingIds.filter((id) => id !== args.userId);
    }

    await ctx.db.patch(args.conversationId, {
      typingUserIds: JSON.stringify(typingIds),
    });
  },
});
