import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user profile by Convex ID or string ID
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .first();
    if (!user) return null;
    
    // Omit email for privacy when returned
    const { email, ...safeProfile } = user;
    return safeProfile;
  },
});

// Lookup discoverable user by username
export const lookupUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const cleanUsername = args.username.trim().toLowerCase().replace(/^@/, "");
    if (!cleanUsername) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanUsername))
      .first();

    if (!user || user.isDiscoverable === false) return null;

    const { email, ...safeProfile } = user;
    return safeProfile;
  },
});

// Update profile details and privacy settings
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    defaultLanguage: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    isDiscoverable: v.optional(v.boolean()),
    privacySettings: v.optional(
      v.object({
        allowUsernameDiscovery: v.boolean(),
        requireInviteLink: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    if (updates.username) {
      updates.username = updates.username.trim().toLowerCase().replace(/^@/, "");
    }
    await ctx.db.patch(userId, updates);
  },
});