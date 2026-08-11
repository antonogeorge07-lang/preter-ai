import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const sendPasswordResetEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    if (!cleanEmail) return { success: false, message: "Email is required" };

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), cleanEmail))
      .first();

    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

    if (user) {
      await ctx.db.patch(user._id, {
        resetToken,
        resetTokenExpires: Date.now() + 3600000,
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Preter <noreply@preter.space>",
            to: cleanEmail,
            subject: "Reset your Preter password",
            html: `<p>Click <a href="https://preter.space/reset-password?token=${resetToken}">here</a> to reset your password.</p>`,
          }),
        });
      } catch (err) {
        console.error("Resend dispatch error:", err);
      }
    }

    return {
      success: true,
      message: `Password reset link sent to ${cleanEmail}`,
    };
  },
});
