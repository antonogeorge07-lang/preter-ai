import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">Preter AI</h1>
      <p className="text-slate-400 mb-8 max-w-md text-center">
        Your AI workspace is up and running on production.
      </p>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm font-mono text-emerald-400">
        Status: Live on preter.space
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}