import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loginMutation = useMutation(api.users.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await loginMutation({ email, password });
      if (user) {
        localStorage.setItem("vl_user_email", user.email);
        navigate("/chat");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6">Log in to Preter AI</h2>
        {error && <div className="mb-4 text-sm text-red-400 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              placeholder="your@email.com"
              className="w-full rounded-lg bg-slate-700 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg bg-slate-700 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
