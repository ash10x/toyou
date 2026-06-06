"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Save, ChevronLeft, Car, LayoutDashboard, LogOut, Globe, Sliders } from "lucide-react";
import { motion } from "framer-motion";

type Session = { userId: number; email: string; role: string; firstName: string } | null;
type Profile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { router.push("/login"); return; }
        setSession(data);
      });
  }, [router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/user/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setPhone(data.phone ?? "");
        }
        setLoading(false);
      });
  }, [session]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setProfileMsg({ type: "ok", text: "Profile updated successfully." });
      } else {
        const data = await res.json();
        setProfileMsg({ type: "err", text: data.error || "Update failed." });
      }
    } catch {
      setProfileMsg({ type: "err", text: "Something went wrong." });
    } finally {
      setProfileSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "err", text: "Passwords do not match." });
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordMsg({ type: "ok", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setPasswordMsg({ type: "err", text: data.error || "Password change failed." });
      }
    } catch {
      setPasswordMsg({ type: "err", text: "Something went wrong." });
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "DELETE" });
    router.push("/login");
  }

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const dashHref = session.role === "hoster" ? "/hoster" : "/dashboard";
  const dashLabel = session.role === "hoster" ? "Hoster Dashboard" : "Dashboard";
  const roleLabel = session.role === "hoster" ? "Hoster" : "Renter";

  const inputCls =
    "w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 focus:bg-zinc-800 transition-all duration-200";

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={dashHref} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={16} />
            {dashLabel}
          </Link>
          <div className="flex items-center gap-2">
            <Link href={dashHref} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-800">
              {session.role === "hoster" ? <Car size={13} /> : <LayoutDashboard size={13} />}
              <span className="hidden sm:inline">{dashLabel}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-800/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <User size={26} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-500 text-sm">{profile?.email}</span>
              <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${
                session.role === "hoster"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {roleLabel}
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Member since {profile ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}
            </p>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {/* Configure profile CTA */}
          <div className="bg-gradient-to-br from-red-600/10 to-red-800/5 border border-red-500/20 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600/15 flex items-center justify-center shrink-0">
                <Sliders size={14} className="text-red-400" />
              </div>
              <span className="text-xs font-bold text-white">Your Profile</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Keep your name, phone, and password up to date.
            </p>
            <button
              onClick={() => document.getElementById("profile-form")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-auto text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 group"
            >
              Update settings
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* Visit main site CTA */}
          <Link
            href="/"
            className="bg-zinc-800/60 border border-zinc-700/60 hover:border-zinc-600 rounded-2xl p-4 flex flex-col gap-2 transition-all group hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-700/60 group-hover:bg-zinc-700 flex items-center justify-center shrink-0 transition-colors">
                <Globe size={14} className="text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-white">Main Site</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Browse the fleet, book a car, or explore consulting.
            </p>
            <span className="mt-auto text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
              Go to toyou.com
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </Link>
        </motion.div>

        <div className="space-y-6">
          {/* Personal info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          id="profile-form"
          >
            <div className="flex items-center gap-2 mb-5">
              <User size={16} className="text-red-400" />
              <h2 className="text-sm font-bold text-white">Personal Information</h2>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile?.email ?? ""}
                  className={`${inputCls} opacity-50 cursor-not-allowed`}
                  disabled
                />
                <p className="text-[10px] text-zinc-600 mt-1">Email cannot be changed.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {profileMsg && (
                <p className={`text-xs px-3 py-2.5 rounded-xl border ${
                  profileMsg.type === "ok"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {profileMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Save size={14} />
                {profileSaving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lock size={16} className="text-red-400" />
              <h2 className="text-sm font-bold text-white">Change Password</h2>
            </div>
            <form onSubmit={savePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Repeat new password"
                  required
                />
              </div>

              {passwordMsg && (
                <p className={`text-xs px-3 py-2.5 rounded-xl border ${
                  passwordMsg.type === "ok"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {passwordMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordSaving}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-zinc-700"
              >
                <Lock size={14} />
                {passwordSaving ? "Updating…" : "Update Password"}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
