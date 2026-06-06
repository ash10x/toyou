"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car, Plus, Calendar, CheckCircle, Clock, XCircle,
  LogOut, Settings, ChevronRight, MapPin, DollarSign,
  Bell, BarChart2, User,
} from "lucide-react";
import { motion } from "framer-motion";

type Session = { userId: number; email: string; role: string; firstName: string } | null;

type Listing = {
  id: number;
  reference_number: string;
  status: string;
  year: string;
  make: string;
  model: string;
  trim?: string;
  color: string;
  city: string;
  state: string;
  mileage: number;
  photo_files: string;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Under Review", cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
    approved: { label: "Approved", cls: "bg-green-500/15 text-green-400 border-green-500/20" },
    rejected: { label: "Rejected", cls: "bg-red-500/15 text-red-400 border-red-500/20" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-zinc-700/60 text-zinc-400 border-zinc-700" };
  return (
    <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${cls}`}>{label}</span>
  );
}

function getFirstPhoto(photoFiles: string): string {
  if (!photoFiles) return "";
  for (const part of photoFiles.split(", ")) {
    const colonIdx = part.indexOf(": ");
    if (colonIdx !== -1) {
      const url = part.slice(colonIdx + 2).trim();
      if (url.startsWith("http")) return url;
    }
  }
  return "";
}

export default function HosterPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { router.push("/login"); return; }
        if (data.role === "renter") { router.push("/dashboard"); return; }
        setSession(data);
      });
  }, [router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/user/listings")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { setListings(data); setLoading(false); });
  }, [session]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "DELETE" });
    router.push("/login");
  }

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pending = listings.filter((l) => l.status === "pending");
  const approved = listings.filter((l) => l.status === "approved");
  const rejected = listings.filter((l) => l.status === "rejected");

  const steps = [
    { icon: Car, title: "List Your Vehicle", desc: "Submit your car details and photos" },
    { icon: CheckCircle, title: "Get Approved", desc: "We review and approve your listing" },
    { icon: DollarSign, title: "Earn Income", desc: "Receive payments 3 days after return" },
    { icon: BarChart2, title: "Track Everything", desc: "Monitor reservations and earnings" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <img src="/logo/logo.png" alt="ToYou" className="h-8 brightness-0 invert" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/list-your-car"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <Plus size={15} />
              Add Listing
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              <Settings size={15} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                <User size={18} className="text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Welcome, {session.firstName}</h1>
                <p className="text-zinc-500 text-sm">{session.email} · Hoster</p>
              </div>
            </div>
            <Link
              href="/list-your-car"
              className="sm:hidden flex items-center gap-1.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl transition-colors"
            >
              <Plus size={14} />
              Add
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Listings", value: listings.length, icon: Car, color: "text-zinc-400" },
            { label: "Under Review", value: pending.length, icon: Clock, color: "text-yellow-400" },
            { label: "Approved", value: approved.length, icon: CheckCircle, color: "text-green-400" },
            { label: "Rejected", value: rejected.length, icon: XCircle, color: "text-red-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <Icon size={18} className={`${color} mb-2`} />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {listings.length === 0 ? (
          /* First-time onboarding */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Car size={28} className="text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Start Earning With Your Car</h2>
              <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
                List your vehicle on ToYou and earn passive income while keeping full control.
                You set the price, availability, and pickup location.
              </p>
              <Link
                href="/list-your-car"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)]"
              >
                <Plus size={16} />
                Create Your First Listing
              </Link>
            </div>

            {/* How it works */}
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">How it works</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-red-600/10 flex items-center justify-center">
                      <Icon size={14} className="text-red-400" />
                    </div>
                    <span className="text-xs font-bold text-zinc-600">0{i + 1}</span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Listings table */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">My Listings</h2>
              <Link
                href="/list-your-car"
                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                <Plus size={13} />
                Add New
              </Link>
            </div>

            <div className="space-y-3">
              {listings.map((listing) => {
                const photo = getFirstPhoto(listing.photo_files);
                return (
                  <div
                    key={listing.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Photo */}
                      <div className="w-16 h-16 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                        {photo ? (
                          <img src={photo} alt="vehicle" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car size={20} className="text-zinc-600" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-sm font-bold text-white">
                            {listing.year} {listing.make} {listing.model}{listing.trim ? ` ${listing.trim}` : ""}
                          </span>
                          <StatusBadge status={listing.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} className="text-zinc-600" />
                            {listing.city}, {listing.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={10} className="text-zinc-600" />
                            {new Date(listing.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-1">Ref: {listing.reference_number}</div>
                      </div>

                      <ChevronRight size={16} className="text-zinc-700 shrink-0" />
                    </div>

                    {/* Status-specific notices */}
                    {listing.status === "pending" && (
                      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs text-yellow-400/80">
                        <Bell size={12} />
                        Under review — we&apos;ll notify you by email once a decision is made.
                      </div>
                    )}
                    {listing.status === "approved" && (
                      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs text-green-400/80">
                        <CheckCircle size={12} />
                        Your vehicle is live in the ToYou fleet. Payments arrive 3 days after each return.
                      </div>
                    )}
                    {listing.status === "rejected" && (
                      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs text-red-400/80">
                        <XCircle size={12} />
                        This listing was not approved. Contact support or submit a new one.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Hoster perks */}
        {listings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 grid sm:grid-cols-3 gap-4"
          >
            {[
              { icon: DollarSign, title: "Set Your Pricing", desc: "You control the daily rate for your vehicle." },
              { icon: Calendar, title: "Choose Availability", desc: "Select exactly when your car is available." },
              { icon: Bell, title: "Booking Notifications", desc: "Get notified by email for every booking." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
