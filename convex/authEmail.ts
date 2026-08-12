import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendVerificationEmail = action({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is missing in Convex.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Preter AI <onboarding@resend.dev>",
        to: [args.email],
        subject: `${args.code} is your Preter AI verification code`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome to Preter AI</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 4px; color: #4F46E5;">${args.code}</h1>
            <p>Enter this code on the registration page to activate your account.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send email via Resend: ${errorText}`);
    }

    return { success: true };
  },
});

export const sendPasswordResetEmail = action({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is missing in Convex.");
    }

    const resetLink = `https://preter.space/reset-password?email=${encodeURIComponent(args.email)}`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Preter AI <onboarding@resend.dev>",
        to: [args.email],
        subject: "Reset your Preter AI password",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Preter AI Password Reset</h2>
            <p>Click the button below to reset your account password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send reset email via Resend: ${errorText}`);
    }

    return { success: true };
  },
});
