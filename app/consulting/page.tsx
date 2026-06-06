"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  Clock,
  Star,
  ChevronRight,
  Car,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "6+", label: "Years of Experience" },
  { value: "25+", label: "Vehicles Co-Hosted" },
  { value: "10+", label: "Investors Worked With" },
  { value: "$100K+", label: "Vehicle Investments Assisted" },
  { value: "$50K+", label: "Monthly Peak Revenue" },
  { value: "$30K+", label: "Invested in Training" },
];

const highlights = [
  "Car rental operator since 2020",
  "6+ years of hands-on experience",
  "Co-hosted over 25 vehicles",
  "Worked with more than 10 investors",
  "Assisted with over $100,000 in vehicle investments",
  "Experience with economy, midsize, SUV, luxury, and exotic vehicles",
  "Lamborghini Urus, Bentley, Ferrari, Rolls-Royce, BMW, Mercedes-Benz and more",
  "Over $30,000 invested in mentorships, training, and business development",
  "Revenue experience exceeding $50,000 per month during peak operations",
  "GPS tracking, risk management, and asset protection experience",
  "Rideshare, delivery, long-term, airport, and corporate rental knowledge",
];

const tiers = [
  {
    name: "Discovery Call",
    price: "$99",
    duration: "15-Minute Introductory Call",
    tag: null,
    icon: Clock,
    perfectFor: [
      "Learning about the business",
      "Understanding investment requirements",
      "Determining if car rentals are right for you",
      "General industry questions",
    ],
    includes: [
      "Brief business overview",
      "Startup expectations",
      "Vehicle recommendations",
      "Q&A session",
    ],
    cta: "Book Discovery Call",
    href: "/contact?package=discovery",
  },
  {
    name: "Strategy Session",
    price: "$300",
    duration: "60-Minute One-on-One Consultation",
    tag: "Most Popular",
    icon: TrendingUp,
    perfectFor: [
      "New investors & new hosts",
      "Existing vehicle owners",
      "Business planning",
    ],
    includes: [
      "Vehicle selection strategy",
      "Revenue opportunities",
      "LLC recommendations",
      "Insurance guidance",
      "GPS tracking recommendations",
      "Risk management",
      "Market analysis",
      "Startup roadmap",
      "Live Q&A",
    ],
    cta: "Book Strategy Session",
    href: "/contact?package=strategy",
  },
  {
    name: "Investor & Fleet",
    price: "$500",
    duration: "90-Minute Advanced Consultation",
    tag: "Premium",
    icon: Users,
    perfectFor: [
      "Serious investors",
      "Fleet owners & multi-vehicle operators",
      "Entrepreneurs looking to scale",
    ],
    includes: [
      "Fleet building strategy",
      "Investor structuring",
      "Scaling systems",
      "Operations management",
      "Asset protection",
      "Revenue optimization",
      "Co-hosting opportunities",
      "Long-term growth planning",
      "Advanced Q&A",
    ],
    cta: "Book Investor Consultation",
    href: "/contact?package=investor",
  },
];

const whatYouLearn = [
  "How to choose profitable vehicles",
  "How to structure your rental business",
  "How to protect your assets",
  "How to attract quality renters",
  "How to reduce risk",
  "How to scale your fleet",
  "How to work with investors",
  "How to maximize revenue opportunities",
];

const startupIncludes = [
  "Vehicle acquisition",
  "Registration",
  "GPS tracking",
  "Business setup guidance",
  "Rental system setup",
  "Operational recommendations",
];

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsultingPage() {
  return (
    <main className="bg-zinc-950 text-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(220,38,38,0.12),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-400">
              Consulting &amp; Mentorship
            </span>
            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Consulting &amp; Mentorship
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Learn How to Build a Profitable Car Rental Business
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Whether you're purchasing your first vehicle, adding to your
              fleet, or building a full-scale rental business — our consulting
              services provide real-world experience, proven systems, and
              practical strategies to help you succeed.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact?package=strategy"
                className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-[0_4px_28px_rgba(220,38,38,0.4)]"
              >
                Book a Consultation <ArrowRight size={16} />
              </Link>
              <a
                href="#packages"
                className="flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:border-white/20 hover:text-white"
              >
                View Packages <ChevronRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] px-6 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.07} className="text-center">
              <p className="text-2xl font-black text-red-500 sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-[11px] leading-tight text-zinc-500">
                {s.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── WHY WORK WITH US ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Why Work With Us?
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              We don't teach theory. We teach real-world experience.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-600/20">
                    <Check size={11} className="text-red-400" />
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-300">
                    {h}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONSULTATION PACKAGES ── */}
      <section id="packages" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-400">
              Consultation Options
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Choose Your Package
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Select the session that best matches where you are in your
              journey.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              const isPopular = tier.tag === "Most Popular";
              const isPremium = tier.tag === "Premium";
              return (
                <FadeIn key={tier.name} delay={i * 0.1}>
                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${
                      isPopular
                        ? "border-red-500 bg-gradient-to-b from-red-950/40 to-zinc-900/80"
                        : isPremium
                          ? "border-white/20 bg-zinc-900/60"
                          : "border-white/[0.08] bg-zinc-900/40"
                    }`}
                  >
                    {tier.tag && (
                      <div
                        className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          isPopular
                            ? "bg-red-600 text-white"
                            : "border border-white/20 text-zinc-400"
                        }`}
                      >
                        {tier.tag}
                      </div>
                    )}
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15">
                      <Icon size={20} className="text-red-400" />
                    </div>
                    <h3 className="mb-1 text-xl font-bold">{tier.name}</h3>
                    <p className="mb-4 text-xs text-zinc-500">
                      {tier.duration}
                    </p>
                    <p
                      className={`mb-6 text-4xl font-black ${isPopular ? "text-red-400" : "text-white"}`}
                    >
                      {tier.price}
                    </p>

                    <div className="mb-5">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Perfect for
                      </p>
                      <ul className="space-y-2">
                        {tier.perfectFor.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2 text-sm text-zinc-400"
                          >
                            <ChevronRight
                              size={14}
                              className="mt-0.5 flex-shrink-0 text-red-500"
                            />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-8 flex-1">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Includes
                      </p>
                      <ul className="space-y-2">
                        {tier.includes.map((inc) => (
                          <li
                            key={inc}
                            className="flex items-start gap-2 text-sm text-zinc-300"
                          >
                            <span className="mt-1 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-red-600/20">
                              <Check size={9} className="text-red-400" />
                            </span>
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={tier.href}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                        isPopular
                          ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_4px_20px_rgba(220,38,38,0.4)]"
                          : "border border-white/10 text-white hover:border-red-500/50 hover:bg-red-500/5"
                      }`}
                    >
                      {tier.cta} <ArrowRight size={15} />
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STARTUP INVESTMENT ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-900 to-zinc-950">
              <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
                <div className="border-b border-white/[0.07] px-8 py-10 lg:border-b-0 lg:border-r">
                  <span className="mb-4 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-400">
                    Recommended Startup Investment
                  </span>
                  <p className="mb-2 text-sm text-zinc-500">
                    Typical beginner investment starting at approximately:
                  </p>
                  <p className="mb-4 text-6xl font-black text-white">
                    $9,800<span className="text-red-500">+</span>
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    Depending on vehicle selection and market conditions.
                  </p>
                  <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                    <div className="flex items-start gap-2">
                      <Shield
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-amber-400"
                      />
                      <p className="text-xs leading-relaxed text-amber-300">
                        We strongly recommend operating through an{" "}
                        <strong>LLC</strong> for liability protection and
                        business organization.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-8 py-10">
                  <p className="mb-5 text-sm font-semibold text-zinc-400">
                    Potential setup may include:
                  </p>
                  <ul className="space-y-3">
                    {startupIncludes.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-zinc-300"
                      >
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-600/20">
                          <Check size={11} className="text-red-400" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ── */}
      <section className="border-y border-white/[0.06] bg-white/[0.01] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              What You'll Learn
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {whatYouLearn.map((item, i) => (
              <FadeIn key={item} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-600/15 text-xs font-bold text-red-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-zinc-200">
                    {item}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-zinc-900 to-zinc-950 px-8 py-14">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(220,38,38,0.1),transparent)]" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/15">
                  <Star size={26} className="text-red-400" />
                </div>
                <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Schedule Your Consultation Today
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                  Learn the good, the bad, and the ugly of the car rental
                  business from someone who has experienced it firsthand.
                </p>
                <p className="mb-8 text-sm text-zinc-500">
                  Start with a Discovery Call or book a full Strategy Session
                  today.
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/contact?package=discovery"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/5"
                  >
                    Start with Discovery Call
                  </Link>
                  <Link
                    href="/contact?package=strategy"
                    className="flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-[0_4px_28px_rgba(220,38,38,0.4)]"
                  >
                    Book a Strategy Session <ArrowRight size={15} />
                  </Link>
                </div>
                <p className="mt-8 text-xs text-zinc-600">
                  ToYou Rentals — Building Wealth Through Vehicle Ownership
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HOST CTA ── */}
      <section className="border-t border-white/[0.06] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-8 py-10 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-800">
                <Car size={26} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold">
                  Interested in becoming a ToYou Host?
                </h3>
                <p className="text-sm text-zinc-500">
                  Already own a vehicle? List it with us and start earning. No
                  consultation needed to get started.
                </p>
              </div>
              <Link
                href="/list-your-car"
                className="flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-100"
              >
                List Your Vehicle <ArrowRight size={15} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
