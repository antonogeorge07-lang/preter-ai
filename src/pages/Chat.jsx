import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, LogOut, Send, Bot, User, Sparkles } from "lucide-react";

export default function Chat() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! Welcome to Preter AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Strict authentication check
    const storedEmail = localStorage.getItem("vl_user_email");
    const googleToken = localStorage.getItem("google_access_token");

    if (!storedEmail && !googleToken) {
      // Clear any partial session state and force redirect to login
      localStorage.clear();
      navigate("/login", { replace: true });
    } else {
      setUserEmail(storedEmail || "Authenticated User");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: `Translated: "${userMsg.text}"` }
      ]);
    }, 600);
  };

  return (
    <div className="flex h-screen w-full bg-[#030712] text-white font-sans overflow-hidden">
      <aside className="w-64 bg-[#0B0F19] border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
              P
            </div>
            <span className="font-bold tracking-tight text-lg">Preter AI</span>
          </div>

          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/60 text-xs font-medium text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" /> Active Session
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <div className="px-2 mb-3">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Signed in as</p>
            <p className="text-xs text-slate-300 truncate font-medium">{userEmail || "User"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col justify-between bg-[#030712] relative">
        <header className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#030712]/50 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Preter AI Workspace
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl w-full mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
              </div>
              <div
                className={`max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-[#0B0F19] border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-[#030712]">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message or translation prompt..."
              className="flex-1 bg-[#0B0F19] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
