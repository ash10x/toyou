"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !isValidEmail(form.email) ||
      !form.message.trim()
    ) {
      setStatus({
        type: "error",
        message: "Please enter a valid name, email address, and message.",
      });
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

      if (!res.ok) {
        throw new Error(data?.error || "Unable to send message.");
      }

      setForm({ name: "", email: "", message: "" });
      setStatus({
        type: "success",
        message:
          "Message sent! A confirmation email has been delivered to your inbox.",
      });
    } catch (error) {
      console.error("Contact submission failed", error);
      setStatus({
        type: "error",
        message:
          "Unable to send your message right now. Please try again later.",
      });
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {status.type !== "idle" && (
        <div
          className={`mt-2 rounded-2xl border p-4 text-sm ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : status.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-gray-600">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 text-black outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-600">
          Email Address
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 text-black outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-600">Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-black outline-none focus:border-red-500"
          placeholder="Type your message..."
        />
      </div>

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-white font-semibold hover:bg-red-700 transition disabled:cursor-not-allowed disabled:bg-red-400"
      >
        {status.type === "loading" ? "Sending..." : "Send Message"}
        <Send size={18} />
      </button>
    </form>
  );
}
