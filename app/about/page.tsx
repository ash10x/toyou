"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Car, ShieldCheck, Clock, Users, ArrowRight } from "lucide-react";

const defaultStats = [
  { label: "Vehicles", value: "—" },
  { label: "Happy Customers", value: "—" },
  { label: "Locations", value: "—" },
  { label: "Support", value: "24/7" },
];

const features = [
  {
    title: "Premium Fleet",
    text: "A curated selection of luxury, SUV, and economy vehicles maintained to the highest standard.",
    icon: Car,
  },
  {
    title: "Trusted & Secure",
    text: "Fully insured rentals with secure booking and verified customer protection.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Booking",
    text: "Seamless reservation system designed for speed, clarity, and convenience.",
    icon: Clock,
  },
  {
    title: "Customer First",
    text: "Dedicated support ensuring every rental experience is smooth and stress-free.",
    icon: Users,
  },
];

export default function AboutPage() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();
        if (json?.stats) {
          const s = json.stats;
          setStats([
            { label: "Vehicles", value: `${s.vehicles ?? 0}` },
            { label: "Happy Customers", value: s.customers ? `${s.customers}+` : "1,000+" },
            { label: "Locations", value: `${s.locations ?? 0}` },
            { label: "Support", value: "24/7" },
          ]);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-32">

      {/* HERO */}
      <section className="relative overflow-hidden pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-red-600/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
              About Us
            </span>
            <h1 className="mt-6 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
              Driven by Luxury.
              <br />
              Built on Trust.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
              We deliver premium car rental experiences designed for comfort,
              performance, and convenience across every journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <section className="px-6 lg:px-10">
        <div className="relative mx-auto h-95 max-w-7xl overflow-hidden rounded-3xl">
          <Image
            src="/images/hero1.jpg"
            alt="Luxury Fleet"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-zinc-950/55" />
          <div className="absolute bottom-8 left-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
              Our Standard
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Premium Mobility Experience
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-300">
              From city drives to long-distance travel, we ensure every ride
              feels first-class.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4 lg:px-10">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <p className="text-4xl font-black tracking-tighter text-red-600">{s.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-zinc-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
              Our Story
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tighter text-zinc-950">
              Where It All Began
            </h2>
            <p className="mt-6 text-base leading-relaxed text-zinc-500">
              We started with a simple mission: make premium car rentals
              accessible, reliable, and effortless. Today, we serve customers
              across multiple locations with a growing fleet of luxury and
              economy vehicles.
            </p>
            <p className="mt-4 text-base leading-relaxed text-zinc-500">
              Whether it's business travel, vacation, or special occasions, we
              ensure every ride delivers comfort, safety, and style.
            </p>
            <Link
              href="/cars"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.35)]"
            >
              Explore Fleet
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-100 overflow-hidden rounded-3xl"
          >
            <Image
              src="/images/hero1.jpg"
              alt="Our Fleet"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500">
              Why Choose Us
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tighter text-white">
              Built for Excellence
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/[0.07] bg-white/3 p-6 transition-all hover:-translate-y-1 hover:border-red-500/25"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-900/30">
                    <Icon className="text-white" size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-white">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
            Get Started
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tighter text-zinc-950">
            Ready to Drive Premium?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-500">
            Book your vehicle today and experience a new level of comfort and reliability.
          </p>
          <Link
            href="/booking"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-red-600 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)]"
          >
            Book Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
