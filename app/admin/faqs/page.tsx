"use client";

import { useEffect, useState } from "react";

type Faq = { id: number; question: string; answer: string; category: string };

const BLANK = { question: "", answer: "", category: "General" };

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/faqs");
    if (res.ok) setFaqs(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(faq: Faq) {
    setEditing(faq.id);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNew() {
    setEditing(null);
    setForm(BLANK);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm(BLANK);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const res = await fetch(`/api/admin/faqs/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setFaqs((f) => f.map((x) => (x.id === editing ? updated : x)));
      }
    } else {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setFaqs((f) => [...f, created]);
      }
    }
    cancelForm();
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this FAQ?")) return;
    setDeleting(id);
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    setFaqs((f) => f.filter((x) => x.id !== id));
    setDeleting(null);
  }

  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors w-full";

  const categories = [...new Set(faqs.map((f) => f.category))].sort();

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">FAQs</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading…" : `${faqs.length} questions`}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startNew}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-6 space-y-4">
          <h2 className="text-base font-semibold text-white">{editing ? "Edit FAQ" : "New FAQ"}</h2>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="General" />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Question *</label>
            <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} placeholder="What is the minimum rental period?" />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Answer *</label>
            <textarea
              required
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className={inputCls}
              placeholder="The minimum rental period is 3 days."
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add FAQ"}
            </button>
            <button type="button" onClick={cancelForm} className="text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : faqs.length === 0 ? (
        <div className="text-zinc-500 text-sm">No FAQs yet.</div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{cat}</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
                {faqs.filter((f) => f.category === cat).map((faq) => (
                  <div key={faq.id} className="px-4 sm:px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{faq.question}</div>
                        <div className="text-sm text-zinc-400 mt-1">{faq.answer}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(faq)}
                          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          disabled={deleting === faq.id}
                          className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 px-1 py-1.5"
                        >
                          {deleting === faq.id ? "…" : "Del"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
