"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Car, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "signin" | "signup";
type Role = "renter" | "hoster";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) || "signin");
  const [role, setRole] = useState<Role>((searchParams.get("role") as Role) || "renter");

  // Where to redirect after login/signup
  const nextPath = searchParams.get("next") || null;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign in fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign up fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(nextPath || (data.role === "hoster" ? "/hoster" : "/dashboard"));
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(nextPath || (data.role === "hoster" ? "/hoster" : "/dashboard"));
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 focus:bg-zinc-800 transition-all duration-200";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/logo/logo.png" alt="ToYou" className="h-10 mx-auto brightness-0 invert" />
          </Link>
          <p className="text-zinc-500 text-sm mt-3">
            {tab === "signin" ? "Welcome back" : "Join the ToYou community"}
          </p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl shadow-black/40">
          {/* Tab switcher */}
          <div className="flex border-b border-zinc-800">
            {(["signin", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors duration-200 ${
                  tab === t
                    ? "text-white bg-zinc-800/50 border-b-2 border-red-500"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {tab === "signin" ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignIn}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="you@example.com"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputCls} pr-10`}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)]"
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </button>

                  <p className="text-center text-xs text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setTab("signup"); setError(""); }}
                      className="text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      Create one
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignUp}
                  className="space-y-4"
                >
                  {/* Role selection */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">I want to</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: "renter", label: "Rent a Car", desc: "Browse & book vehicles", icon: User },
                        { value: "hoster", label: "List My Car", desc: "Earn passive income", icon: Car },
                      ] as { value: Role; label: string; desc: string; icon: React.ComponentType<{size?: number; className?: string}> }[]).map(({ value, label, desc, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRole(value)}
                          className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-200 ${
                            role === value
                              ? "border-red-500 bg-red-500/10 text-white"
                              : "border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                          }`}
                        >
                          <Icon size={16} className={role === value ? "text-red-400" : "text-zinc-500"} />
                          <span className="text-xs font-semibold">{label}</span>
                          <span className="text-[10px] text-zinc-500 leading-tight">{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={inputCls}
                        placeholder="John"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={inputCls}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone <span className="text-zinc-600">(optional)</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputCls}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputCls} pr-10`}
                        placeholder="Min. 8 characters"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputCls}
                      placeholder="Repeat your password"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)]"
                  >
                    {loading ? "Creating account…" : `Create ${role === "hoster" ? "Hoster" : "Renter"} Account`}
                  </button>

                  <p className="text-center text-xs text-zinc-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setTab("signin"); setError(""); }}
                      className="text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          By continuing, you agree to our{" "}
          <Link href="/" className="text-zinc-500 hover:text-zinc-400 underline">Terms</Link>
          {" & "}
          <Link href="/" className="text-zinc-500 hover:text-zinc-400 underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
