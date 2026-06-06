"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Car, Clock, User, ChevronRight, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";

type Session = { userId: number; email: string; role: string; firstName: string } | null;

type Booking = {
  id: number;
  car_id: number;
  full_name: string;
  email: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
  created_at: string;
};

type FeaturedCar = {
  id: number;
  name: string;
  image: string;
  price: number;
};

function StatusBadge({ pickup, dropoff }: { pickup: string; dropoff: string }) {
  const now = new Date();
  const start = new Date(pickup);
  const end = new Date(dropoff);

  if (now < start) return (
    <span className="text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">Upcoming</span>
  );
  if (now >= start && now <= end) return (
    <span className="text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">Active</span>
  );
  return (
    <span className="text-[10px] font-semibold bg-zinc-700/60 text-zinc-400 border border-zinc-700 rounded-full px-2 py-0.5">Completed</span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<FeaturedCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { router.push("/login"); return; }
        if (data.role === "hoster") { router.push("/hoster"); return; }
        setSession(data);
      });
  }, [router]);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch("/api/user/bookings").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/featured-cars").then((r) => (r.ok ? r.json() : { featured: [] })),
    ]).then(([b, c]) => {
      setBookings(Array.isArray(b) ? b : []);
      setCars(Array.isArray(c?.featured) ? c.featured : []);
      setLoading(false);
    });
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

  const upcoming = bookings.filter((b) => new Date(b.pickup_date) > new Date());
  const past = bookings.filter((b) => new Date(b.dropoff_date) < new Date());

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <img src="/logo/logo.png" alt="ToYou" className="h-8 brightness-0 invert" />
          </Link>
          <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <User size={18} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Welcome back, {session.firstName}</h1>
              <p className="text-zinc-500 text-sm">{session.email} · Renter</p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Total Bookings", value: bookings.length, icon: Calendar },
            { label: "Upcoming", value: upcoming.length, icon: Clock },
            { label: "Completed", value: past.length, icon: Car },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <Icon size={18} className="text-zinc-500 mb-2" />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">My Bookings</h2>
              <Link href="/booking" className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                Book a car <ChevronRight size={13} />
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                <Car size={32} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 text-sm font-medium">No bookings yet</p>
                <p className="text-zinc-600 text-xs mt-1">Book your first car to get started</p>
                <Link
                  href="/cars"
                  className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Browse Cars
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 8).map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge pickup={booking.pickup_date} dropoff={booking.dropoff_date} />
                          <span className="text-xs text-zinc-600">#{booking.id}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                          <MapPin size={11} className="text-zinc-600 shrink-0" />
                          <span className="truncate">{booking.pickup_location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <Calendar size={11} className="text-zinc-600 shrink-0" />
                          <span>
                            {new Date(booking.pickup_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            {" — "}
                            {new Date(booking.dropoff_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-white">${booking.total_price}</div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">total</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Browse cars */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Featured Cars</h2>
              <Link href="/cars" className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {cars.slice(0, 4).map((car) => (
                <Link
                  key={car.id}
                  href={`/booking?car=${car.id}`}
                  className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 hover:border-red-500/40 hover:bg-zinc-800/60 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{car.name}</p>
                    <p className="text-xs text-zinc-400">${car.price}<span className="text-zinc-600">/day</span></p>
                  </div>
                  <ChevronRight size={14} className="text-zinc-600 group-hover:text-red-400 ml-auto shrink-0 transition-colors" />
                </Link>
              ))}
              {cars.length === 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                  <p className="text-zinc-500 text-sm">No featured cars available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
