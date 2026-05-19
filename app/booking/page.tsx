"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { CalendarDays, MapPin, User, Mail, Phone, Check } from "lucide-react";

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

type InputChange = React.ChangeEvent<HTMLInputElement>;
type SelectChange = React.ChangeEvent<HTMLSelectElement>;

export default function BookingPage() {
  const [selectedCar, setSelectedCar] = useState<number>(1);
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

  // ✅ SAFE: client-only query parsing (no SSR crash)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const carId = Number(params.get("carId"));
    if (carId) setSelectedCar(carId);

    setForm({
      fullName: params.get("fullName") || "",
      email: params.get("email") || "",
      phone: params.get("phone") || "",
      pickup: params.get("pickup") || "",
      dropoff: params.get("dropoff") || "",
      pickupDate: params.get("pickupDate") || "",
      dropoffDate: params.get("dropoffDate") || "",
    });
  }, []);

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
    <main className="min-h-screen bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="text-center pb-10">
        <h1 className="text-5xl font-black">Complete Your Booking</h1>
        <p className="text-gray-600 mt-3">
          Secure your premium rental vehicle in just a few steps.
        </p>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* LEFT */}
        <div className="space-y-8">
          {/* CAR SELECT */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Choose Vehicle</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {cars.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCar(c.id)}
                  className={`rounded-xl border p-3 text-left ${
                    selectedCar === c.id ? "border-red-600" : "border-black/10"
                  }`}
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={400}
                    height={200}
                    className="rounded-lg"
                  />
                  <p className="mt-2 font-bold">{c.name}</p>
                  <p className="text-sm text-gray-500">${c.price}/day</p>
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Customer Info</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Input
                icon={User}
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e: InputChange) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />

              <Input
                icon={Mail}
                placeholder="Email"
                value={form.email}
                onChange={(e: InputChange) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Input
                icon={Phone}
                placeholder="Phone"
                value={form.phone}
                onChange={(e: InputChange) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* RENTAL */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Rental Details</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <SelectInput
                value={form.pickup}
                onChange={(e: SelectChange) =>
                  setForm({ ...form, pickup: e.target.value })
                }
                options={locations}
              />

              <SelectInput
                value={form.dropoff}
                onChange={(e: SelectChange) =>
                  setForm({ ...form, dropoff: e.target.value })
                }
                options={locations}
              />

              <Input
                icon={CalendarDays}
                type="date"
                value={form.pickupDate}
                onChange={(e: InputChange) =>
                  setForm({ ...form, pickupDate: e.target.value })
                }
              />

              <Input
                icon={CalendarDays}
                type="date"
                value={form.dropoffDate}
                onChange={(e: InputChange) =>
                  setForm({ ...form, dropoffDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sticky top-32 rounded-2xl bg-black p-6 text-white">
          <h3 className="text-2xl font-black">Summary</h3>

          {car && (
            <div className="mt-6">
              <Image
                src={car.image}
                alt={car.name}
                width={400}
                height={200}
                className="rounded-xl"
              />
              <p className="mt-3 font-bold">{car.name}</p>
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
            className="mt-6 w-full rounded-xl bg-red-600 py-3 font-semibold"
          >
            Confirm Booking
          </button>

          {bookingSuccess && (
            <div className="mt-4 flex items-center gap-2 text-green-400">
              <Check size={16} />
              Booking successful
            </div>
          )}
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
}: {
  icon: any;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
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

/* SELECT */
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
