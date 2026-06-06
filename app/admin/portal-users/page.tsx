"use client";

import { useEffect, useState } from "react";
import { Users, Search, ShieldCheck, Car, User, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

type PortalUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

type ActionState =
  | { type: "idle" }
  | { type: "confirm-delete" };

export default function PortalUsersPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "renter" | "hoster">("all");
  const [actions, setActions] = useState<Record<number, ActionState>>({});
  const [busy, setBusy] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/portal-users")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { setUsers(data); setLoading(false); });
  }, []);

  function setAction(id: number, action: ActionState) {
    setActions((prev) => ({ ...prev, [id]: action }));
  }

  async function patch(id: number, body: object) {
    setBusy((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/admin/portal-users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
        setAction(id, { type: "idle" });
      }
    } finally {
      setBusy((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function deleteUser(id: number) {
    setBusy((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/admin/portal-users/${id}`, { method: "DELETE" });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    } finally {
      setBusy((prev) => ({ ...prev, [id]: false }));
    }
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const renters = users.filter((u) => u.role === "renter").length;
  const hosters = users.filter((u) => u.role === "hoster").length;
  const active = users.filter((u) => u.is_active).length;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Users size={20} className="text-red-500" />
          Portal Users
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Manage renters and hosters registered on the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length, icon: Users },
          { label: "Renters", value: renters, icon: User },
          { label: "Hosters", value: hosters, icon: Car },
          { label: "Active", value: active, icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <Icon size={16} className="text-zinc-500 mb-2" />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "renter", "hoster"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                roleFilter === r
                  ? "bg-red-600 text-white"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {r === "all" ? "All" : r === "renter" ? `Renters (${renters})` : `Hosters (${hosters})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-zinc-500 text-sm">Loading users…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <Users size={28} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">
            {search || roleFilter !== "all" ? "No users match your filters." : "No portal users yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => {
            const action = actions[user.id] ?? { type: "idle" };
            const isBusy = !!busy[user.id];

            return (
              <div
                key={user.id}
                className={`bg-zinc-900 border rounded-2xl p-4 transition-colors ${
                  user.is_active ? "border-zinc-800" : "border-zinc-800/50 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    user.role === "hoster"
                      ? "bg-red-600/10 border border-red-500/20"
                      : "bg-blue-600/10 border border-blue-500/20"
                  }`}>
                    {user.role === "hoster" ? (
                      <Car size={16} className="text-red-400" />
                    ) : (
                      <User size={16} className="text-blue-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-white">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 capitalize ${
                        user.role === "hoster"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {user.role}
                      </span>
                      {!user.is_active && (
                        <span className="text-[10px] font-bold bg-zinc-700/60 text-zinc-500 border border-zinc-700 rounded-full px-2 py-0.5">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    {user.phone && <p className="text-xs text-zinc-600">{user.phone}</p>}
                    <p className="text-[10px] text-zinc-700 mt-1">
                      Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle role */}
                    <button
                      onClick={() => patch(user.id, { role: user.role === "hoster" ? "renter" : "hoster" })}
                      disabled={isBusy}
                      title={`Switch to ${user.role === "hoster" ? "renter" : "hoster"}`}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors disabled:opacity-50 text-xs font-medium hidden sm:flex items-center gap-1"
                    >
                      {user.role === "hoster" ? <User size={13} /> : <Car size={13} />}
                      <span className="hidden lg:inline">Make {user.role === "hoster" ? "Renter" : "Hoster"}</span>
                    </button>

                    {/* Toggle active */}
                    <button
                      onClick={() => patch(user.id, { is_active: !user.is_active })}
                      disabled={isBusy}
                      title={user.is_active ? "Suspend account" : "Reactivate account"}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        user.is_active
                          ? "bg-green-500/10 hover:bg-red-500/10 text-green-400 hover:text-red-400"
                          : "bg-red-500/10 hover:bg-green-500/10 text-red-400 hover:text-green-400"
                      }`}
                    >
                      {user.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>

                    {/* Delete */}
                    {action.type === "confirm-delete" ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={isBusy}
                          className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          {isBusy ? "Deleting…" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setAction(user.id, { type: "idle" })}
                          className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1.5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAction(user.id, { type: "confirm-delete" })}
                        disabled={isBusy}
                        title="Delete user"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
