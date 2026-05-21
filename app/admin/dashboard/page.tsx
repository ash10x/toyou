"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function me() {
      const res = await fetch("/api/admin/me");
      const json = await res.json();
      setUser(json.user);
    }
    me();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div>{user ? `Signed in: ${user.email}` : "Not signed in"}</div>
        </header>

        <div className="grid grid-cols-2 gap-6">
          <Link
            href="/admin/cars"
            className="block p-6 bg-white rounded shadow hover:shadow-lg"
          >
            Manage Cars
          </Link>
          <Link
            href="/admin/users"
            className="block p-6 bg-white rounded shadow hover:shadow-lg"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </main>
  );
}
