"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Cars", href: "/cars" },
  { name: "FAQs", href: "/faqs" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 z-50 w-full border-b transition-all duration-500 ${
          scrolled
            ? "py-2 bg-white/90 border-black/5 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            : "py-5 bg-white/70 border-transparent backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* LOGO */}
          <Link href="/" className="group relative">
            <Image
              src="/logo/logo.png"
              alt="ToYou Logo"
              width={130}
              height={50}
              priority
              className={`h-auto transition-all duration-300 ${
                scrolled ? "w-25" : "w-32.5"
              }`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="group relative rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:text-red-600"
                >
                  {link.name}

                  {/* Underline Animation */}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-red-600 transition-all duration-300 group-hover:w-4/5" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* BOOK BUTTON */}
            <Link
              href="/booking"
              className="hidden rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.45)] md:inline-flex"
            >
              Book Now
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black backdrop-blur-md transition-all duration-300 hover:border-red-600 hover:text-red-500 md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-gradient-to-br from-black via-zinc-950 to-red-950 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-full flex-col justify-center px-8">
              {/* MOBILE LINKS */}
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between border-b border-white/10 py-5 text-3xl font-semibold tracking-wide text-white transition-all duration-300 hover:text-red-500"
                    >
                      {link.name}

                      <span className="h-[2px] w-0 rounded-full bg-red-600 transition-all duration-300 group-hover:w-10" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* MOBILE CTA */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/booking"
                  onClick={() => setMobileOpen(false)}
                  className="mt-10 flex items-center justify-center rounded-2xl bg-red-600 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.45)]"
                >
                  Book Your Ride
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
