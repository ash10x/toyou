/* =========================================
   app/booking/page.tsx
========================================= */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  useMemo,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  ComponentType,
  ReactNode,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  CalendarDays,
  MapPin,
  User,
  Mail,
  Phone,
  Check,
  Users,
  Fuel,
  CarFront,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AuthModal from "@/app/components/auth-modal";

type Car = {
  id: number;
  name: string;
  image: string;
  price: number;
  seats?: number;
  fuel?: string;
  body?: string;
  transmission?: string;
};

export default function BookingPage() {
  return (
    <Suspense>
      <BookingPageContent />
    </Suspense>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();

  const carId = Number(searchParams.get("carId"));
  const incomingCar: Car | null =
    !Number.isNaN(carId) && carId > 0
      ? {
          id: carId,
          name: searchParams.get("carName") || "",
          image: searchParams.get("carImage") || "",
          price: Number(searchParams.get("carPrice")) || 0,
          transmission: searchParams.get("transmission") || "",
          body: searchParams.get("body") || "",
          fuel: searchParams.get("fuel") || "",
          seats: Number(searchParams.get("seats")) || 0,
        }
      : null;

  const [selectedCar, setSelectedCar] = useState<number | null>(incomingCar?.id ?? null);
  const [prefilledCar] = useState<Car | null>(incomingCar);
  const fromParam = searchParams.get("from");
  const [showMiniSlider] = useState(fromParam === "nav" || fromParam === "form");

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const timeoutRef = useRef<number | null>(null);

  const [form, setForm] = useState({
    fullName: searchParams.get("fullName") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    pickup: searchParams.get("pickup") || "",
    dropoff: searchParams.get("dropoff") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    dropoffDate: searchParams.get("dropoffDate") || "",
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => setIsAuthenticated(r.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [carsRes, locRes] = await Promise.all([
          fetch("/api/cars"),
          fetch("/api/locations"),
        ]);
        if (!carsRes.ok || !locRes.ok) throw new Error("Failed API request");
        const carsData = await carsRes.json();
        const locationsData = await locRes.json();
        if (carsData?.cars) setCars(carsData.cars as Car[]);
        if (locationsData?.locations) setLocations(locationsData.locations as string[]);
      } catch (error) {
        console.error("Failed loading booking data:", error);
      }
    }
    loadData();
  }, []);

  const car = useMemo<Car | null>(() => {
    if (selectedCar == null) return prefilledCar;
    return cars.find((c) => c.id === selectedCar) || prefilledCar;
  }, [cars, selectedCar, prefilledCar]);

  const rentalDays = useMemo(() => {
    if (!form.pickupDate || !form.dropoffDate) return 1;
    const pickup = new Date(`${form.pickupDate}T00:00:00`);
    const dropoff = new Date(`${form.dropoffDate}T00:00:00`);
    const diff = (dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 1;
  }, [form.pickupDate, form.dropoffDate]);

  const subtotal = (car?.price || 0) * rentalDays;
  const serviceFee = 10;
  const total = subtotal + serviceFee;

  const minPickupDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const minDropoffDate = form.pickupDate
    ? new Date(new Date(`${form.pickupDate}T00:00:00`).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const isValid =
    form.fullName &&
    form.email &&
    form.phone &&
    form.pickup &&
    form.dropoff &&
    form.pickupDate &&
    form.dropoffDate &&
    rentalDays >= 3;

  const handleBooking = async () => {
    if (!isValid || !car) return;
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsSubmitting(true);
    setBookingError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_id: car.id,
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          pickup_location: form.pickup,
          dropoff_location: form.dropoff,
          pickup_date: form.pickupDate,
          dropoff_date: form.dropoffDate,
          total_price: total,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create booking");
      setBookingSuccess(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setBookingSuccess(false);
        setForm({
          fullName: "",
          email: "",
          phone: "",
          pickup: "",
          dropoff: "",
          pickupDate: "",
          dropoffDate: "",
        });
      }, 4000);
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError(
        error instanceof Error ? error.message : "Failed to create booking",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f7] pt-32">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-0 h-[28rem] w-[28rem] rounded-full bg-red-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-zinc-900/5 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
            <ShieldCheck size={11} />
            Secure Reservation
          </div>
          <h1 className="mt-5 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
            Complete Your Booking
          </h1>
          <p className="mt-3 text-base text-zinc-500">
            Finalize your luxury vehicle reservation in minutes.
          </p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div className="space-y-6">

          {/* MINI SLIDER */}
          {showMiniSlider && cars.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 overflow-hidden rounded-2xl border border-zinc-100 bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Select a Vehicle
              </p>
              <MiniSlider
                cars={cars}
                selected={selectedCar}
                onSelect={(id: number) => setSelectedCar(id)}
              />
            </motion.div>
          )}

          {/* PROGRESS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              {["Vehicle", "Customer", "Confirm"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold text-zinc-700">{step}</span>
                  {i < 2 && <div className="hidden h-px w-8 bg-zinc-100 sm:block" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
          >
            <h2 className="text-2xl font-black tracking-tight text-zinc-950">
              Customer Information
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Input icon={User} placeholder="Full Name" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <Input icon={Mail} placeholder="Email Address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input icon={Phone} placeholder="Phone Number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="mt-2 h-px bg-zinc-50" />

            <h3 className="mt-7 text-lg font-black tracking-tight text-zinc-950">
              Rental Details
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SelectInput
                label="Pickup Location"
                value={form.pickup}
                onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                options={locations}
              />
              <SelectInput
                label="Dropoff Location"
                value={form.dropoff}
                onChange={(e) => setForm({ ...form, dropoff: e.target.value })}
                options={locations}
              />
              <Input icon={CalendarDays} type="date" value={form.pickupDate}
                min={minPickupDate}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value, dropoffDate: "" })} />
              <Input icon={CalendarDays} type="date" value={form.dropoffDate}
                min={minDropoffDate}
                onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })} />
            </div>
          </motion.div>
        </div>

        {/* RIGHT — SUMMARY */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-32 h-fit overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_60%)]" />

          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Summary
            </p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">Booking Summary</h3>

            {car && (
              <>
                <div className="relative mt-6 overflow-hidden rounded-xl">
                  <Image
                    src={car.image || "https://via.placeholder.com/600x350"}
                    alt={car.name}
                    width={600}
                    height={350}
                    className="h-[220px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-xl font-black">{car.name}</p>
                    <p className="mt-0.5 text-sm text-zinc-300">${car.price}/day</p>
                  </div>
                </div>

                {/* SPECS */}
                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  <MiniSpec icon={<Users size={14} />} value={`${car.seats || "-"}`} />
                  <MiniSpec icon={<Fuel size={14} />} value={String(car.fuel || "-")} />
                  <MiniSpec icon={<CarFront size={14} />} value={String(car.transmission || "-")} />
                </div>
              </>
            )}

            {/* TOTALS */}
            <div className="mt-6 space-y-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-5">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Rental Days</span>
                <span className="font-semibold text-white">{rentalDays}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Service Fee</span>
                <span className="font-semibold text-white">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.07] pt-3 text-base font-black">
                <span>Total</span>
                <span className="text-red-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBooking}
              disabled={!isValid || isSubmitting}
              className={`mt-6 w-full rounded-xl py-4 text-sm font-semibold transition-all duration-300 ${
                isValid && !isSubmitting
                  ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_28px_rgba(220,38,38,0.4)]"
                  : "cursor-not-allowed bg-white/[0.06] text-zinc-600"
              }`}
            >
              {isSubmitting ? "Processing..." : "Confirm Reservation"}
            </button>

            {/* ERROR */}
            {bookingError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
              >
                <p className="font-semibold">Error</p>
                <p className="mt-1 text-red-300/80">{bookingError}</p>
              </motion.div>
            )}

            {/* SUCCESS */}
            {bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-400">Reservation Confirmed</p>
                    <p className="text-xs text-emerald-400/70">Confirmation email sent.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        intent="rent"
      />
    </main>
  );
}

/* ── INPUT ─────────────────────────────── */
function Input({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  min,
  onChange,
}: {
  icon: ComponentType<{ className?: string; size?: number }>;
  placeholder?: string;
  type?: string;
  value?: string;
  min?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-zinc-100 bg-[#f5f5f7] pl-11 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
      />
    </div>
  );
}

/* ── SELECT ─────────────────────────────── */
function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
        <select
          value={value}
          onChange={onChange}
          className={`h-12 w-full rounded-xl border border-zinc-100 bg-[#f5f5f7] pl-11 pr-4 text-sm outline-none transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100 ${
            value ? "text-zinc-900" : "text-zinc-400"
          }`}
        >
          <option value="">Select Location</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ── MINI SPEC ─────────────────────────── */
function MiniSpec({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-red-600/15 text-red-400">
        {icon}
      </div>
      <p className="mt-2 text-[10px] font-semibold text-zinc-300">{value}</p>
    </div>
  );
}

/* ── MINI SLIDER ───────────────────────── */
function MiniSlider({
  cars,
  selected,
  onSelect,
}: {
  cars: Car[];
  selected: number | null;
  onSelect: (id: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const paused = useRef(false);
  const userSelected = useRef(false);
  const autoRef = useRef<number | null>(null);
  // Track current index in a ref so interval can read it without stale closure
  const indexRef = useRef(0);
  indexRef.current = index;

  const currentCar = cars[index];

  /* KEEP INDEX SAFE */
  useEffect(() => {
    if (!cars || cars.length === 0) return;
    setIndex((i) => (i >= cars.length ? 0 : i));
  }, [cars]);

  /* AUTO ADVANCE */
  useEffect(() => {
    if (!cars || cars.length <= 1) return;
    function stopAuto() {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    }
    function startAuto() {
      stopAuto();
      autoRef.current = window.setInterval(() => {
        if (paused.current) return;
        const next = (indexRef.current + 1) % cars.length;
        const nextCar = cars[next];
        setDirection(1);
        setIndex(next);
        if (nextCar) onSelect(nextCar.id);
      }, 3500);
    }
    startAuto();
    return () => stopAuto();
  }, [cars, onSelect]);

  function navigate(dir: 1 | -1) {
    userSelected.current = true;
    paused.current = true;
    setDirection(dir);
    setIndex((i) => {
      const next = (i + dir + cars.length) % cars.length;
      const nextCar = cars[next];
      if (nextCar) onSelect(nextCar.id);
      return next;
    });
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    paused.current = true;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    const end = e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (start == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    navigate(delta < 0 ? 1 : -1);
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  if (!currentCar) return null;

  return (
    <div onMouseEnter={() => (paused.current = true)} onMouseLeave={() => {
      if (!userSelected.current) paused.current = false;
    }}>
      {/* MAIN IMAGE STAGE */}
      <div
        className="relative h-52 w-full overflow-hidden rounded-xl bg-zinc-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={currentCar.image || "https://via.placeholder.com/600x350"}
              alt={currentCar.name}
              fill
              className="object-cover"
            />

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            {/* CAPTION */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black tracking-tight text-white drop-shadow">
                    {currentCar.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {currentCar.fuel && (
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-zinc-200 backdrop-blur-sm">
                        {currentCar.fuel}
                      </span>
                    )}
                    {currentCar.transmission && (
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-zinc-200 backdrop-blur-sm">
                        {currentCar.transmission}
                      </span>
                    )}
                    {currentCar.seats ? (
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-zinc-200 backdrop-blur-sm">
                        {currentCar.seats} seats
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-red-600 px-3 py-1.5 text-sm font-black text-white shadow-lg">
                  ${currentCar.price}/day
                </div>
              </div>
            </div>

            {/* SELECTED BADGE */}
            {selected === currentCar.id && (
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
                <Check size={11} strokeWidth={3} />
                Selected
              </div>
            )}

            {/* COUNTER */}
            <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
              {index + 1} / {cars.length}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* LEFT ARROW */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Previous vehicle"
          className="absolute left-2.5 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-sm transition-all hover:bg-black/65 hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => navigate(1)}
          aria-label="Next vehicle"
          className="absolute right-2.5 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-sm transition-all hover:bg-black/65 hover:scale-110 active:scale-95"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* DOT INDICATORS */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {cars.map((c, i) => (
          <button
            key={c.id}
            onClick={() => {
              userSelected.current = true;
              paused.current = true;
              setDirection(i > index ? 1 : -1);
              onSelect(c.id);
              setIndex(i);
            }}
            aria-label={`Show car ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === index
                ? "h-1.5 w-6 bg-red-600"
                : "h-1.5 w-1.5 bg-zinc-300 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
