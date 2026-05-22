/* =========================================
   app/page.tsx
========================================= */

"use client";

import Image from "next/image";
import Link from "next/link";

import { useState, useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Sparkles,
  Users,
  Fuel,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

type FeaturedCar = {
  id?: number;
  name: string;
  image: string;
  price: number;
  fuel?: string;
  seats?: number;
};

const defaultFeatured: FeaturedCar[] = [];

const features = [
  {
    title: "Premium Vehicles",
    icon: Car,
    text: "Luxury and economy vehicles maintained to the highest standards.",
  },
  {
    title: "24/7 Support",
    icon: Clock3,
    text: "Our team is available anytime to assist with your rental needs.",
  },
  {
    title: "Safe & Secure",
    icon: ShieldCheck,
    text: "Fully insured rentals with trusted customer service.",
  },
];

export default function LandingPage() {
  const router = useRouter();

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

  const [featuredCars, setFeaturedCars] =
    useState<FeaturedCar[]>(defaultFeatured);

  /* LOAD DATA */
  useEffect(() => {
    async function loadData() {
      try {
        const [featuredRes, locationsRes] = await Promise.all([
          fetch("/api/featured-cars"),
          fetch("/api/locations"),
        ]);

        const featuredJson = await featuredRes.json();

        const locationsJson = await locationsRes.json();

        if (featuredJson?.featured) {
          setFeaturedCars(featuredJson.featured as FeaturedCar[]);
        }

        if (locationsJson?.locations) {
          setLocations(locationsJson.locations as string[]);
        }
      } catch (err) {
        console.error("Failed to load homepage data", err);
      }
    }

    loadData();
  }, []);

  const isValid = useMemo(() => {
    return (
      form.fullName &&
      form.email &&
      form.phone &&
      form.pickup &&
      form.dropoff &&
      form.pickupDate &&
      form.dropoffDate
    );
  }, [form]);

  return (
    <main className="overflow-hidden bg-white">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        {/* BG IMAGE */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero1.jpg"
            alt="Luxury Rental Car"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/75" />
        </div>

        {/* GLOWS */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-0 h-[32rem] w-[32rem] rounded-full bg-red-600/20 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-20 px-6 pb-24 pt-32 lg:grid-cols-[1fr_0.85fr] lg:px-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-400 backdrop-blur-xl">
              <Sparkles size={14} />
              Premium Car Rentals
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              Drive Premium.
              <span className="mt-3 block text-red-500">Arrive Different.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300">
              Luxury vehicles, seamless reservations, and elite customer service
              designed for modern travel experiences.
            </p>

            {/* STATS */}
            <div className="mt-10 flex flex-wrap gap-5">
              {["Premium Fleet", "24/7 Support", "Fully Insured"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white backdrop-blur-xl"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Link
                href="/cars"
                className="group inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-[0_0_40px_rgba(220,38,38,0.45)]"
              >
                Explore Fleet
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <div className="flex items-center gap-2 text-white">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="fill-red-500 text-red-500"
                    size={18}
                  />
                ))}

                <span className="ml-2 text-sm text-gray-300">
                  Trusted by 1,000+ customers
                </span>
              </div>
            </div>
          </motion.div>

          {/* BOOKING PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_20px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          >
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

            <div className="relative">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-red-400">
                  <ShieldCheck size={14} />
                  Secure Booking
                </div>

                <h2 className="mt-5 text-4xl font-black text-white">
                  Reserve Your Vehicle
                </h2>

                <p className="mt-3 text-gray-300">
                  Quick booking experience with instant reservation
                  confirmation.
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();

                  if (!isValid) return;

                  const params = new URLSearchParams({
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    pickup: form.pickup,
                    dropoff: form.dropoff,
                    pickupDate: form.pickupDate,
                    dropoffDate: form.dropoffDate,
                  });

                  router.push(`/booking?${params.toString()}`);
                }}
              >
                {/* NAME */}
                <GlassInput
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fullName: e.target.value,
                    })
                  }
                />

                {/* EMAIL */}
                <GlassInput
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

                {/* PHONE */}
                <GlassInput
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />

                {/* LOCATIONS */}
                <div className="grid gap-5 md:grid-cols-2">
                  <GlassSelect
                    icon={MapPin}
                    label="Pickup Location"
                    value={form.pickup}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pickup: e.target.value,
                      })
                    }
                    options={locations}
                    placeholder="Pickup"
                  />

                  <GlassSelect
                    icon={MapPin}
                    label="Dropoff Location"
                    value={form.dropoff}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dropoff: e.target.value,
                      })
                    }
                    options={locations}
                    placeholder="Dropoff"
                  />
                </div>

                {/* DATES */}
                <div className="grid gap-5 md:grid-cols-2">
                  <GlassInput
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

                  <GlassInput
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

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-semibold transition-all duration-300 ${
                    isValid
                      ? "bg-red-600 text-white hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_35px_rgba(220,38,38,0.45)]"
                      : "cursor-not-allowed bg-white/10 text-gray-500"
                  }`}
                >
                  Continue Booking
                  <ChevronRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fafafa] via-white to-[#f3f3f3] py-28">
        {/* BG */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          {/* HEADER */}
          <div className="mb-16 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
              Featured Fleet
            </span>

            <h2 className="mt-5 text-5xl font-black tracking-tight text-black">
              Luxury Vehicles
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              Hand-selected premium vehicles crafted for comfort, elegance, and
              performance.
            </p>
          </div>

          {/* GRID */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.name}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_100px_rgba(0,0,0,0.12)]"
              >
                {/* IMAGE */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-5 left-5 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-xl shadow-red-500/20">
                    ${car.price}/day
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-black">
                        {car.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Premium Rental Vehicle
                      </p>
                    </div>
                  </div>

                  {/* SPECS */}
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <FeatureSpec
                      icon={<Users size={16} />}
                      label="Seats"
                      value={`${car.seats || 5}`}
                    />

                    <FeatureSpec
                      icon={<Fuel size={16} />}
                      label="Fuel"
                      value={car.fuel || "Gasoline"}
                    />
                  </div>

                  {/* CTA */}
                  <Link
                    href={{
                      pathname: "/booking",
                      query: {
                        carId: car.id ?? index,
                        carName: car.name,
                        carImage: car.image,
                        carPrice: car.price,
                        fuel: car.fuel || "",
                        seats: car.seats?.toString() || "",
                      },
                    }}
                    className="group mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_35px_rgba(220,38,38,0.35)]"
                  >
                    Book Now
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="relative overflow-hidden bg-black py-28">
        {/* GLOW */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-red-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
              Why Choose Us
            </span>

            <h2 className="mt-5 text-5xl font-black tracking-tight text-white">
              Premium Experience
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  viewport={{ once: true }}
                  className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-red-500/40"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-500/20">
                    <Icon className="text-white" size={28} />
                  </div>

                  <h3 className="mt-7 text-2xl font-black text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-relaxed text-gray-400">
                    {feature.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-white py-28">
        {/* BG */}
        <div className="absolute inset-0 overflow-hidden opacity-70">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-red-600/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-black tracking-tight text-black">
            Ready To Hit The Road?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Reserve your dream vehicle today and experience luxury, reliability,
            and exceptional service.
          </p>

          <Link
            href="/cars"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-[0_0_35px_rgba(220,38,38,0.45)]"
          >
            Explore Vehicles
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}

/* =========================================
   INPUTS
========================================= */

function GlassInput({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  icon?: any;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
          size={18}
        />
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border border-white/10 bg-white/10 py-4 pr-4 text-white outline-none backdrop-blur-md transition-all duration-300 placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 ${
          Icon ? "pl-12" : "px-4"
        }`}
      />
    </div>
  );
}

function GlassSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  icon: any;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-white/80">
          {label}
        </label>
      )}
      <div className="relative">
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
          size={18}
        />

        <select
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 outline-none backdrop-blur-md transition-all duration-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 ${
            value ? "text-white" : "text-gray-400"
          }`}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option} className="text-black">
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FeatureSpec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#fafafa] p-4 text-center transition-all duration-300 hover:bg-red-50">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10 text-red-600">
        {icon}
      </div>

      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-black">{value}</p>
    </div>
  );
}
