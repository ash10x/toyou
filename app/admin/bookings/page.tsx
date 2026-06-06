"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  car_id: number;
  full_name: string;
  email: string;
  phone: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
  created_at: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/admin/bookings");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this booking permanently?")) return;
    setDeleting(id);
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setBookings((b) => b.filter((x) => x.id !== id));
    setDeleting(null);
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Bookings</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {loading ? "Loading…" : `${bookings.length} total`}
        </p>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : bookings.length === 0 ? (
        <div className="text-zinc-500 text-sm">No bookings yet.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  {["ID", "Name", "Email", "Phone", "Pickup", "Drop-off", "Dates", "Price", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {bookings.map((b) => (
                  <tr key={b.id} className="bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                    <td className="px-4 py-3 text-zinc-500">#{b.id}</td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{b.full_name}</td>
                    <td className="px-4 py-3 text-zinc-300">{b.email}</td>
                    <td className="px-4 py-3 text-zinc-300">{b.phone}</td>
                    <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{b.pickup_location}</td>
                    <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{b.dropoff_location}</td>
                    <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                      {b.pickup_date} → {b.dropoff_date}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">${b.total_price}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(b.id)}
                        disabled={deleting === b.id}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        {deleting === b.id ? "…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="lg:hidden space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="font-semibold text-white">{b.full_name}</div>
                    <div className="text-xs text-zinc-500">#{b.id}</div>
                  </div>
                  <div className="text-emerald-400 font-bold text-lg shrink-0">${b.total_price}</div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <Row label="Email" value={b.email} />
                  <Row label="Phone" value={b.phone} />
                  <Row label="Pickup" value={b.pickup_location} />
                  <Row label="Drop-off" value={b.dropoff_location} />
                  <Row label="Dates" value={`${b.pickup_date} → ${b.dropoff_date}`} />
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deleting === b.id}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    {deleting === b.id ? "Deleting…" : "Delete booking"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-zinc-500 shrink-0 w-16">{label}</span>
      <span className="text-zinc-300 break-all">{value}</span>
    </div>
  );
}
