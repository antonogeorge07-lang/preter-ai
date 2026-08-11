import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OAuthConsent from "./pages/OAuthConsent";

// Main Preter AI Application Shell
function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">P</div>
          <span className="font-semibold text-lg tracking-tight">Preter AI</span>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-full">
          ● Production Active
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Preter AI Workspace</h1>
          <p className="text-slate-400 text-sm mb-6">
            Your independent full-stack workspace is connected and running on Convex & Vercel.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-500 font-mono mb-1">DATABASE</div>
              <div className="text-sm font-semibold text-slate-200">Convex Cloud</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-500 font-mono mb-1">DOMAIN</div>
              <div className="text-sm font-semibold text-slate-200">preter.space</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/landing" element={<MainLayout />} />
      <Route path="/oauth/consent" element={<OAuthConsent />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}