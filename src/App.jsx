import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

function Workspace() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-600/20 text-indigo-400 mb-4 font-bold text-xl">
          P
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Preter AI Platform</h1>
        <p className="text-slate-400 text-sm mb-6">
          System initialization complete. Database and cloud sync active.
        </p>
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs font-mono text-emerald-400">
          ● Live on preter.space
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Workspace />} />
      <Route path="/landing" element={<Workspace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}