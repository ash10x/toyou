"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json?.users) setUsers(json.users);
    }
    load();
  }, []);

  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openEdit = (u: any) => {
    setEditing(u);
    setEditForm({
      name: u.name || "",
      email: u.email || "",
      is_admin: !!u.is_admin,
    });
    setErrors({});
  };

  const closeEdit = () => {
    setEditing(null);
    setEditForm(null);
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!editForm.name || !editForm.name.trim()) e.name = "Name is required";
    if (!editForm.email || !validateEmail(editForm.email))
      e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitEdit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const body = {
      name: editForm.name,
      email: editForm.email,
      is_admin: !!editForm.is_admin,
    };
    const res = await fetch(`/api/admin/users/${editing.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json?.user) {
      setUsers((s) =>
        s.map((u) => (u.id === json.user.id ? { ...u, ...json.user } : u)),
      );
      closeEdit();
    } else {
      alert(json?.error || "Update failed");
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Admin</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.is_admin ? "Yes" : "No"}</td>
                <td className="p-3">
                  <button
                    onClick={() => openEdit(u)}
                    className="text-blue-600 mr-3"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={closeEdit}>
        <h3 className="text-xl font-bold mb-3">Edit User</h3>
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
              <label className="block text-sm font-medium">Email</label>
              <input
                className="w-full border p-2 rounded"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
              {errors.email && (
                <div className="text-red-600 text-sm">{errors.email}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_admin"
                type="checkbox"
                checked={!!editForm.is_admin}
                onChange={(e) =>
                  setEditForm({ ...editForm, is_admin: e.target.checked })
                }
              />
              <label htmlFor="is_admin">Is Admin</label>
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
