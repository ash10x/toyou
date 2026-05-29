"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

type BusinessInfo = {
  phone: string | null;
  email: string | null;
  address: string | null;
  hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  maps_embed_url: string | null;
} | null;

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Cars", href: "/cars" },
  { name: "FAQs", href: "/faqs" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

export default function Footer({ businessInfo }: { businessInfo: BusinessInfo }) {
  const phone = businessInfo?.phone ?? null;
  const email = businessInfo?.email ?? null;
  const address = businessInfo?.address ?? null;

  const socials = [
    businessInfo?.facebook_url
      ? { icon: FaFacebookF, href: businessInfo.facebook_url }
      : null,
    businessInfo?.instagram_url
      ? { icon: FaInstagram, href: businessInfo.instagram_url }
      : null,
    businessInfo?.twitter_url
      ? { icon: FaTwitter, href: businessInfo.twitter_url }
      : null,
  ].filter((s): s is { icon: typeof FaFacebookF; href: string } => s !== null);

  return (
    <footer className="relative overflow-hidden bg-zinc-950">
      {/* SUBTLE GLOW */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-red-700/[0.07] blur-3xl" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-10">
        <div className="grid gap-12 border-b border-white/[0.06] pb-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">

          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block">
              <Image
                src="/logo/logowhite.png"
                alt="ToYou Logo"
                width={140}
                height={60}
                className="h-auto w-32 opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-zinc-400">
              Experience premium vehicle rentals with comfort, reliability, and
              exceptional service tailored to every journey.
            </p>

            {socials.length > 0 && (
              <div className="mt-8 flex items-center gap-3">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-600 hover:text-white"
                    >
                      <Icon size={15} />
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Quick Links
            </p>
            <div className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
                >
                  <FiArrowUpRight
                    size={14}
                    className="text-zinc-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-500"
                  />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* LEGAL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Legal
            </p>
            <div className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
                >
                  <FiArrowUpRight
                    size={14}
                    className="text-zinc-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-500"
                  />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Contact
            </p>
            <div className="mt-5 space-y-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="group flex items-start gap-3 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-500 ring-1 ring-white/10">
                    <FiPhone size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">Phone</p>
                    <p className="mt-0.5 group-hover:text-white">{phone}</p>
                  </div>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-3 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-500 ring-1 ring-white/10">
                    <FiMail size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">Email</p>
                    <p className="mt-0.5 group-hover:text-white">{email}</p>
                  </div>
                </a>
              )}

              {address && (
                <div className="flex items-start gap-3 text-sm text-zinc-400">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-500 ring-1 ring-white/10">
                    <FiMapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">Location</p>
                    <p className="mt-0.5">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* NEWSLETTER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-500">
                Newsletter
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                Stay in the Loop
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                Exclusive deals, fleet updates, and rental offers — delivered to your inbox.
              </p>
            </div>

            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} ToYou Car Rentals. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">
              Privacy Policy
            </Link>
            <span className="h-3 w-px bg-zinc-800" />
            <Link href="/terms" className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
