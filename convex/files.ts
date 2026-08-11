import { mutation } from "./_generated/server";

// Generate short-lived upload URL for Convex storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
