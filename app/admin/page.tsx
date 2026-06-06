import Link from "next/link";
import { getAdminStats } from "@/server/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Bookings", value: stats.bookings, href: "/admin/bookings", color: "text-blue-400" },
    {
      label: "Host Listings",
      value: stats.listings,
      href: "/admin/listings",
      color: "text-emerald-400",
      badge: stats.pendingListings > 0 ? `${stats.pendingListings} pending` : null,
    },
    { label: "Fleet Vehicles", value: stats.cars, href: "/admin/cars", color: "text-yellow-400" },
    { label: "Messages", value: stats.messages, href: "/admin/contacts", color: "text-purple-400" },
  ];

  const quickLinks = [
    { href: "/admin/bookings", label: "View Bookings" },
    { href: "/admin/listings", label: "Review Host Listings" },
    { href: "/admin/cars", label: "Manage Fleet" },
    { href: "/admin/contacts", label: "Read Messages" },
    { href: "/admin/locations", label: "Edit Locations" },
    { href: "/admin/faqs", label: "Edit FAQs" },
    { href: "/admin/business", label: "Business Info" },
    { href: "/admin/users", label: "Admin Users" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Overview of your ToYou platform</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 hover:border-zinc-700 transition-colors group"
          >
            <div className={`text-2xl sm:text-3xl font-bold ${c.color} group-hover:scale-105 transition-transform inline-block`}>
              {c.value}
            </div>
            <div className="text-zinc-400 text-xs sm:text-sm mt-1">{c.label}</div>
            {c.badge && (
              <div className="mt-2 inline-block text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {c.badge}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 sm:mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs sm:text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-2.5 transition-colors text-center"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
