"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SHELL_HIDDEN = ["/login", "/dashboard", "/hoster", "/profile", "/admin"];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Cars", href: "/cars" },
  { name: "Consulting", href: "/consulting" },
  { name: "FAQs", href: "/faqs" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

type PortalUser = { firstName: string; role: string } | null;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalUser, setPortalUser] = useState<PortalUser>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const hidden = SHELL_HIDDEN.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (hidden) return;
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hidden]);

  useEffect(() => {
    if (hidden) return;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPortalUser({ firstName: data.firstName, role: data.role });
      })
      .catch(() => {});
  }, [hidden]);

  if (hidden) return null;

  async function handlePortalLogout() {
    await fetch("/api/auth/logout", { method: "DELETE" });
    setPortalUser(null);
    setUserMenuOpen(false);
  }

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
              href="/list-your-car"
              className="hidden rounded-full border border-zinc-300 px-5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-all duration-300 hover:border-red-500 hover:text-red-600 md:inline-flex"
            >
              List Your Car
            </Link>
            <Link
              href="/booking?from=nav"
              className="hidden rounded-full bg-zinc-950 px-6 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)] md:inline-flex"
            >
              Book Now
            </Link>

            {/* Portal user menu */}
            {portalUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-2 text-[13px] font-semibold text-zinc-700 transition-all duration-200 hover:border-red-300 hover:text-red-600"
                >
                  <div className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center">
                    <User size={11} className="text-red-500" />
                  </div>
                  {portalUser.firstName}
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-900">{portalUser.firstName}</p>
                        <p className="text-[10px] text-zinc-400 capitalize">{portalUser.role}</p>
                      </div>
                      <Link
                        href={portalUser.role === "hoster" ? "/hoster" : "/dashboard"}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-red-600 transition-colors"
                      >
                        {portalUser.role === "hoster" ? <Car size={14} /> : <LayoutDashboard size={14} />}
                        {portalUser.role === "hoster" ? "Hoster Dashboard" : "My Dashboard"}
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-red-600 transition-colors"
                      >
                        <User size={14} />
                        Profile & Settings
                      </Link>
                      <div className="border-t border-zinc-100">
                        <button
                          onClick={handlePortalLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-zinc-300 px-4 py-2.5 text-[13px] font-semibold text-zinc-700 transition-all duration-200 hover:border-red-300 hover:text-red-600 md:flex"
              >
                <User size={13} />
                Sign In
              </Link>
            )}

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
                className="flex flex-col gap-3"
              >
                {portalUser ? (
                  <>
                    <Link
                      href={portalUser.role === "hoster" ? "/hoster" : "/dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-4 text-base font-semibold text-white transition-all hover:border-red-500/50 hover:text-red-400"
                    >
                      {portalUser.role === "hoster" ? <Car size={16} /> : <LayoutDashboard size={16} />}
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => { handlePortalLogout(); setMobileOpen(false); }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-4 text-base font-semibold text-zinc-400 transition-all hover:text-white"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-4 text-base font-semibold text-white transition-all hover:border-red-500/50 hover:text-red-400"
                    >
                      <User size={16} />
                      Sign In
                    </Link>
                    <Link
                      href="/list-your-car"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center rounded-2xl border border-white/10 py-3 text-sm font-semibold text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200"
                    >
                      List Your Car
                    </Link>
                  </>
                )}
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
