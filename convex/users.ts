import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    fullName: v.optional(v.string()),
    primaryLanguage: v.optional(v.string()),
    defaultLanguage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const displayName = args.fullName || args.name || cleanEmail.split("@")[0];
    const lang = args.primaryLanguage || args.defaultLanguage || "en";

    const userId = await ctx.db.insert("users", {
      email: cleanEmail,
      password: args.password,
      name: displayName,
      fullName: displayName,
      username: `@${cleanEmail.split("@")[0]}`,
      defaultLanguage: lang,
      isDiscoverable: true,
      privacySettings: {},
      createdAt: Date.now(),
    });

    return { userId, email: cleanEmail };
  },
});
