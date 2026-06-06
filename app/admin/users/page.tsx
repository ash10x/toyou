"use client";

import { useEffect, useState } from "react";

type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

const ROLES = ["super_admin", "editor", "viewer"] as const;

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const ROLE_DESC: Record<string, string> = {
  super_admin: "Full access including user management",
  editor: "Manage cars, FAQs, locations, business info. View bookings & messages.",
  viewer: "Read-only access across all sections",
};

const ROLE_COLOR: Record<string, string> = {
  super_admin: "bg-red-500/15 text-red-400 border-red-500/30",
  editor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  viewer: "bg-zinc-500/20 text-zinc-400 border-zinc-600",
};

const BLANK = { username: "", email: "", password: "", role: "editor" as string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  async function load() {
    const [usersRes, meRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/admin/me"),
    ]);
    if (usersRes.ok) setUsers(await usersRes.json());
    if (meRes.ok) {
      const me = await meRes.json();
      setCurrentUserId(me.userId);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setUsers((u) => [...u, created]);
      setForm(BLANK);
      setShowForm(false);
    } else {
      const data = await res.json();
      setFormError(data.error ?? "Failed to create user");
    }
    setSaving(false);
  }

  async function handleRoleChange(id: number, role: string) {
    setEditingRole(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
    setEditingRole(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this admin user permanently?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((u) => u.filter((x) => x.id !== id));
    } else {
      const data = await res.json();
      alert(data.error ?? "Could not delete user");
    }
    setDeleting(null);
  }

  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors w-full";

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Users</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading…" : `${users.length} user${users.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setFormError(""); }}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            + Add Admin User
          </button>
        )}
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {ROLES.map((r) => (
          <div key={r} className={`border rounded-xl px-4 py-3 ${ROLE_COLOR[r]}`}>
            <div className="text-xs font-semibold mb-0.5">{ROLE_LABEL[r]}</div>
            <div className="text-xs opacity-75">{ROLE_DESC[r]}</div>
          </div>
        ))}
      </div>

      {/* Add user form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-base font-semibold text-white">New Admin User</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Username *</label>
              <input
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className={inputCls}
                placeholder="johndoe"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
                placeholder="john@example.com"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Password * (min 8 chars)</label>
              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputCls}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputCls}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                ))}
              </select>
            </div>
          </div>
          {formError && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              {saving ? "Creating…" : "Create User"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError(""); setForm(BLANK); }}
              className="text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users list */}
      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : users.length === 0 ? (
        <div className="text-zinc-500 text-sm">No admin users yet.</div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{u.username}</span>
                  {u.id === currentUserId && (
                    <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">You</span>
                  )}
                  <span className={`text-xs border px-2 py-0.5 rounded-full ${ROLE_COLOR[u.role] ?? "bg-zinc-700 text-zinc-300 border-zinc-600"}`}>
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">{u.email}</div>
                <div className="text-xs text-zinc-600 mt-0.5">
                  Added {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Controls */}
              {u.id !== currentUserId && (
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <select
                    value={u.role}
                    disabled={editingRole === u.id}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={deleting === u.id}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 px-2 py-1.5 rounded hover:bg-zinc-800 transition-colors"
                  >
                    {deleting === u.id ? "…" : "Remove"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
