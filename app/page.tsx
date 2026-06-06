/* =========================================
   app/page.tsx
========================================= */

"use client";

import Image from "next/image";
import Link from "next/link";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CalendarDays,
  Car,
  Check,
  Clock3,
  DollarSign,
  MapPin,
  ShieldCheck,
  Star,
  Sparkles,
  TrendingUp,
  Users,
  Fuel,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

type FeaturedCar = {
  id?: number;
  name: string;
  image: string;
  price: number;
  fuel?: string;
  seats?: number;
};

const defaultFeatured: FeaturedCar[] = [];

const features = [
  {
    title: "Premium Vehicles",
    icon: Car,
    text: "Luxury and economy vehicles maintained to the highest standards.",
  },
  {
    title: "24/7 Support",
    icon: Clock3,
    text: "Our team is available anytime to assist with your rental needs.",
  },
  {
    title: "Safe & Secure",
    icon: ShieldCheck,
    text: "Fully insured rentals with trusted customer service.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  const [locations, setLocations] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    pickupDate: "",
    dropoffDate: "",
  });
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>(defaultFeatured);

  useEffect(() => {
    async function loadData() {
      try {
        const [featuredRes, locationsRes] = await Promise.all([
          fetch("/api/featured-cars"),
          fetch("/api/locations"),
        ]);
        const featuredJson = await featuredRes.json();
        const locationsJson = await locationsRes.json();
        if (featuredJson?.featured) setFeaturedCars(featuredJson.featured as FeaturedCar[]);
        if (locationsJson?.locations) setLocations(locationsJson.locations as string[]);
      } catch (err) {
        console.error("Failed to load homepage data", err);
      }
    }
    loadData();
  }, []);

  const isValid = useMemo(
    () =>
      form.fullName &&
      form.email &&
      form.phone &&
      form.pickup &&
      form.dropoff &&
      form.pickupDate &&
      form.dropoffDate,
    [form],
  );

  return (
    <main className="overflow-hidden bg-white">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero1.jpg"
            alt="Luxury Rental Car"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        {/* GLOW */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 h-[36rem] w-[36rem] rounded-full bg-red-600/15 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-6 pb-24 pt-32 lg:grid-cols-[1fr_0.9fr] lg:px-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
              <Sparkles size={11} />
              Premium Car Rentals
            </div>

            <h1 className="mt-7 max-w-2xl text-[3.6rem] font-black leading-[0.92] tracking-tighter text-white md:text-7xl lg:text-8xl">
              Drive
              <br />
              Premium.
              <span className="mt-1 block text-red-500">Arrive Different.</span>
            </h1>

            <p className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-zinc-300">
              Luxury vehicles, seamless reservations, and elite customer service
              designed for modern travel.
            </p>

            {/* TRUST PILLS */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["Premium Fleet", "24/7 Support", "Fully Insured"].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* CTA ROW */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/cars"
                className="group inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-[0_0_32px_rgba(220,38,38,0.45)]"
              >
                Explore Fleet
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-red-500 text-red-500" size={14} />
                ))}
                <span className="ml-1 text-xs text-zinc-400">
                  Trusted by 1,000+ customers
                </span>
              </div>
            </div>
          </motion.div>

          {/* BOOKING PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_60%)]" />

            <div className="relative">
              <div className="mb-7">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
                  <ShieldCheck size={11} />
                  Secure Booking
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                  Reserve Your Vehicle
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Quick booking with instant confirmation.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isValid) return;
                  const params = new URLSearchParams({
                    from: "form",
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    pickup: form.pickup,
                    dropoff: form.dropoff,
                    pickupDate: form.pickupDate,
                    dropoffDate: form.dropoffDate,
                  });
                  router.push(`/booking?${params.toString()}`);
                }}
              >
                <GlassInput
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
                <GlassInput
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <GlassInput
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <GlassSelect
                    icon={MapPin}
                    label="Pickup Location"
                    value={form.pickup}
                    onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                    options={locations}
                    placeholder="Pickup"
                  />
                  <GlassSelect
                    icon={MapPin}
                    label="Dropoff Location"
                    value={form.dropoff}
                    onChange={(e) => setForm({ ...form, dropoff: e.target.value })}
                    options={locations}
                    placeholder="Dropoff"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <GlassInput
                    icon={CalendarDays}
                    type="date"
                    value={form.pickupDate}
                    onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                  />
                  <GlassInput
                    icon={CalendarDays}
                    type="date"
                    value={form.dropoffDate}
                    onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all duration-300 ${
                    isValid
                      ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_28px_rgba(220,38,38,0.45)]"
                      : "cursor-not-allowed bg-white/10 text-zinc-500"
                  }`}
                >
                  Continue Booking
                  <ChevronRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED VEHICLES ────────────────────── */}
      <section className="relative overflow-hidden bg-[#f5f5f7] py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-red-600/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600">
              Featured Fleet
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
              Luxury Vehicles
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
              Hand-selected premium vehicles crafted for comfort, elegance, and performance.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={car.image || "https://via.placeholder.com/600x350"}
                    alt={car.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-900/20">
                    ${car.price}/day
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black tracking-tight text-zinc-950">{car.name}</h3>
                  <p className="mt-1 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Premium Rental
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <FeatureSpec icon={<Users size={14} />} label="Seats" value={`${car.seats || 5}`} />
                    <FeatureSpec icon={<Fuel size={14} />} label="Fuel" value={car.fuel || "Gasoline"} />
                  </div>

                  <Link
                    href={{
                      pathname: "/booking",
                      query: {
                        carId: car.id ?? index,
                        carName: car.name,
                        carImage: car.image,
                        carPrice: car.price,
                        fuel: car.fuel || "",
                        seats: car.seats?.toString() || "",
                      },
                    }}
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.3)]"
                  >
                    Book Now
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-950"
            >
              View all vehicles
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIST YOUR CAR ─────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 top-0 h-[28rem] w-[28rem] rounded-full bg-red-600/6 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-zinc-900/4 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600">
                Become a Host
              </p>
              <h2 className="mt-4 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
                List Your Car.
                <span className="mt-1 block text-red-600">Earn Passively.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-500">
                Turn your idle vehicle into a revenue-generating asset. ToYou handles all operations — you simply collect your share.
              </p>

              <div className="mt-8 inline-flex items-center gap-5 rounded-2xl border border-red-100 bg-red-50 px-6 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-200">
                  <DollarSign size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600">Profit Split</p>
                  <p className="mt-0.5 text-2xl font-black text-zinc-950">
                    80%{" "}
                    <span className="text-base font-medium text-zinc-400">You</span>
                    <span className="mx-3 text-zinc-300">·</span>
                    20%{" "}
                    <span className="text-base font-medium text-zinc-400">ToYou</span>
                  </p>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "You keep 80% of every dollar earned",
                  "We manage bookings, customers & logistics",
                  "GPS tracking & full asset protection included",
                  "No prior experience needed — we handle it all",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-600">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Check size={11} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/list-your-car"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)]"
              >
                List Your Vehicle
                <ArrowRight size={15} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "Your Share", value: "80%", sub: "of all rental revenue", accent: true },
                { label: "ToYou Fee", value: "20%", sub: "operations & management", accent: false },
                { label: "Vehicles Co-Hosted", value: "25+", sub: "and growing", accent: false },
                { label: "Monthly Peak Revenue", value: "$50K+", sub: "across our fleet", accent: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                >
                  <p className={`text-3xl font-black ${stat.accent ? "text-red-600" : "text-zinc-950"}`}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">{stat.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-0 h-[28rem] w-[28rem] rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-red-900/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Why Choose Us
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tighter text-white md:text-6xl">
              Premium Experience
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.05]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-900/30">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-black tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{feature.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONSULTING ─────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f5f5f7] py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-red-600/6 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-zinc-900/4 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600">
              Expert Guidance
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
              Consulting & Mentorship
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
              Learn how to build a profitable car rental business — including how to structure investor deals with our proven 80:20 profit split model.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Discovery Call",
                price: "$99",
                duration: "15 Minutes",
                Icon: Clock3,
                desc: "Perfect for understanding the business and investment requirements.",
                popular: false,
              },
              {
                name: "Strategy Session",
                price: "$300",
                duration: "60 Minutes",
                Icon: TrendingUp,
                desc: "One-on-one consulting for new investors, hosts, and business planning.",
                popular: true,
              },
              {
                name: "Investor & Fleet",
                price: "$500",
                duration: "90 Minutes",
                Icon: Users,
                desc: "Advanced consultation for fleet building, investor structuring & scaling.",
                popular: false,
              },
            ].map(({ name, price, duration, Icon, desc, popular }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1.5 ${
                  popular
                    ? "border-red-200 bg-white shadow-[0_20px_60px_rgba(220,38,38,0.08)]"
                    : "border-zinc-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                }`}
              >
                {popular && (
                  <div className="absolute right-5 top-5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Most Popular
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10">
                  <Icon size={22} className="text-red-600" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-zinc-950">{name}</h3>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  {duration}
                </p>
                <p className="mt-3 text-4xl font-black text-zinc-950">{price}</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-500">{desc}</p>
                <Link
                  href="/consulting"
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all duration-300 ${
                    popular
                      ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_24px_rgba(220,38,38,0.3)]"
                      : "bg-zinc-950 text-white hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.3)]"
                  }`}
                >
                  Learn More
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-red-600/6 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-zinc-900/4 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600">
            Get Started
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
            Ready to Hit the Road?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-500">
            Reserve your dream vehicle today and experience luxury, reliability,
            and exceptional service.
          </p>
          <Link
            href="/cars"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)]"
          >
            Explore Vehicles
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ── INPUTS ───────────────────────────────── */

function GlassInput({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={15} />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-200 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 ${
          Icon ? "pl-11 pr-4" : "px-4"
        }`}
      />
    </div>
  );
}

function GlassSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          {label}
        </label>
      )}
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={15} />
        <select
          value={value}
          onChange={onChange}
          className={`h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 ${
            value ? "text-white" : "text-zinc-500"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-zinc-900 text-white">
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FeatureSpec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-zinc-50 px-3 py-3 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-red-600/10 text-red-600">
        {icon}
      </div>
      <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-zinc-900">{value}</p>
    </div>
  );
}
