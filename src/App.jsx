import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { ThemeProvider } from 'next-themes';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from './components/ScrollToTop';
import PageNotFound from './lib/PageNotFound';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Forge from '@/pages/Forge';
import Landing from '@/pages/Landing';
import ResetPassword from '@/pages/ResetPassword';
import Legal from '@/pages/Legal';
import JoinConversation from '@/pages/JoinConversation';

// Apply saved theme before first paint to avoid flash
(function applyInitialTheme() {
  try {
    const t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.classList.remove('theme-dark');
    else document.documentElement.classList.add('theme-dark');
  } catch {
    document.documentElement.classList.add('theme-dark');
  }
})();

const MinimalLinenLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center select-none"
    style={{ background: 'var(--background)' }}>
    <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--primary)' }}
      className="text-2xl font-semibold tracking-widest uppercase opacity-50 animate-pulse">
      Preter
    </h1>
  </div>
);

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) return <MinimalLinenLoader />;

  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError />;

  return (
    <Routes>
      {/* Password reset — always accessible */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Invite handler — cache code then route appropriately */}
      <Route path="/join/:code" element={<JoinConversation />} />

      {/* Auth pages — redirect to app if already signed in */}
      <Route path="/landing" element={isAuthenticated ? <Navigate to="/" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Landing />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Landing />} />

      {/* App pages — redirect to landing if not signed in */}
      <Route path="/" element={isAuthenticated ? <Forge /> : <Navigate to="/landing" replace />} />
      <Route path="/chat/:chatId" element={isAuthenticated ? <Forge /> : <Navigate to="/landing" replace />} />

      <Route path="/legal" element={<Legal />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;