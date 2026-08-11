import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Forge from "./pages/Forge";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import JoinConversation from "./pages/JoinConversation";
import OAuthConsent from "./pages/OAuthConsent";
import Legal from "./pages/Legal";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/join/:code" element={<JoinConversation />} />
      <Route path="/oauth/consent" element={<OAuthConsent />} />
      <Route path="/legal" element={<Legal />} />
      
      {/* Main Chat & Preter Workspace Route */}
      <Route
        path="/chat/*"
        element={<Forge />}
      />
      <Route
        path="/forge/*"
        element={<Forge />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
