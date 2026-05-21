"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function AdminCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", image: "", price: "" });
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/cars");
      const json = await res.json();
      if (json?.cars) setCars(json.cars);
    }
    load();
  }, []);

  const openEdit = (car: any) => {
    setEditing(car);
    setEditForm({
      name: car.name || "",
      image: car.image || "",
      price: String(car.price ?? ""),
      seats: car.seats ?? "",
      fuel: car.fuel ?? "",
      body: car.body ?? "",
      transmission: car.transmission ?? "",
      featured: !!car.featured,
    });
    setErrors({});
  };

  const closeEdit = () => {
    setEditing(null);
    setEditForm(null);
    setErrors({});
  };

  const validateEdit = () => {
    const nextErrors: Record<string, string> = {};
    if (!editForm.name.trim()) nextErrors.name = "Name is required";
    const priceNum = Number(editForm.price);
    if (Number.isNaN(priceNum) || priceNum <= 0)
      nextErrors.price = "Price must be a positive number";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEdit()) return;
    const body = {
      name: editForm.name,
      image: editForm.image,
      price: Number(editForm.price),
      seats: editForm.seats ? Number(editForm.seats) : null,
      fuel: editForm.fuel || null,
      body: editForm.body || null,
      transmission: editForm.transmission || null,
      featured: !!editForm.featured,
    };

    const res = await fetch(`/api/admin/cars/${editing.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json?.car) {
      setCars((s) => s.map((c) => (c.id === json.car.id ? json.car : c)));
      closeEdit();
    } else {
      setErrors({ form: json?.error || "Failed to update car" });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      image: form.image,
      price: Number(form.price),
    };
    const res = await fetch("/api/admin/cars", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json?.car) setCars((s) => [json.car, ...s]);
    setForm({ name: "", image: "", price: "" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this car?")) return;
    const res = await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
    if (res.ok) setCars((s) => s.filter((c) => c.id !== id));
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Cars</h2>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border p-2 rounded w-28"
            />
            <button className="bg-red-600 text-white px-3 rounded">Add</button>
          </form>
        </div>

        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">${c.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-blue-600 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={closeEdit}>
        <h3 className="text-xl font-bold mb-3">Edit Car</h3>
        {editForm && (
          <form onSubmit={submitEdit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                className="w-full border p-2 rounded"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
              {errors.name && (
                <div className="text-red-600 text-sm">{errors.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                className="w-full border p-2 rounded"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
              />
              {errors.price && (
                <div className="text-red-600 text-sm">{errors.price}</div>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium">Seats</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editForm.seats}
                  onChange={(e) =>
                    setEditForm({ ...editForm, seats: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Fuel</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editForm.fuel}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fuel: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium">Body</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editForm.body}
                  onChange={(e) =>
                    setEditForm({ ...editForm, body: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">
                  Transmission
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={editForm.transmission}
                  onChange={(e) =>
                    setEditForm({ ...editForm, transmission: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                checked={!!editForm.featured}
                onChange={(e) =>
                  setEditForm({ ...editForm, featured: e.target.checked })
                }
              />
              <label htmlFor="featured">Featured</label>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={closeEdit}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>
    </main>
  );
}
