"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import {
  CalendarDays,
  MapPin,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Check,
} from "lucide-react";

const cars = [
  {
    id: 1,
    name: "BMW X6",
    image: "/cars/bmw-x6.jpg",
    price: 120,
    seats: 5,
    fuel: "Petrol",
    body: "SUV",
    transmission: "Automatic",
  },
  {
    id: 2,
    name: "Mercedes C300",
    image: "/cars/benz-c300.jpg",
    price: 105,
    seats: 5,
    fuel: "Petrol",
    body: "Sedan",
    transmission: "Automatic",
  },
  {
    id: 3,
    name: "Toyota Rav4",
    image: "/cars/rav4.jpg",
    price: 80,
    seats: 5,
    fuel: "Hybrid",
    body: "SUV",
    transmission: "Automatic",
  },
  {
    id: 4,
    name: "Honda Fit",
    image: "/cars/honda-fit.jpg",
    price: 55,
    seats: 5,
    fuel: "Petrol",
    body: "Hatchback",
    transmission: "Automatic",
  },
];

const locations = [
  "Kingston",
  "Montego Bay",
  "Ocho Rios",
  "Negril",
  "Mandeville",
  "Airport Pickup",
];

export default function BookingPage() {
  const searchParams = useSearchParams();

  const [selectedCar, setSelectedCar] = useState<number>(
    Number(searchParams.get("carId")) || 1,
  );

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    pickupDate: "",
    dropoffDate: "",
  });

  useEffect(() => {
    setForm({
      fullName: searchParams.get("fullName") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      pickup: searchParams.get("pickup") || "",
      dropoff: searchParams.get("dropoff") || "",
      pickupDate: searchParams.get("pickupDate") || "",
      dropoffDate: searchParams.get("dropoffDate") || "",
    });

    const carId = Number(searchParams.get("carId"));
    if (carId) setSelectedCar(carId);
  }, [searchParams]);

  const car = useMemo(
    () => cars.find((c) => c.id === selectedCar),
    [selectedCar],
  );

  const rentalDays = useMemo(() => {
    if (!form.pickupDate || !form.dropoffDate) return 1;

    const pickup = new Date(form.pickupDate);
    const dropoff = new Date(form.dropoffDate);

    const diff = (dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 1;
  }, [form.pickupDate, form.dropoffDate]);

  const subtotal = (car?.price || 0) * rentalDays;
  const serviceFee = 10;
  const total = subtotal + serviceFee;

  const handleBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 pb-14 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-black text-black md:text-6xl">
              Complete Your Booking
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              Secure your premium rental vehicle in just a few steps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* CAR SELECT */}
            <div className="rounded-[2rem] bg-white p-6 shadow">
              <h2 className="text-xl font-bold">Choose Your Vehicle</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {cars.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCar(c.id)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      selectedCar === c.id
                        ? "border-red-600"
                        : "border-black/10"
                    }`}
                  >
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={400}
                      height={200}
                      className="rounded-xl"
                    />
                    <p className="mt-2 font-bold">{c.name}</p>
                    <p className="text-sm text-gray-500">${c.price}/day</p>
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="rounded-[2rem] bg-white p-6 shadow">
              <h2 className="text-xl font-bold">Customer Information</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input
                  icon={User}
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
                <Input
                  icon={Mail}
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  icon={Phone}
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            {/* RENTAL */}
            <div className="rounded-[2rem] bg-white p-6 shadow">
              <h2 className="text-xl font-bold">Rental Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <SelectInput
                  value={form.pickup}
                  onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                  options={locations}
                />

                <SelectInput
                  value={form.dropoff}
                  onChange={(e) =>
                    setForm({ ...form, dropoff: e.target.value })
                  }
                  options={locations}
                />

                <Input
                  icon={CalendarDays}
                  type="date"
                  value={form.pickupDate}
                  onChange={(e) =>
                    setForm({ ...form, pickupDate: e.target.value })
                  }
                />

                <Input
                  icon={CalendarDays}
                  type="date"
                  value={form.dropoffDate}
                  onChange={(e) =>
                    setForm({ ...form, dropoffDate: e.target.value })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="sticky top-32 rounded-[2rem] bg-black p-6 text-white">
              <h3 className="text-2xl font-black">Booking Summary</h3>

              {car && (
                <div className="mt-6 space-y-4">
                  <Image
                    src={car.image}
                    alt={car.name}
                    width={400}
                    height={200}
                    className="rounded-2xl"
                  />
                  <p className="text-xl font-bold">{car.name}</p>
                  <p>${car.price}/day</p>
                </div>
              )}

              <div className="mt-6 space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="mt-6 w-full rounded-2xl bg-red-600 py-3 font-semibold"
              >
                Confirm Booking
              </button>

              {bookingSuccess && (
                <div className="mt-4 text-green-400 flex items-center gap-2">
                  <Check size={16} />
                  Booking successful
                </div>
              )}
            </div>
          </motion.div>
        </div>
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
}: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-red-500" size={18} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border p-3 pl-10"
      />
    </div>
  );
}

/* SELECT (FIXED - NO PLACEHOLDER PROP) */
function SelectInput({
  value,
  onChange,
  options,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 text-red-500" size={18} />

      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border p-3 pl-10 ${
          value ? "text-black" : "text-gray-500"
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
