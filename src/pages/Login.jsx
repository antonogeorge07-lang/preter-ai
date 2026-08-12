import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError("");

    try {
      // Set user session email and route to main chat activity
      localStorage.setItem("vl_user_email", email.trim().toLowerCase());
      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid login credentials. Please try again.");
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#030712] text-white font-sans">
      <div className="w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl bg-[#0B0F19] border border-slate-800">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-2xl font-bold mb-1 text-white">Sign In</h1>
        <p className="text-xs text-slate-400 mb-6">Welcome back to Preter AI.</p>

        {error && (
          <div className="mb-4 p-3 rounded-2xl text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          type="button"
          className="w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-800 bg-[#111625] text-white transition-all mb-4 hover:bg-slate-800"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#111625] border border-slate-800">
              <Mail className="w-4 h-4 text-slate-500" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-transparent text-sm focus:outline-none text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">Forgot password?</Link>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#111625] border border-slate-800">
              <Lock className="w-4 h-4 text-slate-500" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent text-sm focus:outline-none text-white" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          Don't have an account? <Link to="/register" className="text-indigo-400 font-medium hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
