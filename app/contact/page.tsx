"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  return (
    <main className="min-h-screen bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Contact Us
            </span>

            <h1 className="mt-6 text-5xl font-black text-black md:text-6xl">
              We’re Here to Help
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              Have questions, booking requests, or partnership inquiries? Our
              team is ready to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-10">
          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2rem] bg-white border border-black/5 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
          >
            <h2 className="text-2xl font-black text-black">Send a Message</h2>

            <p className="mt-2 text-gray-500 text-sm">
              We typically respond within a few hours.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent (hook this to backend/API)");
              }}
            >
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Message
                </label>

                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-black outline-none focus:border-red-500"
                  placeholder="Type your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-white font-semibold hover:bg-red-700 transition"
              >
                Send Message
                <Send size={18} />
              </button>
            </form>
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <InfoCard icon={Phone} title="Phone" text="+1 (876) 000-0000" />

            <InfoCard icon={Mail} title="Email" text="support@toyocar.com" />

            <InfoCard icon={MapPin} title="Location" text="Kingston, Jamaica" />

            <InfoCard
              icon={Clock}
              title="Business Hours"
              text="Mon - Sun | 24/7 Support"
            />

            {/* MAP BLOCK */}
            <div className="rounded-[2rem] overflow-hidden border border-black/5 h-72 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <iframe
                src="https://maps.google.com/maps?q=Kingston%20Jamaica&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* INPUT */
function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-600">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 text-black outline-none focus:border-red-500"
      />
    </div>
  );
}

/* INFO CARD */
function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] bg-white border border-black/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
        <Icon className="text-white" size={18} />
      </div>

      <div>
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}
