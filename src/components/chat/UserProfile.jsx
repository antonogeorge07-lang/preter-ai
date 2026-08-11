import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Globe, Camera, Phone, Trash2, AlertTriangle, Monitor, Shield, AtSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LANG_MAP } from "@/lib/translation";
import { getOrCreateDeviceSessionId } from "@/lib/deviceSession";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const LANG_OPTIONS = Object.entries(LANG_MAP).map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name));

export default function UserProfile({ isOpen, onClose, currentUserId }) {
  const user = useQuery(api.users.getUserById, currentUserId ? { userId: currentUserId } : "skip");
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [defaultLang, setDefaultLang] = useState("en");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [requireInviteLink, setRequireInviteLink] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef(null);
  const mySessionId = getOrCreateDeviceSessionId();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
      setDefaultLang(user.defaultLanguage || "en");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatarUrl || "");
      setIsDiscoverable(user.isDiscoverable ?? true);
      setRequireInviteLink(user.privacySettings?.requireInviteLink ?? false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!currentUserId) return;
    setSaving(true);
    try {
      await updateProfile({
        userId: currentUserId,
        fullName,
        username,
        defaultLanguage: defaultLang,
        phone,
        bio,
        avatarUrl,
        isDiscoverable,
        privacySettings: {
          allowUsernameDiscovery: isDiscoverable,
          requireInviteLink,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  const initials = fullName ? fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: "spring", damping: 24, stiffness: 300 }} className="fixed inset-x-4 top-[5%] bottom-[5%] overflow-y-auto sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[440px] sm:top-[8%] sm:bottom-auto z-50 rounded-3xl shadow-2xl p-6" style={{ background: "var(--surface-bg)", border: "1px solid var(--surface-border)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Profile & Settings</h2>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--glass-hover)] transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg block">
                  {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}>{initials}</div>}
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Display Name</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className="w-full bg-transparent text-sm text-foreground focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Username Handle</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <AtSign className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="username" className="w-full bg-transparent text-sm font-mono text-foreground focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Mobile Number</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000" className="w-full bg-transparent text-sm text-foreground focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Default Translation Language</label>
                <Select value={defaultLang} onValueChange={setDefaultLang}>
                  <SelectTrigger className="w-full rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] h-11">
                    <Globe className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {LANG_OPTIONS.map(({ code, name }) => <SelectItem key={code} value={code}>{name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 border-t border-[var(--surface-border)]">
                <label className="block text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" /> Privacy & Discovery
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Allow Username Discovery</p>
                      <p className="text-[10px] text-muted-foreground">Let users find you by searching @{username || "username"}</p>
                    </div>
                    <Switch checked={isDiscoverable} onCheckedChange={setIsDiscoverable} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Require Invite Link</p>
                      <p className="text-[10px] text-muted-foreground">Only allow new chats through your shareable invite code</p>
                    </div>
                    <Switch checked={requireInviteLink} onCheckedChange={setRequireInviteLink} />
                  </div>
                </div>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 disabled:opacity-60">
              {saving ? "Saving..." : saved ? "✓ Settings Saved" : "Save Settings"}
            </motion.button>

            <div className="mt-6 text-center">
              <Link to="/legal" onClick={onClose} className="text-[11px] underline underline-offset-2 transition-colors hover:opacity-80" style={{ color: "var(--muted)" }}>
                Privacy Policy &amp; Terms of Service
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}