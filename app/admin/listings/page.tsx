"use client";

import { useEffect, useState } from "react";

type Listing = {
  id: number;
  reference_number: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  year: string;
  make: string;
  model: string;
  trim?: string;
  color: string;
  mileage: number;
  vin: string;
  license_plate: string;
  title_status: string;
  accident_history: string;
  vehicle_condition: string;
  has_mechanical_issues: boolean;
  mechanical_issues_description?: string;
  photo_files: string;
  document_files: string;
  listing_reason: string;
  usage_frequency: string;
  available_days_per_month: string;
  pickup_location_type: string;
  street_address: string;
  location_zip: string;
  has_gps: boolean;
  has_carplay: boolean;
  has_android_auto: boolean;
  has_backup_camera: boolean;
  has_leather_seats: boolean;
  has_sunroof: boolean;
  has_third_row: boolean;
  fleet_interest?: string;
  review_expires_at: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/admin/listings");
    if (res.ok) setListings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleStatus(id: number, status: string) {
    setUpdating(id);
    const res = await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setListings((l) => l.map((x) => (x.id === id ? { ...x, status: updated.status } : x)));
    }
    setUpdating(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this listing permanently?")) return;
    setDeleting(id);
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    setListings((l) => l.filter((x) => x.id !== id));
    setDeleting(null);
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Host Listings</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {loading ? "Loading…" : `${listings.length} total`}
        </p>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : listings.length === 0 ? (
        <div className="text-zinc-500 text-sm">No listings yet.</div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <div key={l.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* Card header */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {l.year} {l.make} {l.model}{l.trim ? ` ${l.trim}` : ""}
                      </span>
                      <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[l.status] ?? "bg-zinc-700 text-zinc-300 border-zinc-600"}`}>
                        {l.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{l.reference_number}</div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {l.first_name} {l.last_name} · {l.email}
                    </div>
                    <div className="text-sm text-zinc-500">{l.phone}</div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {l.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatus(l.id, "approved")}
                          disabled={updating === l.id}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatus(l.id, "rejected")}
                          disabled={updating === l.id}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {l.status !== "pending" && (
                      <button
                        onClick={() => handleStatus(l.id, "pending")}
                        disabled={updating === l.id}
                        className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                      className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      {expanded === l.id ? "Hide" : "Details"}
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
                      disabled={deleting === l.id}
                      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 px-2 py-1.5"
                    >
                      {deleting === l.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === l.id && (
                <div className="border-t border-zinc-800 px-4 sm:px-5 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3 text-sm">
                  <Detail label="Color" value={l.color} />
                  <Detail label="VIN" value={l.vin} />
                  <Detail label="Plate" value={l.license_plate} />
                  <Detail label="Mileage" value={`${l.mileage.toLocaleString()} mi`} />
                  <Detail label="Title" value={l.title_status} />
                  <Detail label="Accidents" value={l.accident_history} />
                  <Detail label="Condition" value={l.vehicle_condition} />
                  <Detail label="Mechanical" value={l.has_mechanical_issues ? (l.mechanical_issues_description || "Yes") : "None"} />
                  <Detail label="Reason" value={l.listing_reason} />
                  <Detail label="Availability" value={`${l.available_days_per_month} days/mo`} />
                  <Detail label="Pickup" value={l.pickup_location_type} />
                  <Detail label="Address" value={`${l.street_address}, ${l.location_zip}`} />
                  <div className="col-span-full">
                    <span className="text-zinc-500 text-xs">Features: </span>
                    <span className="text-zinc-300 text-xs">
                      {[
                        l.has_gps && "GPS",
                        l.has_carplay && "CarPlay",
                        l.has_android_auto && "Android Auto",
                        l.has_backup_camera && "Backup Camera",
                        l.has_leather_seats && "Leather Seats",
                        l.has_sunroof && "Sunroof",
                        l.has_third_row && "3rd Row",
                      ].filter(Boolean).join(", ") || "None"}
                    </span>
                  </div>
                  {l.photo_files && (
                    <div className="col-span-full">
                      <span className="text-zinc-500 text-xs">Photos: </span>
                      <span className="text-zinc-300 text-xs break-all">{l.photo_files}</span>
                    </div>
                  )}
                  {l.document_files && (
                    <div className="col-span-full">
                      <span className="text-zinc-500 text-xs">Docs: </span>
                      <span className="text-zinc-300 text-xs break-all">{l.document_files}</span>
                    </div>
                  )}
                  <Detail label="Expires" value={new Date(l.review_expires_at).toLocaleDateString()} />
                  <Detail label="Submitted" value={new Date(l.created_at).toLocaleDateString()} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-zinc-200 text-xs sm:text-sm mt-0.5 wrap-break-word">{value}</div>
    </div>
  );
}
