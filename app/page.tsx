"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { motion } from "framer-motion";

type FeaturedCar = { name: string; image: string; price: number };

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

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/featured-cars");
        const json = await res.json();
        if (json?.featured) setFeaturedCars(json.featured as FeaturedCar[]);
      } catch (err) {
        console.error("Failed to load featured cars", err);
      }
    }

    loadFeatured();
  }, []);

  return (
    <main className="overflow-hidden bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen">
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero1.jpg"
            alt="Luxury Rental Car"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-6 pb-20 pt-32 lg:grid-cols-2 lg:px-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-red-500/30 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 backdrop-blur-md">
              Premium Car Rentals
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-tight text-white md:text-6xl">
              Drive In Style With{" "}
              <span className="text-red-500">ToYou Car Rentals</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
              Affordable luxury vehicles, seamless booking, and premium customer
              service designed for your comfort and convenience.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/cars"
                className="group inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.45)]"
              >
                View Cars
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

          {/* BOOKING FORM */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white">
                Book Your Vehicle
              </h2>

              <p className="mt-2 text-gray-300">
                Reserve your car quickly and securely.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();

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
              {/* FULL NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-400 focus:border-red-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-400 focus:border-red-500"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+1 (876) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-400 focus:border-red-500"
                />
              </div>

              {/* PICKUP */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Pickup Location
                </label>

                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                    size={18}
                  />

                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={form.pickup}
                    onChange={(e) =>
                      setForm({ ...form, pickup: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-400 focus:border-red-500"
                  />
                </div>
              </div>

              {/* DROPOFF */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Dropoff Location
                </label>

                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                    size={18}
                  />

                  <input
                    type="text"
                    placeholder="Enter dropoff location"
                    value={form.dropoff}
                    onChange={(e) =>
                      setForm({ ...form, dropoff: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-400 focus:border-red-500"
                  />
                </div>
              </div>

              {/* DATES */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Pickup Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                      size={18}
                    />

                    <input
                      type="date"
                      value={form.pickupDate}
                      onChange={(e) =>
                        setForm({ ...form, pickupDate: e.target.value })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-white outline-none backdrop-blur-md transition-all focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Dropoff Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                      size={18}
                    />

                    <input
                      type="date"
                      value={form.dropoffDate}
                      onChange={(e) =>
                        setForm({ ...form, dropoffDate: e.target.value })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-white outline-none backdrop-blur-md transition-all focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-red-600 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.45)]"
              >
                Book Now
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
              Featured Fleet
            </span>

            <h2 className="mt-4 text-4xl font-black text-black">
              Explore Our Luxury Vehicles
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-black">
                      {car.name}
                    </h3>

                    <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
                      ${car.price}/day
                    </span>
                  </div>

                  <button className="mt-6 w-full rounded-2xl bg-black py-4 font-semibold text-white transition-all duration-300 hover:bg-red-600">
                    Rent Vehicle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
              Why Choose Us
            </span>

            <h2 className="mt-4 text-4xl font-black text-white">
              Premium Service Experience
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600">
                    <Icon className="text-white" size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-white">
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
      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-red-600 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-black leading-tight text-black">
            Ready To Hit The Road?
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Book your dream vehicle today and experience premium comfort,
            reliability, and exceptional customer service.
          </p>

          <Link
            href="/booking"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-[0_0_35px_rgba(220,38,38,0.45)]"
          >
            Reserve Your Vehicle
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
