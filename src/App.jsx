import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      // Parse token from hash fragment if redirected from Google
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.replace("#", "?"));
        const token = params.get("access_token");
        if (token) {
          localStorage.setItem("google_access_token", token);
          localStorage.setItem("vl_user_email", "google_authenticated_user");
        }
      }
    } catch (err) {
      console.error("OAuth token parsing error:", err);
    } finally {
      navigate("/chat", { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
      <p className="text-sm text-slate-400 animate-pulse">Completing Google Sign-In...</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
