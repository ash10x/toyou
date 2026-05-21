/* =========================================
   app/booking/page.tsx
========================================= */

"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
  useEffect,
  ChangeEvent,
  ComponentType,
} from "react";

import { motion } from "framer-motion";

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
} from "lucide-react";

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

type InputChange = ChangeEvent<HTMLInputElement>;
type SelectChange = ChangeEvent<HTMLSelectElement>;

export default function BookingPage() {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);

  const [prefilledCar, setPrefilledCar] = useState<Car | null>(null);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    pickupDate: "",
    dropoffDate: "",
  });

  /* QUERY PARAMS */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const incomingCar: Car = {
      id: Number(params.get("carId")),
      name: params.get("carName") || "",
      image: params.get("carImage") || "",
      price: Number(params.get("carPrice")),
      transmission: params.get("transmission") || "",
      body: params.get("body") || "",
      fuel: params.get("fuel") || "",
      seats: Number(params.get("seats")),
    };

    setPrefilledCar(incomingCar);
    setSelectedCar(incomingCar.id);
  }, []);

  /* FETCH */
  useEffect(() => {
    async function loadData() {
      try {
        const [carsRes, locRes] = await Promise.all([
          fetch("/api/cars"),
          fetch("/api/locations"),
        ]);

        const carsData = await carsRes.json();
        const locationsData = await locRes.json();

        if (carsData?.cars) {
          setCars(carsData.cars as Car[]);
        }

        if (locationsData?.locations) {
          setLocations(locationsData.locations as string[]);
        }
      } catch (error) {
        console.error("Failed loading booking data:", error);
      }
    }

    loadData();
  }, []);

  const car = useMemo(() => {
    return cars.find((c) => c.id === selectedCar) || prefilledCar;
  }, [cars, selectedCar, prefilledCar]);

  const rentalDays = useMemo(() => {
    if (!form.pickupDate || !form.dropoffDate) return 1;

    const pickup = new Date(form.pickupDate);
    const dropoff = new Date(form.dropoffDate);

    const diff = (dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);

    return diff > 0 ? Math.ceil(diff) : 1;
  }, [form.pickupDate, form.dropoffDate]);

  const subtotal = (car?.price || 0) * rentalDays;
  const serviceFee = 10;
  const total = subtotal + serviceFee;

  const isValid =
    form.fullName &&
    form.email &&
    form.phone &&
    form.pickup &&
    form.dropoff &&
    form.pickupDate &&
    form.dropoffDate;

  const handleBooking = () => {
    if (!isValid) return;

    setBookingSuccess(true);

    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f7f7] via-white to-[#f3f3f3] pt-32">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-0 h-[30rem] w-[30rem] rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-black/10 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600 backdrop-blur">
            <ShieldCheck size={15} />
            Secure Reservation
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-black md:text-6xl">
            Complete Your Booking
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Finalize your luxury vehicle reservation in minutes.
          </p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div className="space-y-8">
          {/* PROGRESS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.05)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              {["Vehicle", "Customer", "Confirm"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                    {i + 1}
                  </div>

                  <span className="font-semibold text-black">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] border border-white/40 bg-white/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.05)] backdrop-blur-xl"
          >
            <h2 className="text-2xl font-black text-black">
              Customer Information
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Input
                icon={User}
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName: e.target.value,
                  })
                }
              />

              <Input
                icon={Mail}
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <Input
                icon={Phone}
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            {/* RENTAL */}
            <h3 className="mt-12 text-xl font-black text-black">
              Rental Details
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <SelectInput
                value={form.pickup}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pickup: e.target.value,
                  })
                }
                options={locations}
              />

              <SelectInput
                value={form.dropoff}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dropoff: e.target.value,
                  })
                }
                options={locations}
              />

              <Input
                icon={CalendarDays}
                type="date"
                value={form.pickupDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pickupDate: e.target.value,
                  })
                }
              />

              <Input
                icon={CalendarDays}
                type="date"
                value={form.dropoffDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dropoffDate: e.target.value,
                  })
                }
              />
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-32 h-fit overflow-hidden rounded-[2rem] border border-white/10 bg-black p-7 text-white shadow-[0_30px_100px_rgba(0,0,0,0.4)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

          <div className="relative">
            <h3 className="text-3xl font-black">Booking Summary</h3>

            {car && (
              <>
                <div className="relative mt-6 overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={car.image}
                    alt={car.name}
                    width={600}
                    height={350}
                    className="h-[240px] w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <p className="text-2xl font-black">{car.name}</p>

                    <p className="mt-1 text-gray-300">${car.price}/day</p>
                  </div>
                </div>

                {/* SPECS */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <MiniSpec icon={<Users size={16} />} value={`${car.seats}`} />

                  <MiniSpec
                    icon={<Fuel size={16} />}
                    value={String(car.fuel)}
                  />

                  <MiniSpec
                    icon={<CarFront size={16} />}
                    value={String(car.transmission)}
                  />
                </div>
              </>
            )}

            {/* TOTALS */}
            <div className="mt-8 space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex justify-between text-gray-300">
                <span>Rental Days</span>
                <span>{rentalDays}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBooking}
              disabled={!isValid}
              className={`mt-7 w-full rounded-2xl py-4 text-sm font-semibold transition-all duration-300 ${
                isValid
                  ? "bg-red-600 text-white hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_40px_rgba(220,38,38,0.35)]"
                  : "cursor-not-allowed bg-white/10 text-gray-500"
              }`}
            >
              Confirm Reservation
            </button>

            {/* SUCCESS */}
            {bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-green-400"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <Check size={18} />
                  </div>

                  <div>
                    <p className="font-bold">Reservation Confirmed</p>

                    <p className="text-sm text-green-300">
                      Confirmation email sent successfully.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

/* INPUT */
function Input({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: ComponentType<{
    className?: string;
    size?: number;
  }>;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
        size={18}
      />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-black/5 bg-white/80 p-4 pl-12 outline-none transition-all duration-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      />
    </div>
  );
}

/* SELECT */
function SelectInput({
  value,
  onChange,
  options,
}: {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <MapPin
        className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
        size={18}
      />

      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border border-black/5 bg-white/80 p-4 pl-12 outline-none transition-all duration-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 ${
          value ? "text-black" : "text-gray-400"
        }`}
      >
        <option value="">Select Location</option>

        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function MiniSpec({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-600/20 text-red-400">
        {icon}
      </div>

      <p className="mt-3 text-xs font-semibold text-white">{value}</p>
    </div>
  );
}
