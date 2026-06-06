"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Car = {
  id: number;
  name: string;
  image: string;
  price: number;
  seats?: number;
  fuel?: string;
  body?: string;
  transmission?: string;
  featured: boolean;
};

const EMPTY_FORM = {
  name: "", image: "", price: "", seats: "", fuel: "", body: "", transmission: "", featured: false,
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/cars");
    if (res.ok) setCars(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(car: Car) {
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
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
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
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated = await res.json();
        setCars((c) => c.map((x) => (x.id === editing ? updated : x)));
      }
    } else {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const created = await res.json();
        setCars((c) => [...c, created]);
      }
    }
    cancelForm();
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this vehicle permanently?")) return;
    setDeleting(id);
    await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
    setCars((c) => c.filter((x) => x.id !== id));
    setDeleting(null);
  }

  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors w-full";

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Fleet</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading…" : `${cars.length} vehicles`}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startNew}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-6 space-y-4">
          <h2 className="text-base font-semibold text-white">{editing ? "Edit Vehicle" : "New Vehicle"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-400 mb-1 block">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g. Toyota Camry SE" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-400 mb-1 block">Image path or URL *</label>
              <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="/images/cars/camry.jpg" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Price / day (USD) *</label>
              <input required type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="79" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Seats</label>
              <input type="number" min="1" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className={inputCls} placeholder="5" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Fuel type</label>
              <input value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className={inputCls} placeholder="Gasoline" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Body style</label>
              <input value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={inputCls} placeholder="Sedan" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Transmission</label>
              <input value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={inputCls} placeholder="Automatic" />
            </div>
            <div className="flex items-center gap-2 pt-4 sm:pt-5">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-red-500 w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm text-zinc-300">Featured on homepage</label>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Vehicle"}
            </button>
            <button type="button" onClick={cancelForm} className="text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading…</div>
      ) : cars.length === 0 ? (
        <div className="text-zinc-500 text-sm">No vehicles yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {cars.map((car) => (
            <div key={car.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="relative h-36 sm:h-40 bg-zinc-800">
                {car.image && (
                  <Image
                    src={car.image.startsWith("/") || car.image.startsWith("http") ? car.image : `/${car.image}`}
                    alt={car.name}
                    fill
                    className="object-cover"
                    onError={() => {}}
                  />
                )}
                {car.featured && (
                  <span className="absolute top-2 right-2 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="font-semibold text-white text-sm">{car.name}</div>
                <div className="text-emerald-400 font-bold mt-0.5 text-sm">
                  ${car.price}<span className="text-zinc-500 font-normal text-xs">/day</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                  {car.seats && <span>{car.seats} seats</span>}
                  {car.fuel && <span>{car.fuel}</span>}
                  {car.body && <span>{car.body}</span>}
                  {car.transmission && <span>{car.transmission}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(car)}
                    className="text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors flex-1 text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    disabled={deleting === car.id}
                    className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 disabled:opacity-50"
                  >
                    {deleting === car.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
