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
            {
              label: "Happy Customers",
              value: s.customers ? `${s.customers}+` : "1,000+",
            },
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
    <main className="min-h-screen bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              About Us
            </span>

            <h1 className="mt-6 text-5xl font-black text-black md:text-6xl">
              Driven by Luxury. Built on Trust.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              We deliver premium car rental experiences designed for comfort,
              performance, and convenience across every journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* IMAGE BANNER */}
      <section className="px-6 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] h-[420px]">
          <Image
            src="/hero/about-hero.jpg"
            alt="Luxury Fleet"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-3xl font-black">Premium Mobility Experience</h2>
            <p className="mt-2 text-gray-200 max-w-md">
              From city drives to long-distance travel, we ensure every ride
              feels first-class.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl bg-white border border-black/5 p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-black text-red-600">{s.value}</p>
              <p className="mt-2 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-black">Our Story</h2>

            <p className="mt-6 text-gray-600 leading-relaxed">
              We started with a simple mission: make premium car rentals
              accessible, reliable, and effortless. Today, we serve customers
              across multiple locations with a growing fleet of luxury and
              economy vehicles.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Whether it’s business travel, vacation, or special occasions, we
              ensure every ride delivers comfort, safety, and style.
            </p>

            <Link
              href="/cars"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-4 text-white font-semibold hover:bg-red-700 transition"
            >
              Explore Fleet
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[420px] rounded-[2rem] overflow-hidden"
          >
            <Image
              src="/cars/fleet.jpg"
              alt="Fleet"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white">Why Choose Us</h2>
            <p className="mt-4 text-gray-400">
              Built for reliability, comfort, and premium service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="h-14 w-14 rounded-2xl bg-red-600 flex items-center justify-center">
                    <Icon className="text-white" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    {f.title}
                  </h3>

                  <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                    {f.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl text-center px-6">
          <h2 className="text-4xl font-black text-black">
            Ready to Drive Premium?
          </h2>

          <p className="mt-5 text-gray-600">
            Book your vehicle today and experience a new level of comfort and
            reliability.
          </p>

          <Link
            href="/booking"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-white font-semibold hover:bg-red-700 transition"
          >
            Book Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
