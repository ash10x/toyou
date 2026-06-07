"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Pencil, Trash2, Loader2, Star, Car, Plus, X, Check,
  Search, SlidersHorizontal,
} from "lucide-react";

type Car = {
  id: number;
  name: string;
  image: string;
  price: number;
  seats?: number | null;
  fuel?: string | null;
  body?: string | null;
  transmission?: string | null;
  featured: boolean;
};

const EMPTY_FORM = {
  name: "", image: "", price: "", seats: "", fuel: "", body: "", transmission: "", featured: false,
};

const FUEL_OPTIONS = ["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
const BODY_OPTIONS = ["Sedan", "SUV", "Truck", "Coupe", "Convertible", "Van", "Hatchback", "Wagon"];
const SEAT_OPTIONS = ["2", "4", "5", "6", "7", "8"];

const inputCls =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500 transition-colors";
const selectCls =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-red-500 transition-colors";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Search & filter state
  const [search, setSearch] = useState("");
  const [filterBody, setFilterBody] = useState("");
  const [filterTransmission, setFilterTransmission] = useState("");
  const [filterFuel, setFilterFuel] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cars.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (filterBody && c.body !== filterBody) return false;
      if (filterTransmission && c.transmission !== filterTransmission) return false;
      if (filterFuel && c.fuel !== filterFuel) return false;
      if (filterFeatured === "yes" && !c.featured) return false;
      if (filterFeatured === "no" && c.featured) return false;
      return true;
    });
  }, [cars, search, filterBody, filterTransmission, filterFuel, filterFeatured]);

  const hasFilters = !!(search || filterBody || filterTransmission || filterFuel || filterFeatured);

  function clearFilters() {
    setSearch(""); setFilterBody(""); setFilterTransmission("");
    setFilterFuel(""); setFilterFeatured("");
  }

  async function load() {
    const res = await fetch("/api/admin/cars");
    if (res.ok) setCars(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    if (showModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  function openEdit(car: Car) {
    setEditing(car.id);
    setForm({
      name: car.name,
      image: car.image,
      price: String(car.price),
      seats: car.seats != null ? String(car.seats) : "",
      fuel: car.fuel ?? "",
      body: car.body ?? "",
      transmission: car.transmission ?? "",
      featured: car.featured,
    });
    setShowModal(true);
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      image: form.image,
      price: Number(form.price),
      seats: form.seats ? Number(form.seats) : undefined,
      fuel: form.fuel || undefined,
      body: form.body || undefined,
      transmission: form.transmission || undefined,
      featured: form.featured,
    };

    if (editing) {
      const res = await fetch(`/api/admin/cars/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setCars((c) => c.map((x) => (x.id === editing ? updated : x)));
      }
    } else {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setCars((c) => [...c, created]);
      }
    }
    closeModal();
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this vehicle permanently?")) return;
    setDeleting(id);
    await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
    setCars((c) => c.filter((x) => x.id !== id));
    setDeleting(null);
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl">

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Panel */}
          <div
            ref={modalRef}
            className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Car size={16} className="text-red-500" />
                {editing ? "Edit Vehicle" : "Add Vehicle"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Vehicle Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. 2023 Toyota Camry SE"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Image URL *</label>
                <input
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className={inputCls}
                  placeholder="https://res.cloudinary.com/…"
                />
                {form.image && (form.image.startsWith("/") || form.image.startsWith("http")) && (
                  <div className="relative mt-2 h-28 w-full rounded-lg overflow-hidden bg-zinc-800">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Price / day (USD) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputCls}
                    placeholder="79"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Seats</label>
                  <select
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">— select —</option>
                    {SEAT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Body Type</label>
                  <select
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">— select —</option>
                    {BODY_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Transmission</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">— select —</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Fuel Type</label>
                <select
                  value={form.fuel}
                  onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                  className={selectCls}
                >
                  <option value="">— select —</option>
                  {FUEL_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-red-500 w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm text-zinc-300 cursor-pointer">
                  Featured on homepage
                </label>
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {saving ? "Saving…" : editing ? "Save Changes" : "Add Vehicle"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Fleet</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading…" : `${cars.length} vehicle${cars.length !== 1 ? "s" : ""} in fleet`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> Add Vehicle
        </button>
      </div>

      {/* ── Search & Filters ── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search vehicles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={13} className="text-zinc-500 shrink-0" />

          <select value={filterBody} onChange={(e) => setFilterBody(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors">
            <option value="">All Bodies</option>
            {BODY_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={filterTransmission} onChange={(e) => setFilterTransmission(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors">
            <option value="">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>

          <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors">
            <option value="">All Fuels</option>
            {FUEL_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          <select value={filterFeatured} onChange={(e) => setFilterFeatured(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors">
            <option value="">All</option>
            <option value="yes">Featured</option>
            <option value="no">Not Featured</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-zinc-800">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-12 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading fleet…
        </div>
      ) : cars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 py-20 text-center text-zinc-600 text-sm">
          No vehicles in fleet yet.
        </div>
      ) : (
        <>
          {hasFilters && (
            <p className="mb-3 text-xs text-zinc-500">
              {filtered.length} of {cars.length} vehicle{cars.length !== 1 ? "s" : ""} match
            </p>
          )}
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-16">Photo</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Name</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Price</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Body</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Trans.</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Seats</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fuel</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Featured</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center text-zinc-600 text-sm">
                        No vehicles match your search or filters.
                      </td>
                    </tr>
                  ) : filtered.map((car) => (
                    <tr key={car.id} className="bg-zinc-900 hover:bg-zinc-800/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="relative h-11 w-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                          {car.image ? (
                            <Image
                              src={car.image.startsWith("/") || car.image.startsWith("http") ? car.image : `/${car.image}`}
                              alt={car.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Car size={16} className="text-zinc-600" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-white">{car.name}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-bold text-emerald-400">${car.price}</span>
                        <span className="text-zinc-500 text-xs">/day</span>
                      </td>

                      <td className="px-4 py-3">
                        {car.body
                          ? <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300">{car.body}</span>
                          : <span className="text-zinc-600">—</span>}
                      </td>

                      <td className="px-4 py-3">
                        {car.transmission
                          ? <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300">{car.transmission}</span>
                          : <span className="text-zinc-600">—</span>}
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        {car.seats != null ? car.seats : <span className="text-zinc-600">—</span>}
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        {car.fuel ?? <span className="text-zinc-600">—</span>}
                      </td>

                      <td className="px-4 py-3">
                        {car.featured
                          ? <span className="flex items-center gap-1 text-[11px] font-medium text-yellow-400"><Star size={11} fill="currentColor" /> Featured</span>
                          : <span className="text-zinc-600 text-xs">—</span>}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(car)}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            disabled={deleting === car.id}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                          >
                            {deleting === car.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
