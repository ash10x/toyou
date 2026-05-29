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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-zinc-100 bg-white/95 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-2xl"
            : "border-b border-transparent bg-white/80 py-5 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* LOGO */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <Image
              src="/logo/logo.png"
              alt="ToYou Logo"
              width={130}
              height={50}
              priority
              className={`h-auto transition-all duration-300 ${scrolled ? "w-24" : "w-32"}`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={link.href}
                  className="group relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700 transition-colors duration-200 hover:text-red-600"
                >
                  {link.name}
                  <span className="absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 rounded-full bg-red-600 transition-all duration-300 group-hover:w-3/4" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <Link
              href="/booking?from=nav"
              className="hidden rounded-full bg-zinc-950 px-6 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)] md:inline-flex"
            >
              Book Now
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-all duration-200 hover:border-red-200 hover:text-red-600 md:hidden"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
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
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-zinc-950 md:hidden"
          >
            <div className="relative flex h-full flex-col justify-between px-8 pb-12 pt-28">
              {/* NAV LINKS */}
              <nav className="space-y-0">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between border-b border-white/[0.07] py-5 text-[2rem] font-black tracking-tighter text-white transition-colors duration-200 hover:text-red-500"
                    >
                      <span>{link.name}</span>
                      <span className="text-2xl text-zinc-600 transition-colors group-hover:text-red-500">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* MOBILE CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/booking?from=nav"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-2xl bg-red-600 py-4 text-base font-semibold text-white transition-all hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
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
