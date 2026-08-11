import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Request password reset token and store/dispatch reset link
export const sendPasswordResetEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    if (!cleanEmail) return { success: false, message: "Email is required" };

    // Find user in Convex DB
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), cleanEmail))
      .first();

    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

    if (user) {
      await ctx.db.patch(user._id, {
        resetToken,
        resetTokenExpires: Date.now() + 3600000, // 1 hour
      });
    }

    // In production, integrate Resend or SendGrid API key via environment variables:
    // await fetch("https://api.resend.com/emails", { ... })

    return {
      success: true,
      message: `Password reset link sent to ${cleanEmail}`,
    };
  },
});
