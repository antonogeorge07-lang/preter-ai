import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();
  },
});

export const registerUser = mutation({
  args: {
    email: v.string(),
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    defaultLanguage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      email: cleanEmail,
      fullName: args.fullName || cleanEmail.split("@")[0],
      username: args.username || `@${cleanEmail.split("@")[0]}`,
      defaultLanguage: args.defaultLanguage || "en",
      isDiscoverable: true,
      privacySettings: {},
    });

    return userId;
  },
});
