"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
  useEffect,
  ChangeEvent,
  ComponentType,
} from "react";

import { CalendarDays, MapPin, User, Mail, Phone, Check } from "lucide-react";

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
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    pickupDate: "",
    dropoffDate: "",
  });

  /* =========================================
     QUERY PARAMS
  ========================================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const carId = Number(params.get("carId"));

    if (!Number.isNaN(carId) && carId > 0) {
      setSelectedCar(carId);
    }

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

  /* =========================================
     FETCH DATA
  ========================================= */
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);

        const [carsRes, locRes] = await Promise.all([
          fetch("/api/cars"),
          fetch("/api/locations"),
        ]);

        const carsData = await carsRes.json();
        const locationsData = await locRes.json();

        if (!mounted) return;

        if (carsData?.cars) {
          setCars(carsData.cars as Car[]);

          if (!selectedCar && carsData.cars.length > 0) {
            setSelectedCar(carsData.cars[0].id);
          }
        }

        if (locationsData?.locations) {
          setLocations(locationsData.locations as string[]);
        }
      } catch (error) {
        console.error("Failed to load booking data:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [selectedCar]);

  /* =========================================
     SELECTED CAR
  ========================================= */
  const car = useMemo(
    () => cars.find((c) => c.id === selectedCar),
    [cars, selectedCar],
  );

  /* =========================================
     RENTAL DAYS
  ========================================= */
  const rentalDays = useMemo(() => {
    if (!form.pickupDate || !form.dropoffDate) {
      return 1;
    }

    const pickup = new Date(form.pickupDate);
    const dropoff = new Date(form.dropoffDate);

    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
      return 1;
    }

    const diffMs = dropoff.getTime() - pickup.getTime();

    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 1;
  }, [form.pickupDate, form.dropoffDate]);

  /* =========================================
     TOTALS
  ========================================= */
  const subtotal = (car?.price || 0) * rentalDays;
  const serviceFee = 10;
  const total = subtotal + serviceFee;

  /* =========================================
     VALIDATION
  ========================================= */
  const isFormValid =
    form.fullName &&
    form.email &&
    form.phone &&
    form.pickup &&
    form.dropoff &&
    form.pickupDate &&
    form.dropoffDate &&
    car;

  /* =========================================
     BOOKING
  ========================================= */
  const handleBooking = () => {
    if (!isFormValid) return;

    setBookingSuccess(true);

    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="pb-10 text-center">
        <h1 className="text-5xl font-black">Complete Your Booking</h1>

        <p className="mt-3 text-gray-600">
          Secure your premium rental vehicle in just a few steps.
        </p>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* LEFT */}
        <div className="space-y-8">
          {/* VEHICLES */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Choose Vehicle</h2>

            {loading ? (
              <div className="mt-6 text-sm text-gray-500">
                Loading vehicles...
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {cars.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCar(c.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      selectedCar === c.id
                        ? "border-red-600 ring-2 ring-red-100"
                        : "border-black/10 hover:border-black/20"
                    }`}
                  >
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={400}
                      height={220}
                      className="h-[200px] w-full rounded-lg object-cover"
                    />

                    <div className="mt-3">
                      <p className="font-bold">{c.name}</p>

                      <p className="text-sm text-gray-500">${c.price}/day</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CUSTOMER */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Customer Info</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                type="email"
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
          </div>

          {/* RENTAL */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Rental Details</h2>

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
          </div>
        </div>

        {/* RIGHT */}
        <div className="sticky top-32 h-fit rounded-2xl bg-black p-6 text-white">
          <h3 className="text-2xl font-black">Booking Summary</h3>

          {car && (
            <div className="mt-6">
              <Image
                src={car.image}
                alt={car.name}
                width={500}
                height={260}
                className="h-[220px] w-full rounded-xl object-cover"
              />

              <div className="mt-4">
                <p className="text-lg font-bold">{car.name}</p>

                <p className="text-sm text-gray-300">${car.price}/day</p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
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

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBooking}
            disabled={!isFormValid}
            className={`mt-6 w-full rounded-xl py-3 font-semibold transition-all ${
              isFormValid
                ? "bg-red-600 hover:bg-red-700"
                : "cursor-not-allowed bg-gray-700"
            }`}
          >
            Confirm Booking
          </button>

          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-green-400"
            >
              <Check size={18} />
              Booking successful
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================
   INPUT
========================================= */
function Input({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: ComponentType<{ className?: string; size?: number }>;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
        size={18}
      />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-black/10 p-3 pl-10 outline-none transition-all focus:border-red-500"
      />
    </div>
  );
}

/* =========================================
   SELECT
========================================= */
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
        className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
        size={18}
      />

      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border border-black/10 p-3 pl-10 outline-none transition-all focus:border-red-500 ${
          value ? "text-black" : "text-gray-500"
        }`}
      >
        <option value="">Select Location</option>

        {options.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
}
