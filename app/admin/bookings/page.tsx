"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  CalendarDays,
  Search,
  DollarSign,
  CheckCircle2,
  XCircle,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Car,
  ChevronDown,
  X,
} from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";

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
  status: BookingStatus;
  created_at: string;
  car_name: string | null;
  car_image: string | null;
  car_price: number | null;
  car_seats: number | null;
  car_fuel: string | null;
  car_body: string | null;
  car_transmission: string | null;
  portal_user_id: number | null;
};

const STATUS_CONFIG: Record<BookingStatus, { label: string; badge: string; dot: string; activeBg: string }> = {
  pending:   { label: "Pending",   badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",      dot: "#f59e0b", activeBg: "bg-amber-500/15 border-amber-500/40 text-amber-300" },
  confirmed: { label: "Confirmed", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",          dot: "#3b82f6", activeBg: "bg-blue-500/15 border-blue-500/40 text-blue-300" },
  active:    { label: "Active",    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "#10b981", activeBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" },
  completed: { label: "Completed", badge: "bg-zinc-700/60 text-zinc-400 border-zinc-700",             dot: "#71717a", activeBg: "bg-zinc-700 border-zinc-500 text-zinc-200" },
  cancelled: { label: "Cancelled", badge: "bg-red-500/10 text-red-400 border-red-500/20",             dot: "#ef4444", activeBg: "bg-red-500/15 border-red-500/40 text-red-300" },
};

const ALL_STATUSES: BookingStatus[] = ["pending", "confirmed", "active", "completed", "cancelled"];

function getDuration(pickup: string, dropoff: string) {
  return Math.max(1, Math.round((new Date(dropoff).getTime() - new Date(pickup).getTime()) / 86_400_000));
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function TruncatedAddress({ text, maxChars = 22 }: { text: string; maxChars?: number }) {
  const [expanded, setExpanded] = useState(false);
  const needsTrunc = text.length > maxChars;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (needsTrunc) setExpanded((v) => !v); }}
      title={needsTrunc && !expanded ? text : undefined}
      className={`text-left leading-snug transition-colors ${
        needsTrunc ? "cursor-pointer hover:text-white" : "cursor-default"
      } ${expanded ? "text-white" : ""}`}
    >
      {expanded || !needsTrunc
        ? text
        : `${text.slice(0, maxChars).trimEnd()}…`}
    </button>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, badge, dot } = STATUS_CONFIG[status] ?? STATUS_CONFIG.confirmed;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold border rounded-full px-2.5 py-1 whitespace-nowrap ${badge}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
}

function SourceBadge({ isRenter }: { isRenter: boolean }) {
  return isRenter ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold border rounded-full px-2.5 py-1 whitespace-nowrap bg-violet-500/10 text-violet-400 border-violet-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
      Portal Renter
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold border rounded-full px-2.5 py-1 whitespace-nowrap bg-zinc-700/60 text-zinc-400 border-zinc-700">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
      Fleet Guest
    </span>
  );
}

// ── Mobile status bottom-sheet ────────────────────────────────────────────────
function StatusSheet({
  booking,
  onSelect,
  onClose,
  busy,
}: {
  booking: Booking;
  onSelect: (s: BookingStatus) => void;
  onClose: () => void;
  busy: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-zinc-900 border-t border-zinc-800 rounded-t-2xl p-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Update Status</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{booking.full_name} · #{booking.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {ALL_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const current = booking.status === s;
            return (
              <button
                key={s}
                onClick={() => { onSelect(s); onClose(); }}
                disabled={current || busy}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-colors text-left disabled:cursor-default ${
                  current
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "bg-zinc-800/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white active:bg-zinc-700"
                }`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                <span className="text-sm font-medium">{cfg.label}</span>
                {current && <span className="ml-auto text-[10px] text-zinc-600 font-medium">current</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Mobile swipe card ─────────────────────────────────────────────────────────
const REVEAL = 140;

function SwipeCard({
  booking,
  onStatusChange,
  onDelete,
  busy,
}: {
  booking: Booking;
  onStatusChange: (s: BookingStatus) => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const [swiped, setSwiped] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const startX = useRef(0);
  const days = getDuration(booking.pickup_date, booking.dropoff_date);

  return (
    <>
      <div className="relative rounded-2xl border border-zinc-800 overflow-hidden">
        {/* Action panel behind */}
        <div className="absolute right-0 top-0 h-full flex" style={{ width: REVEAL }}>
          <button
            onClick={() => { setSwiped(false); setShowSheet(true); }}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
          >
            <CalendarDays size={17} />
            Status
          </button>
          {confirmDelete ? (
            <button
              onClick={onDelete}
              disabled={busy}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-red-700 text-white text-[11px] font-semibold disabled:opacity-60"
            >
              <CheckCircle2 size={17} />
              {busy ? "…" : "Confirm"}
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-[11px] font-semibold transition-colors"
            >
              <Trash2 size={17} />
              Delete
            </button>
          )}
        </div>

        {/* Card front */}
        <div
          className="bg-zinc-900 p-4 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: swiped ? `translateX(-${REVEAL}px)` : "translateX(0)" }}
          onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - startX.current;
            if (dx < -50) setSwiped(true);
            if (dx > 30) { setSwiped(false); setConfirmDelete(false); }
          }}
          onClick={() => { if (swiped) { setSwiped(false); setConfirmDelete(false); } }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center shrink-0 text-[11px] font-bold text-red-400">
                {initials(booking.full_name)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm truncate">{booking.full_name}</div>
                <div className="text-[10px] text-zinc-600">
                  #{booking.id} · {booking.car_name ?? `Car #${booking.car_id}`}
                </div>
                <div className="mt-1">
                  <SourceBadge isRenter={booking.portal_user_id !== null} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-emerald-400 font-bold">{fmtPrice(booking.total_price)}</span>
              <StatusBadge status={booking.status} />
            </div>
          </div>
          <div className="space-y-1.5 text-[12px] border-t border-zinc-800/80 pt-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <Mail size={11} className="text-zinc-600 shrink-0" />
              <span className="truncate">{booking.email}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Phone size={11} className="text-zinc-600 shrink-0" />
              {booking.phone}
            </div>
            <div className="flex items-start gap-2 text-zinc-400">
              <MapPin size={11} className="text-emerald-500 mt-0.5 shrink-0" />
              <span className="flex flex-col gap-0.5">
                  <TruncatedAddress text={booking.pickup_location} maxChars={28} />
                  <span className="text-zinc-600 text-[10px]">↓</span>
                  <TruncatedAddress text={booking.dropoff_location} maxChars={28} />
                </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <CalendarDays size={11} className="text-zinc-600 shrink-0" />
              <span>
                {fmtDate(booking.pickup_date)} – {fmtDate(booking.dropoff_date)}
                <span className="ml-2 bg-zinc-800 text-zinc-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {days}d
                </span>
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[10px] text-zinc-700">Booked {fmtDate(booking.created_at)}</span>
            <span className="text-[10px] text-zinc-700">swipe for actions →</span>
          </div>
        </div>
      </div>

      {showSheet && (
        <StatusSheet
          booking={booking}
          onSelect={onStatusChange}
          onClose={() => setShowSheet(false)}
          busy={busy}
        />
      )}
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { setBookings(data); setLoading(false); });
  }, []);

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
    setConfirmDeleteId(null);
  }

  async function patchStatus(id: number, status: BookingStatus) {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      }
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  }

  async function deleteBooking(id: number) {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setExpandedId(null);
      setConfirmDeleteId(null);
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  }

  const stats = useMemo(() => ({
    total: bookings.length,
    revenue: bookings.reduce((s, b) => s + Number(b.total_price), 0),
    active: bookings.filter((b) => b.status === "active").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  const filtered = useMemo(() => bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${b.full_name} ${b.email} ${b.phone}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  }), [bookings, search, statusFilter]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarDays size={20} className="text-red-500" />
          Bookings
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {loading ? "Loading…" : `${bookings.length} total reservation${bookings.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Bookings", value: stats.total,             icon: CalendarDays, sub: "all time" },
          { label: "Total Revenue",  value: fmtPrice(stats.revenue), icon: DollarSign,   sub: "all time" },
          { label: "Active Now",     value: stats.active,            icon: CheckCircle2, sub: "in progress" },
          { label: "Cancelled",      value: stats.cancelled,         icon: XCircle,      sub: "all time" },
        ].map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <Icon size={16} className="text-zinc-500 mb-2" />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
            <div className="text-[10px] text-zinc-700 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-red-600 text-white"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-zinc-500 text-sm">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <CalendarDays size={28} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">
            {search || statusFilter !== "all" ? "No bookings match your filters." : "No bookings yet."}
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div className="hidden lg:block overflow-x-auto no-scrollbar rounded-2xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  {["Customer", "Vehicle", "Route", "Dates", "Status", "Price", "Booked", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const days = getDuration(b.pickup_date, b.dropoff_date);
                  const expanded = expandedId === b.id;
                  const isBusy = !!busy[b.id];

                  return (
                    <>
                      {/* Main row */}
                      <tr
                        key={b.id}
                        onClick={() => toggleExpand(b.id)}
                        className={`cursor-pointer transition-colors border-b border-zinc-800/60 ${
                          expanded
                            ? "bg-zinc-800/60"
                            : "bg-zinc-900/40 hover:bg-zinc-900/80"
                        }`}
                      >
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center shrink-0 text-[11px] font-bold text-red-400">
                              {initials(b.full_name)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white text-[13px] whitespace-nowrap">{b.full_name}</div>
                              <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">{b.email}</div>
                              <div className="text-[11px] text-zinc-600">{b.phone}</div>
                              <div className="mt-1.5">
                                <SourceBadge isRenter={b.portal_user_id !== null} />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            {b.car_image ? (
                              <img
                                src={b.car_image}
                                alt={b.car_name ?? ""}
                                className="w-10 h-7 rounded object-cover bg-zinc-800 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-7 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                                <Car size={13} className="text-zinc-600" />
                              </div>
                            )}
                            <div>
                              <div className="text-[12px] font-semibold text-white whitespace-nowrap">
                                {b.car_name ?? `Car #${b.car_id}`}
                              </div>
                              <div className="text-[10px] text-zinc-600">#{b.car_id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Route */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-start gap-1.5 text-[12px] text-zinc-300">
                              <MapPin size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                              <TruncatedAddress text={b.pickup_location} />
                            </div>
                            <div className="flex items-start gap-1.5 text-[12px] text-zinc-500">
                              <MapPin size={11} className="text-red-500 shrink-0 mt-0.5" />
                              <TruncatedAddress text={b.dropoff_location} />
                            </div>
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="px-5 py-4">
                          <div className="text-[12px] text-zinc-300 whitespace-nowrap">{fmtDate(b.pickup_date)}</div>
                          <div className="text-[12px] text-zinc-500 whitespace-nowrap">{fmtDate(b.dropoff_date)}</div>
                          <span className="mt-1 inline-block bg-zinc-800 text-zinc-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {days}d
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge status={b.status ?? "confirmed"} />
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <span className="text-emerald-400 font-bold text-[13px]">{fmtPrice(b.total_price)}</span>
                        </td>

                        {/* Booked */}
                        <td className="px-5 py-4 text-[11px] text-zinc-600 whitespace-nowrap">
                          {fmtDate(b.created_at)}
                        </td>

                        {/* Expand toggle */}
                        <td className="px-5 py-4">
                          <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                            expanded ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                          }`}>
                            <ChevronDown
                              size={15}
                              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                            />
                          </div>
                        </td>
                      </tr>

                      {/* Expanded action panel */}
                      <tr key={`${b.id}-expanded`} className={expanded ? "bg-zinc-800/30" : ""}>
                        <td colSpan={8} className="px-0 py-0">
                          <div
                            style={{
                              maxHeight: expanded ? "320px" : "0px",
                              overflow: "hidden",
                              transition: "max-height 0.3s ease-out",
                            }}
                          >
                            <div className="px-5 py-5 border-t border-zinc-700/50">
                              <div className="flex items-start gap-6">

                                {/* Car detail card */}
                                <div className="shrink-0 w-56 bg-zinc-900 border border-zinc-700/60 rounded-xl overflow-hidden">
                                  {b.car_image ? (
                                    <img
                                      src={b.car_image}
                                      alt={b.car_name ?? ""}
                                      className="w-full h-28 object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-28 bg-zinc-800 flex items-center justify-center">
                                      <Car size={28} className="text-zinc-600" />
                                    </div>
                                  )}
                                  <div className="p-3">
                                    <p className="text-[13px] font-bold text-white truncate">
                                      {b.car_name ?? `Car #${b.car_id}`}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {b.car_body && (
                                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full capitalize">
                                          {b.car_body}
                                        </span>
                                      )}
                                      {b.car_transmission && (
                                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full capitalize">
                                          {b.car_transmission}
                                        </span>
                                      )}
                                      {b.car_fuel && (
                                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full capitalize">
                                          {b.car_fuel}
                                        </span>
                                      )}
                                      {b.car_seats && (
                                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                                          {b.car_seats} seats
                                        </span>
                                      )}
                                    </div>
                                    {b.car_price && (
                                      <p className="mt-2 text-[11px] text-zinc-500">
                                        Listed at{" "}
                                        <span className="text-emerald-400 font-semibold">
                                          ${b.car_price}/day
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Status + delete */}
                                <div className="flex-1 flex flex-col gap-5">
                                  <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
                                      Change Status
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {ALL_STATUSES.map((s) => {
                                        const cfg = STATUS_CONFIG[s];
                                        const current = b.status === s;
                                        return (
                                          <button
                                            key={s}
                                            onClick={(e) => { e.stopPropagation(); if (!current) patchStatus(b.id, s); }}
                                            disabled={current || isBusy}
                                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[12px] font-semibold transition-all duration-150 disabled:cursor-default ${
                                              current
                                                ? `${cfg.activeBg} scale-[1.03] shadow-sm`
                                                : "bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                                            }`}
                                          >
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                                            {cfg.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {confirmDeleteId === b.id ? (
                                      <>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); deleteBooking(b.id); }}
                                          disabled={isBusy}
                                          className="text-[12px] font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                                        >
                                          {isBusy ? "Deleting…" : "Confirm delete"}
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                          className="text-[12px] text-zinc-500 hover:text-zinc-300 px-2 py-2 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(b.id); }}
                                        disabled={isBusy}
                                        className="inline-flex items-center gap-2 text-[12px] text-zinc-500 hover:text-red-400 border border-zinc-700 hover:border-red-500/40 bg-zinc-800/60 hover:bg-red-500/10 px-3.5 py-2 rounded-xl transition-all"
                                      >
                                        <Trash2 size={13} />
                                        Delete booking
                                      </button>
                                    )}
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile swipe cards ── */}
          <div className="lg:hidden space-y-3">
            {filtered.map((b) => (
              <SwipeCard
                key={b.id}
                booking={b}
                onStatusChange={(s) => patchStatus(b.id, s)}
                onDelete={() => deleteBooking(b.id)}
                busy={!!busy[b.id]}
              />
            ))}
          </div>

          <p className="text-center text-xs text-zinc-700 mt-4">
            Showing {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </>
      )}
    </div>
  );
}
