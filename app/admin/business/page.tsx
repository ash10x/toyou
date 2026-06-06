"use client";

import { useEffect, useState } from "react";

type BusinessInfo = {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  maps_embed_url?: string;
};

const BLANK: BusinessInfo = {
  phone: "", email: "", address: "", hours: "",
  facebook_url: "", instagram_url: "", twitter_url: "", maps_embed_url: "",
};

export default function AdminBusinessPage() {
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/business")
      .then((r) => r.json())
      .then((data) => {
        setForm({ ...BLANK, ...data });
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/business", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors w-full";

  const field = (key: keyof BusinessInfo, label: string, placeholder?: string, type = "text") => (
    <div key={key}>
      <label className="text-xs text-zinc-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={form[key] ?? ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={inputCls}
        placeholder={placeholder ?? label}
      />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Business Info</h1>
        <p className="text-zinc-500 text-sm mt-1">Contact details and social links shown on the website</p>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("phone", "Phone number", "+1 (555) 000-0000", "tel")}
            {field("email", "Email address", "support@toyocar.com", "email")}
          </div>
          {field("address", "Street address", "123 Main St, Miami, FL 33101")}
          {field("hours", "Business hours", "Mon–Fri 8am–6pm, Sat 9am–4pm")}

          <hr className="border-zinc-800" />
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Social links</p>

          {field("facebook_url", "Facebook URL", "https://facebook.com/toyocar", "url")}
          {field("instagram_url", "Instagram URL", "https://instagram.com/toyocar", "url")}
          {field("twitter_url", "Twitter / X URL", "https://twitter.com/toyocar", "url")}

          <hr className="border-zinc-800" />
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Maps share link</label>
            <input
              value={form.maps_embed_url ?? ""}
              onChange={(e) => setForm({ ...form, maps_embed_url: e.target.value })}
              className={inputCls}
              placeholder="https://maps.app.goo.gl/..."
            />
            <p className="text-xs text-zinc-600 mt-1">
              Paste the Google Maps share link — it opens in a new tab on the contact page.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg disabled:opacity-50 transition-colors w-full sm:w-auto"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saved && <span className="text-emerald-400 text-sm">Saved!</span>}
          </div>
        </form>
      )}
    </div>
  );
}
