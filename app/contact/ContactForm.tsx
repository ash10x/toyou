"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Clock, TrendingUp, Users } from "lucide-react";

const PACKAGES = {
  discovery: {
    name: "Discovery Call",
    price: "$99",
    duration: "15-Minute Introductory Call",
    icon: Clock,
    defaultMessage:
      "Hi ToYou team,\n\nI'm interested in booking the Discovery Call ($99 — 15 minutes).\n\nI'd love to learn more about starting a car rental business and whether it's the right fit for me.\n\nPlease let me know the next available time slot.\n\nThank you!",
  },
  strategy: {
    name: "Strategy Session",
    price: "$300",
    duration: "60-Minute One-on-One Consultation",
    icon: TrendingUp,
    defaultMessage:
      "Hi ToYou team,\n\nI'm interested in booking the Strategy Session ($300 — 60 minutes).\n\nI'm looking to [briefly describe your situation — e.g. 'purchase my first rental vehicle' / 'expand my existing fleet'].\n\nPlease let me know the next available time slot.\n\nThank you!",
  },
  investor: {
    name: "Investor & Fleet Consultation",
    price: "$500",
    duration: "90-Minute Advanced Consultation",
    icon: Users,
    defaultMessage:
      "Hi ToYou team,\n\nI'm interested in booking the Investor & Fleet Consultation ($500 — 90 minutes).\n\nI'm looking to [briefly describe your goals — e.g. 'build a multi-vehicle fleet' / 'structure an investor deal'].\n\nPlease let me know the next available time slot.\n\nThank you!",
  },
} as const;

type PackageKey = keyof typeof PACKAGES;

function PackageBanner({ pkg }: { pkg: (typeof PACKAGES)[PackageKey] }) {
  const Icon = pkg.icon;
  return (
    <div className="mb-5 flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600">
        <Icon size={17} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500">Selected Package</p>
        <p className="truncate text-sm font-bold text-zinc-900">{pkg.name}</p>
        <p className="text-xs text-zinc-500">{pkg.price} &mdash; {pkg.duration}</p>
      </div>
    </div>
  );
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const packageKey = searchParams.get("package") as PackageKey | null;
  const selectedPackage = packageKey && PACKAGES[packageKey] ? PACKAGES[packageKey] : null;

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (selectedPackage) {
      setForm((prev) => ({ ...prev, message: selectedPackage.defaultMessage }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageKey]);
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !isValidEmail(form.email) || !form.message.trim()) {
      setStatus({ type: "error", message: "Please enter a valid name, email address, and message." });
      return;
    }

    setStatus({ type: "loading", message: "Sending message..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to send message.");
      setForm({ name: "", email: "", message: "" });
      setStatus({
        type: "success",
        message: "Message sent! A confirmation email has been delivered to your inbox.",
      });
    } catch (error) {
      console.error("Contact submission failed", error);
      setStatus({
        type: "error",
        message: "Unable to send your message right now. Please try again later.",
      });
    }
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
      {selectedPackage && <PackageBanner pkg={selectedPackage} />}

      {status.type !== "idle" && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl border p-4 text-sm ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : status.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-zinc-200 bg-zinc-50 text-zinc-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Full Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="h-12 w-full rounded-xl border border-zinc-100 bg-[#f5f5f7] px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Email Address
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-12 w-full rounded-xl border border-zinc-100 bg-[#f5f5f7] px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Message
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={selectedPackage ? 9 : 5}
          placeholder="Type your message..."
          className="w-full rounded-xl border border-zinc-100 bg-[#f5f5f7] p-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status.type === "loading" ? "Sending..." : "Send Message"}
        <Send size={15} />
      </button>
    </form>
  );
}
