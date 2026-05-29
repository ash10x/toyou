"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
          rows={5}
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
