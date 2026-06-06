"use client";

import { useEffect, useState } from "react";

type Location = { id: number; name: string };

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/admin/locations");
    if (res.ok) setLocations(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      const created = await res.json();
      setLocations((l) => [...l, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this location?")) return;
    setDeleting(id);
    await fetch(`/api/admin/locations/${id}`, { method: "DELETE" });
    setLocations((l) => l.filter((x) => x.id !== id));
    setDeleting(null);
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Locations</h1>
        <p className="text-zinc-500 text-sm mt-1">Pickup and drop-off locations available for booking</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add new location…"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 sm:px-5 py-2.5 rounded-lg disabled:opacity-50 transition-colors shrink-0"
        >
          {saving ? "…" : "Add"}
        </button>
      </form>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : locations.length === 0 ? (
        <div className="text-zinc-500 text-sm">No locations yet.</div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
          {locations.map((loc) => (
            <div key={loc.id} className="flex items-center justify-between px-4 sm:px-5 py-3.5">
              <span className="text-sm text-zinc-200">{loc.name}</span>
              <button
                onClick={() => handleDelete(loc.id)}
                disabled={deleting === loc.id}
                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 ml-3 shrink-0"
              >
                {deleting === loc.id ? "…" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
