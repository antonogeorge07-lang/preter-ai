import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Globe, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Register() {
  const navigate = useNavigate();
  const registerUser = useMutation(api.users.registerUser);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError("");

    try {
      await registerUser({
        email: email.trim(),
        fullName: fullName.trim() || undefined,
        defaultLanguage: language,
      });

      localStorage.setItem("vl_user_email", email.trim());
      localStorage.setItem("vl_user_lang", language);
      navigate("/chat");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/chat`);
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=openid%20profile%20email`;
    } else {
      localStorage.setItem("vl_user_email", "google_user@preter.space");
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl" style={{ background: "var(--surface-bg)", border: "1px solid var(--surface-border)" }}>
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}>Create Account</h1>
        <p className="text-xs text-muted-foreground mb-6">Join Preter to translate and communicate across languages.</p>

        {error && (
          <div className="mb-4 p-3 rounded-2xl text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          type="button"
          className="w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all mb-4 hover:bg-black/5"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Sign up with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] uppercase text-muted-foreground font-medium">Or email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <User className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Antono George" className="w-full bg-transparent text-sm focus:outline-none text-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-transparent text-sm focus:outline-none text-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent text-sm focus:outline-none text-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Primary Language</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-transparent text-sm focus:outline-none text-foreground">
                <option value="en">English</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="zh">Chinese (中文)</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2" style={{ background: "var(--primary)", color: "var(--paper)" }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-indigo-400 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
