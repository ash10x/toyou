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
    <footer className="relative overflow-hidden bg-black">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-red-700/10 blur-3xl" />
      </div>

      {/* MAIN FOOTER */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
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
                className="h-auto w-35 transition-all duration-300"
              />
            </Link>

            <p className="mt-6 max-w-sm leading-relaxed text-gray-400">
              Experience premium vehicle rentals with comfort, reliability, and
              exceptional customer service tailored to your journey.
            </p>

            {/* SOCIALS */}
            {socials.length > 0 && (
              <div className="mt-8 flex items-center gap-4">
                {socials.map((social, index) => {
                  const Icon = social.icon;

                  return (
                    <Link
                      key={index}
                      href={social.href}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:bg-red-600"
                    >
                      <Icon size={18} />
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-white">Quick Links</h3>

            <div className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 text-gray-400 transition-all duration-300 hover:text-red-500"
                >
                  <FiArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />

                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white">Legal Links</h3>

            <div className="mt-6 space-y-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 text-gray-400 transition-all duration-300 hover:text-red-500"
                >
                  <FiArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />

                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white">Contact Us</h3>

            <div className="mt-6 space-y-5">
              {/* PHONE */}
              {phone && (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/15 text-red-500">
                    <FiPhone size={18} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>

                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="mt-1 block text-white transition-colors hover:text-red-500"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {/* EMAIL */}
              {email && (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/15 text-red-500">
                    <FiMail size={18} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>

                    <a
                      href={`mailto:${email}`}
                      className="mt-1 block text-white transition-colors hover:text-red-500"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* LOCATION */}
              {address && (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/15 text-red-500">
                    <FiMapPin size={18} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Location</p>

                    <p className="mt-1 text-white">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* NEWSLETTER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-3xl font-black text-white">Stay Updated</h3>

              <p className="mt-3 max-w-xl text-gray-400">
                Subscribe to receive exclusive rental deals, offers, and updates
                from ToYou Car Rentals.
              </p>
            </div>

            <form className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 text-white outline-none backdrop-blur-xl placeholder:text-gray-500 focus:border-red-500"
              />

              <button
                type="submit"
                className="h-14 rounded-2xl bg-red-600 px-8 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.45)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

        {/* BOTTOM */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center md:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ToYou Car Rentals. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-red-500"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-red-500"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
