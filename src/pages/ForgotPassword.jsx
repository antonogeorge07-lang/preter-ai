import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl" style={{ background: "var(--surface-bg)", border: "1px solid var(--surface-border)" }}>
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}>Reset Password</h1>
        <p className="text-xs text-muted-foreground mb-6">Enter your email address to receive password reset instructions.</p>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground">Reset link sent!</h3>
            <p className="text-xs text-muted-foreground mt-1">Check <strong>{email}</strong> for instructions to reset your password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-transparent text-sm focus:outline-none text-foreground" />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-2xl font-semibold text-sm transition-all" style={{ background: "var(--primary)", color: "var(--paper)" }}>
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
