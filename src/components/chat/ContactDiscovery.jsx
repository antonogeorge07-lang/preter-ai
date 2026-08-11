import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, AtSign, UserPlus, Loader2, ShieldAlert } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ContactDiscovery({ isOpen, onClose, currentUser, onStartConversation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const cleanSearch = searchQuery.trim().toLowerCase().replace(/^@/, "");

  // Convex lookup by discoverable username
  const searchResult = useQuery(
    api.users.lookupUserByUsername,
    cleanSearch.length > 0 ? { username: cleanSearch } : "skip"
  );

  const loading = cleanSearch.length > 0 && searchResult === undefined;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-hidden"
          style={{ background: "var(--surface-bg)", border: "1px solid var(--surface-border)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold font-heading" style={{ color: "var(--foreground)" }}>Find People</h2>
              <p className="text-xs text-muted-foreground">Search users by their @username handle</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/5 transition-colors" style={{ color: "var(--muted)" }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mb-6">
            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search username (e.g. alex)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl py-3 pl-10 pr-4 text-sm font-mono focus:outline-none transition-all"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="min-h-[160px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center py-6 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                <p className="text-xs text-muted-foreground">Searching network...</p>
              </div>
            ) : searchResult ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-2xl border transition-all"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
                  >
                    {searchResult.avatarUrl ? (
                      <img src={searchResult.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (searchResult.fullName || searchResult.username || "U")[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {searchResult.fullName || "Anonymous"}
                    </h3>
                    <p className="text-xs font-mono text-indigo-400">@{searchResult.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onStartConversation(searchResult);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 hover:opacity-90"
                  style={{ background: "var(--primary)", color: "var(--paper)" }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Chat
                </button>
              </motion.div>
            ) : cleanSearch.length > 0 ? (
              <div className="text-center py-8">
                <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-foreground/80 font-medium">No user found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  User may not exist or has disabled discovery by username.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">Type a username handle above to search for registered contacts.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}