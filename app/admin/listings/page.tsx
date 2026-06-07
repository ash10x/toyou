"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  Trash2, RotateCcw, Car, User, MapPin, Star, CreditCard,
  FileText, Camera, AlertCircle, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Listing = {
  id: number;
  reference_number: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  year: string;
  make: string;
  model: string;
  trim?: string;
  color: string;
  mileage: number;
  seats?: number | null;
  fuel?: string | null;
  body?: string | null;
  transmission?: string | null;
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
  payment_method?: string;
  bank_name?: string;
  account_holder_name?: string;
  routing_number?: string;
  account_number?: string;
  account_type?: string;
  review_expires_at: string;
  created_at: string;
};

type ActionState =
  | { type: "idle" }
  | { type: "approving"; dailyRate: string }
  | { type: "rejecting"; reason: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFirstPhotoUrl(photoFiles: string): string | null {
  if (!photoFiles) return null;
  for (const part of photoFiles.split(", ")) {
    const idx = part.indexOf(": ");
    if (idx !== -1) {
      const url = part.slice(idx + 2).trim();
      if (url.startsWith("http")) return url;
    }
  }
  return null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  approved: {
    label: "Approved",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-400",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm text-zinc-200 wrap-break-word">{value || "—"}</p>
    </div>
  );
}

function SectionHeading({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} className="text-red-400 shrink-0" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  );
}

function FeaturePill({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 bg-zinc-800 text-zinc-500"}`}>
      {label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Filter = "all" | "pending" | "approved" | "rejected";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [actions, setActions] = useState<Record<number, ActionState>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/admin/listings");
    if (res.ok) setListings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function getAction(id: number): ActionState {
    return actions[id] ?? { type: "idle" };
  }
  function setAction(id: number, action: ActionState) {
    setActions((prev) => ({ ...prev, [id]: action }));
  }

  async function confirmApprove(listing: Listing) {
    const action = getAction(listing.id);
    if (action.type !== "approving") return;
    setBusy(listing.id);
    const res = await fetch(`/api/admin/listings/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved", dailyRate: Number(action.dailyRate) || 0 }),
    });
    if (res.ok) {
      const updated = await res.json();
      setListings((l) => l.map((x) => x.id === listing.id ? { ...x, status: updated.status } : x));
      setAction(listing.id, { type: "idle" });
    }
    setBusy(null);
  }

  async function confirmReject(listing: Listing) {
    const action = getAction(listing.id);
    if (action.type !== "rejecting") return;
    setBusy(listing.id);
    const res = await fetch(`/api/admin/listings/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected", rejectionReason: action.reason }),
    });
    if (res.ok) {
      const updated = await res.json();
      setListings((l) => l.map((x) => x.id === listing.id ? { ...x, status: updated.status } : x));
      setAction(listing.id, { type: "idle" });
    }
    setBusy(null);
  }

  async function resetToPending(id: number) {
    setBusy(id);
    const res = await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setListings((l) => l.map((x) => x.id === id ? { ...x, status: updated.status } : x));
    }
    setBusy(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Permanently delete this listing?")) return;
    setDeleting(id);
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    setListings((l) => l.filter((x) => x.id !== id));
    setDeleting(null);
  }

  const counts = {
    all: listings.length,
    pending: listings.filter((l) => l.status === "pending").length,
    approved: listings.filter((l) => l.status === "approved").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
  };

  const filtered = filter === "all" ? listings : listings.filter((l) => l.status === filter);

  const TABS: { key: Filter; label: string; color: string }[] = [
    { key: "all", label: "All", color: "text-zinc-300" },
    { key: "pending", label: "Pending", color: "text-amber-400" },
    { key: "approved", label: "Approved", color: "text-emerald-400" },
    { key: "rejected", label: "Rejected", color: "text-red-400" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Host Listings</h1>
        <p className="text-zinc-500 text-sm mt-1">Review, approve, and manage vehicle listing applications</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", count: counts.all, color: "text-zinc-300", border: "border-zinc-700" },
          { label: "Pending", count: counts.pending, color: "text-amber-400", border: "border-amber-500/30" },
          { label: "Approved", count: counts.approved, color: "text-emerald-400", border: "border-emerald-500/30" },
          { label: "Rejected", count: counts.rejected, color: "text-red-400", border: "border-red-500/30" },
        ].map(({ label, count, color, border }) => (
          <div key={label} className={`rounded-xl border ${border} bg-zinc-900 px-4 py-3`}>
            <p className={`text-2xl font-black ${color}`}>{count}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-1 mb-5 border-b border-zinc-800 pb-px">
        {TABS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t transition-colors border-b-2 -mb-px ${
              filter === key
                ? `${color} border-current bg-zinc-800/50`
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === key ? "bg-zinc-700" : "bg-zinc-800"}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-12 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading listings…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 text-sm">No {filter === "all" ? "" : filter} listings.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => {
            const cfg = STATUS_CONFIG[l.status] ?? STATUS_CONFIG.pending;
            const photo = getFirstPhotoUrl(l.photo_files);
            const vehicleName = `${l.year} ${l.make} ${l.model}${l.trim ? ` ${l.trim}` : ""}`;
            const action = getAction(l.id);
            const isBusy = busy === l.id;
            const isExpanded = expanded === l.id;

            return (
              <div
                key={l.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden transition-all"
              >
                {/* ── Card row ── */}
                <div className="p-4 sm:p-5">
                  <div className="flex gap-4">
                    {/* Photo thumbnail */}
                    <div className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden bg-zinc-800 hidden sm:block">
                      {photo ? (
                        <Image src={photo} alt={vehicleName} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car size={22} className="text-zinc-600" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-white font-bold text-base leading-tight">
                              {vehicleName}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${cfg.badge}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{l.reference_number} · Submitted {formatDate(l.created_at)}</p>
                          <p className="text-sm text-zinc-400 mt-1.5">
                            {l.first_name} {l.last_name}
                            <span className="mx-1.5 text-zinc-700">·</span>
                            {l.email}
                            <span className="mx-1.5 text-zinc-700">·</span>
                            {l.phone}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {l.city}, {l.state} · {l.color} · {l.mileage.toLocaleString()} mi · {l.vehicle_condition}
                            {l.body && <> · {l.body}</>}
                            {l.transmission && <> · {l.transmission}</>}
                            {l.seats && <> · {l.seats} seats</>}
                            {l.fuel && <> · {l.fuel}</>}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          {l.status === "pending" && action.type === "idle" && (
                            <>
                              <button
                                onClick={() => setAction(l.id, { type: "approving", dailyRate: "" })}
                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <CheckCircle2 size={13} /> Approve
                              </button>
                              <button
                                onClick={() => setAction(l.id, { type: "rejecting", reason: "" })}
                                className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </>
                          )}
                          {l.status !== "pending" && (
                            <button
                              onClick={() => resetToPending(l.id)}
                              disabled={isBusy}
                              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <RotateCcw size={12} /> Reset
                            </button>
                          )}
                          <button
                            onClick={() => setExpanded(isExpanded ? null : l.id)}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            {isExpanded ? "Hide" : "Details"}
                          </button>
                          <button
                            onClick={() => handleDelete(l.id)}
                            disabled={deleting === l.id}
                            className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-40 rounded-lg hover:bg-zinc-800"
                          >
                            {deleting === l.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* ── Inline Approve form ── */}
                      {action.type === "approving" && (
                        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                          <p className="text-sm font-semibold text-emerald-400 mb-3">
                            Set Daily Rate to Approve
                          </p>
                          <p className="text-xs text-zinc-500 mb-3">
                            This vehicle will be added to the car fleet at this daily rate, including its body type, transmission, seats, and fuel type. You can edit it later in the Cars section.
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                              <input
                                type="number"
                                min={0}
                                placeholder="0"
                                value={action.dailyRate}
                                onChange={(e) => setAction(l.id, { ...action, dailyRate: e.target.value })}
                                className="w-28 rounded-lg border border-zinc-700 bg-zinc-800 pl-7 pr-3 py-2 text-sm text-white outline-none focus:border-emerald-500/60 transition-colors"
                              />
                            </div>
                            <span className="text-xs text-zinc-500">/day</span>
                            <button
                              onClick={() => confirmApprove(l)}
                              disabled={isBusy}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isBusy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                              Confirm Approval
                            </button>
                            <button
                              onClick={() => setAction(l.id, { type: "idle" })}
                              className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-2 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Inline Reject form ── */}
                      {action.type === "rejecting" && (
                        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                          <p className="text-sm font-semibold text-red-400 mb-3">Reject Listing</p>
                          <p className="text-xs text-zinc-500 mb-3">
                            A rejection email will be sent to the host. Adding a reason is optional but helpful.
                          </p>
                          <textarea
                            rows={2}
                            placeholder="Reason for rejection (optional)…"
                            value={action.reason}
                            onChange={(e) => setAction(l.id, { ...action, reason: e.target.value })}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500/50 transition-colors resize-none mb-3"
                          />
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => confirmReject(l)}
                              disabled={isBusy}
                              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isBusy ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => setAction(l.id, { type: "idle" })}
                              className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-2 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Expanded details ── */}
                {isExpanded && (
                  <div className="border-t border-zinc-800 bg-zinc-900/60 px-4 sm:px-6 py-5 space-y-6">

                    {/* Owner */}
                    <div>
                      <SectionHeading icon={User} label="Owner Information" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <DetailRow label="Full Name" value={`${l.first_name} ${l.last_name}`} />
                        <DetailRow label="Email" value={l.email} />
                        <DetailRow label="Phone" value={l.phone} />
                        <DetailRow label="Location" value={`${l.city}, ${l.state}`} />
                      </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Vehicle */}
                    <div>
                      <SectionHeading icon={Car} label="Vehicle Details" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <DetailRow label="Year / Make / Model" value={vehicleName} />
                        <DetailRow label="Color" value={l.color} />
                        <DetailRow label="Body Type" value={l.body} />
                        <DetailRow label="Transmission" value={l.transmission} />
                        <DetailRow label="Seats" value={l.seats != null ? String(l.seats) : null} />
                        <DetailRow label="Fuel Type" value={l.fuel} />
                        <DetailRow label="VIN" value={l.vin} />
                        <DetailRow label="Plate" value={l.license_plate} />
                        <DetailRow label="Mileage" value={`${l.mileage.toLocaleString()} mi`} />
                        <DetailRow label="Title Status" value={l.title_status} />
                        <DetailRow label="Accident History" value={l.accident_history} />
                        <DetailRow label="Condition" value={l.vehicle_condition} />
                        {l.has_mechanical_issues && (
                          <div className="col-span-full">
                            <DetailRow
                              label="Mechanical Issues"
                              value={
                                <span className="flex items-start gap-1.5 text-amber-400">
                                  <AlertCircle size={13} className="mt-0.5 shrink-0" />
                                  {l.mechanical_issues_description || "Yes (no description)"}
                                </span>
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Features */}
                    <div>
                      <SectionHeading icon={Star} label="Features & Goals" />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { label: "GPS", active: l.has_gps },
                          { label: "Apple CarPlay", active: l.has_carplay },
                          { label: "Android Auto", active: l.has_android_auto },
                          { label: "Backup Camera", active: l.has_backup_camera },
                          { label: "Leather Seats", active: l.has_leather_seats },
                          { label: "Sunroof", active: l.has_sunroof },
                          { label: "3rd Row", active: l.has_third_row },
                        ].map(({ label, active }) => (
                          <FeaturePill key={label} label={label} active={active} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <DetailRow label="Listing Reason" value={l.listing_reason} />
                        <DetailRow label="Usage Frequency" value={l.usage_frequency} />
                        <DetailRow label="Available Days / Month" value={l.available_days_per_month} />
                        {l.fleet_interest && <DetailRow label="Fleet Interest" value={l.fleet_interest} />}
                      </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Location */}
                    <div>
                      <SectionHeading icon={MapPin} label="Pickup Location" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <DetailRow label="Type" value={l.pickup_location_type} />
                        <DetailRow label="Address" value={l.street_address} />
                        <DetailRow label="ZIP" value={l.location_zip} />
                      </div>
                    </div>

                    {/* Payment */}
                    {l.account_holder_name && (
                      <>
                        <div className="h-px bg-zinc-800" />
                        <div>
                          <SectionHeading icon={CreditCard} label="Payment Details" />
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <DetailRow label="Account Holder" value={l.account_holder_name} />
                            <DetailRow label="Bank" value={l.bank_name} />
                            <DetailRow label="Account Type" value={l.account_type} />
                            <DetailRow label="Routing Number" value={l.routing_number ? `••••${l.routing_number.slice(-4)}` : undefined} />
                            <DetailRow label="Account Number" value={l.account_number ? `••••${l.account_number.slice(-4)}` : undefined} />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Photos */}
                    {l.photo_files && (
                      <>
                        <div className="h-px bg-zinc-800" />
                        <div>
                          <SectionHeading icon={Camera} label="Photos" />
                          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                            {l.photo_files.split(", ").map((part, idx) => {
                              const colonIdx = part.indexOf(": ");
                              if (colonIdx === -1) return null;
                              const photoLabel = part.slice(0, colonIdx);
                              const url = part.slice(colonIdx + 2).trim();
                              if (!url.startsWith("http")) return null;
                              return (
                                <a key={idx} href={url} target="_blank" rel="noreferrer" className="group relative block">
                                  <div className="relative h-16 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 group-hover:border-zinc-500 transition-colors">
                                    <Image src={url} alt={photoLabel} fill className="object-cover" />
                                  </div>
                                  <p className="mt-1 text-[9px] text-zinc-600 text-center truncate">{photoLabel}</p>
                                </a>
                              );
                            }).filter(Boolean)}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Documents */}
                    {l.document_files && (
                      <>
                        <div className="h-px bg-zinc-800" />
                        <div>
                          <SectionHeading icon={FileText} label="Documents" />
                          <div className="flex flex-wrap gap-2">
                            {l.document_files.split(", ").map((part, idx) => {
                              const colonIdx = part.indexOf(": ");
                              if (colonIdx === -1) return null;
                              const docLabel = part.slice(0, colonIdx);
                              const url = part.slice(colonIdx + 2).trim();
                              if (!url.startsWith("http")) return null;
                              return (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
                                >
                                  <FileText size={12} />
                                  {docLabel}
                                </a>
                              );
                            }).filter(Boolean)}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-600 pt-1 border-t border-zinc-800">
                      <span>Submitted: {formatDate(l.created_at)}</span>
                      <span>Review deadline: {formatDate(l.review_expires_at)}</span>
                      <span>Status: <span className={STATUS_CONFIG[l.status]?.badge.split(" ")[1] ?? "text-zinc-400"}>{l.status}</span></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
