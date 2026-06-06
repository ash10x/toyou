"use client";

import { useEffect, useState } from "react";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/admin/contacts");
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this message permanently?")) return;
    setDeleting(id);
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    setMessages((m) => m.filter((x) => x.id !== id));
    setDeleting(null);
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Messages</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {loading ? "Loading…" : `${messages.length} total`}
        </p>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : messages.length === 0 ? (
        <div className="text-zinc-500 text-sm">No messages yet.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 p-4 sm:px-5">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm">{m.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{m.email} · {new Date(m.created_at).toLocaleDateString()}</div>
                  {expanded !== m.id && (
                    <div className="text-sm text-zinc-500 mt-1.5 line-clamp-2">{m.message}</div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                    className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
                  >
                    {expanded === m.id ? "Collapse" : "Read"}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={deleting === m.id}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 px-2 py-1.5"
                  >
                    {deleting === m.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
              {expanded === m.id && (
                <div className="border-t border-zinc-800 px-4 sm:px-5 py-4">
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">{m.message}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-block mt-3 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Reply via email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
