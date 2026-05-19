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
  ChevronDown,
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

    if (carId) {
      setSelectedCar(carId);
    }
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

    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-14 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              Reserve Your Ride
            </span>

            <h1 className="mt-6 text-5xl font-black text-black md:text-6xl">
              Complete Your Booking
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
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
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-bold text-black">
                Choose Your Vehicle
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {cars.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCar(c.id)}
                    className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                      selectedCar === c.id
                        ? "border-red-600 shadow-lg shadow-red-100"
                        : "border-black/5 hover:border-red-500"
                    }`}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <div className="p-4 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-bold">{c.name}</p>

                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                          ${c.price}/day
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-black/5 px-3 py-1">
                          {c.body}
                        </span>

                        <span className="rounded-full bg-black/5 px-3 py-1">
                          {c.fuel}
                        </span>

                        <span className="rounded-full bg-black/5 px-3 py-1">
                          {c.transmission}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-bold text-black">
                Customer Information
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <Input
                  icon={Phone}
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            {/* RENTAL DETAILS */}
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-bold text-black">Rental Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <SelectInput
                  value={form.pickup}
                  onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                  options={locations}
                  placeholder="Pickup Location"
                />

                <SelectInput
                  value={form.dropoff}
                  onChange={(e) =>
                    setForm({ ...form, dropoff: e.target.value })
                  }
                  options={locations}
                  placeholder="Dropoff Location"
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
                <div className="mt-6 space-y-5">
                  <div className="relative h-52 overflow-hidden rounded-3xl">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5">
                      <h4 className="text-2xl font-black text-white">
                        {car.name}
                      </h4>

                      <p className="mt-1 text-sm text-gray-300">
                        Premium {car.body} Rental
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <InfoCard label="Seats" value={car.seats} />
                    <InfoCard label="Fuel" value={car.fuel} />
                    <InfoCard label="Transmission" value={car.transmission} />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-red-600 px-5 py-4">
                    <span className="text-sm font-medium text-white/80">
                      Daily Rate
                    </span>

                    <span className="text-2xl font-black text-white">
                      ${car.price}/day
                    </span>
                  </div>
                </div>
              )}

              {/* PRICE BREAKDOWN */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Rental Days</span>
                    <span>{rentalDays} day(s)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Daily Rate</span>
                    <span>${car?.price}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Service Fee</span>
                    <span>${serviceFee}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleBooking}
                className="mt-8 w-full rounded-2xl bg-red-600 py-4 font-semibold transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.35)]"
              >
                Confirm Booking
              </button>

              {/* SUCCESS */}
              {bookingSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <Check size={16} className="text-white" />
                  </div>
                  Booking request submitted successfully.
                </motion.div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} />
                Secure encrypted booking system
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* INFO CARD */
function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>

      <p className="mt-2 text-sm font-bold text-white">{value}</p>
    </div>
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
      <Icon
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-red-500"
        size={18}
      />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-14 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-12 pr-4 text-black outline-none transition-all placeholder:text-gray-500 focus:border-red-500"
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
      <MapPin
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-red-500"
        size={18}
      />

      <select
        value={value}
        onChange={onChange}
        className={`h-14 w-full appearance-none rounded-2xl border border-black/10 bg-[#fafafa] pl-12 pr-10 outline-none transition-all focus:border-red-500 ${
          value ? "text-black" : "text-gray-500"
        }`}
      >
        <option value="" className="text-gray-500">
          Select Location
        </option>

        {options.map((location) => (
          <option key={location} value={location} className="text-black">
            {location}
          </option>
        ))}
      </select>

      {/* dropdown indicator */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        ▾
      </div>
    </div>
  );
}
