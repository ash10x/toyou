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

type ProfitSplit = {
  host_percentage: number;
  platform_percentage: number;
  payment_delay_days: number;
};

const BLANK: BusinessInfo = {
  phone: "", email: "", address: "", hours: "",
  facebook_url: "", instagram_url: "", twitter_url: "", maps_embed_url: "",
};

const DEFAULT_SPLIT: ProfitSplit = {
  host_percentage: 80,
  platform_percentage: 20,
  payment_delay_days: 3,
};

export default function AdminBusinessPage() {
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [split, setSplit] = useState<ProfitSplit>(DEFAULT_SPLIT);
  const [splitSaving, setSplitSaving] = useState(false);
  const [splitSaved, setSplitSaved] = useState(false);
  const [splitError, setSplitError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/business").then((r) => r.json()),
      fetch("/api/admin/profit-split").then((r) => r.json()),
    ]).then(([bizData, splitData]) => {
      setForm({ ...BLANK, ...bizData });
      setSplit({ ...DEFAULT_SPLIT, ...splitData });
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

  async function handleSplitSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSplitError("");
    if (split.host_percentage + split.platform_percentage !== 100) {
      setSplitError("Host % + ToYou % must equal 100.");
      return;
    }
    setSplitSaving(true);
    const res = await fetch("/api/admin/profit-split", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(split),
    });
    if (res.ok) {
      setSplitSaved(true);
      setTimeout(() => setSplitSaved(false), 3000);
    } else {
      const data = await res.json();
      setSplitError(data.error || "Save failed.");
    }
    setSplitSaving(false);
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
    <div className="p-4 sm:p-8 max-w-2xl space-y-10">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Business Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Contact details, social links, and revenue configuration</p>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : (
        <>
          {/* ── Business Info ── */}
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-4">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">Contact Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("phone", "Phone number", "+1 (555) 000-0000", "tel")}
              {field("email", "Email address", "support@toyourentals.com", "email")}
            </div>
            {field("address", "Street address", "123 Main St, Miami, FL 33101")}
            {field("hours", "Business hours", "Mon–Fri 8am–6pm, Sat 9am–4pm")}

            <hr className="border-zinc-800" />
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Social links</p>

            {field("facebook_url", "Facebook URL", "https://facebook.com/toyourentals", "url")}
            {field("instagram_url", "Instagram URL", "https://instagram.com/toyourentals", "url")}
            {field("twitter_url", "Twitter / X URL", "https://twitter.com/toyourentals", "url")}

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

          {/* ── Profit Split Config ── */}
          <form onSubmit={handleSplitSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-5">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Profit Split & Payout</p>
              <p className="text-xs text-zinc-600 mt-1">
                Controls the revenue split shown across the website and stored with each listing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">
                  Host % <span className="text-zinc-600">(investor)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={split.host_percentage}
                  onChange={(e) => {
                    const host = Number(e.target.value);
                    setSplit({ ...split, host_percentage: host, platform_percentage: 100 - host });
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">
                  ToYou % <span className="text-zinc-600">(platform)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={split.platform_percentage}
                  onChange={(e) => {
                    const platform = Number(e.target.value);
                    setSplit({ ...split, platform_percentage: platform, host_percentage: 100 - platform });
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">
                  Payout delay <span className="text-zinc-600">(days after return)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={split.payment_delay_days}
                  onChange={(e) => setSplit({ ...split, payment_delay_days: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-xs text-zinc-400">
              Current split: hosts earn{" "}
              <strong className="text-white">{split.host_percentage}%</strong>, ToYou retains{" "}
              <strong className="text-white">{split.platform_percentage}%</strong>. Payments are
              issued{" "}
              <strong className="text-white">{split.payment_delay_days} day{split.payment_delay_days !== 1 ? "s" : ""}</strong>{" "}
              after the rental car is returned.
            </div>

            {splitError && (
              <p className="text-xs text-red-400">{splitError}</p>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={splitSaving}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg disabled:opacity-50 transition-colors w-full sm:w-auto"
              >
                {splitSaving ? "Saving…" : "Save Profit Split"}
              </button>
              {splitSaved && <span className="text-emerald-400 text-sm">Saved!</span>}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
