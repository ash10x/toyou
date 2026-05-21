"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // ensure cookies from the API (Set-Cookie) are accepted
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch (err) {
        // non-JSON response
      }

      if (!res.ok)
        return setError(json?.error || `Login failed (${res.status})`);
      // success
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Network error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handle}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <label className="block mb-2">
          Email
          <input
            className="w-full mt-1 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          Password
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="w-full py-2 bg-red-600 text-white rounded cursor-pointer">
          Sign in
        </button>
      </form>
    </main>
  );
}
