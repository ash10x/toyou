"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Car, ClipboardList, LogIn, UserPlus, Check } from "lucide-react";

type Intent = "rent" | "list";

const CONTENT: Record<Intent, {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge: string;
  headline: string;
  sub: string;
  perks: string[];
  primaryLabel: string;
  secondaryLabel: string;
}> = {
  rent: {
    icon: Car,
    badge: "Renter Account Required",
    headline: "Sign in to complete your booking",
    sub: "Create a free renter account to reserve vehicles, track your bookings, and manage everything in one place.",
    perks: [
      "Instant booking confirmation",
      "Full booking history",
      "Email reminders & updates",
      "Faster checkout next time",
    ],
    primaryLabel: "Sign In",
    secondaryLabel: "Create Renter Account",
  },
  list: {
    icon: ClipboardList,
    badge: "Hoster Account Required",
    headline: "Sign in to list your vehicle",
    sub: "Create a free hoster account to submit your listing, track approvals, and start earning passive income.",
    perks: [
      "Track your listing status",
      "Receive booking notifications",
      "View your earnings history",
      "Keep full control of your car",
    ],
    primaryLabel: "Sign In",
    secondaryLabel: "Create Hoster Account",
  },
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  intent: Intent;
}

export default function AuthModal({ isOpen, onClose, intent }: AuthModalProps) {
  const c = CONTENT[intent];
  const Icon = c.icon;

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const signInHref = `/login?tab=signin&next=${intent === "rent" ? "/booking" : "/list-your-car"}`;
  const signUpHref = `/login?tab=signup&role=${intent === "rent" ? "renter" : "hoster"}&next=${intent === "rent" ? "/booking" : "/list-your-car"}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

              {/* Red glow accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
              >
                <X size={15} />
              </button>

              <div className="relative p-7">
                {/* Icon + badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-red-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
                    {c.badge}
                  </span>
                </div>

                {/* Copy */}
                <h2 className="text-xl font-bold text-white mb-2 leading-snug">
                  {c.headline}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {c.sub}
                </p>

                {/* Perks */}
                <ul className="space-y-2 mb-7">
                  {c.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <span className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-green-400" />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <Link
                    href={signInHref}
                    className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-all hover:shadow-[0_4px_20px_rgba(220,38,38,0.35)]"
                  >
                    <LogIn size={15} />
                    {c.primaryLabel}
                  </Link>
                  <Link
                    href={signUpHref}
                    className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-all"
                  >
                    <UserPlus size={15} />
                    {c.secondaryLabel}
                  </Link>
                </div>

                <p className="text-center text-[11px] text-zinc-600 mt-4">
                  Free to join · No credit card required to register
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
