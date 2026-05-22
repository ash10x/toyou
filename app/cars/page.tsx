/* =========================================
   app/inventory/page.tsx
========================================= */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

import {
  Search,
  Users,
  Fuel,
  CarFront,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
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

const defaultCars: Car[] = [];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [selectedBody, setSelectedBody] = useState("All");
  const [cars, setCars] = useState<Car[]>(defaultCars);
  const [bodyTypes, setBodyTypes] = useState<string[]>(["All"]);

  useEffect(() => {
    async function loadCars() {
      try {
        const res = await fetch("/api/cars");
        const json = await res.json();

        if (json?.cars) {
          const carsData = json.cars as Car[];

          setCars(carsData);

          const types = Array.from(
            new Set(
              carsData
                .map((c) => c.body)
                .filter(
                  (v): v is string => typeof v === "string" && v.length > 0,
                ),
            ),
          );

          setBodyTypes(["All", ...types]);
        }
      } catch (err) {
        console.error("Failed to load cars", err);
      }
    }

    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = car.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBody = selectedBody === "All" || car.body === selectedBody;

      return matchesSearch && matchesBody;
    });
  }, [search, selectedBody, cars]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f7f7] via-white to-[#f3f3f3] pt-32">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-[30rem] w-[30rem] rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-black/10 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600 backdrop-blur">
              <Sparkles size={15} />
              Premium Fleet
            </div>

            <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight text-black md:text-7xl">
              Luxury Vehicles
              <span className="block text-red-600">Ready To Reserve</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
              Explore high-end rentals curated for executive travel, luxury
              experiences, and elevated comfort.
            </p>
          </motion.div>

          {/* FILTERS */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-14 rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full lg:max-w-md">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search premium vehicles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-black/5 bg-white/80 pl-14 pr-5 text-black outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <SlidersHorizontal size={16} />
                  Categories
                </div>

                {bodyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedBody(type)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      selectedBody === type
                        ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                        : "bg-black/5 text-black hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GRID */}
      <section className="relative pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {filteredCars.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 py-24 text-center backdrop-blur">
              <h3 className="text-3xl font-black text-black">
                No Vehicles Found
              </h3>

              <p className="mt-3 text-gray-500">
                Try adjusting your filters or search.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  viewport={{ once: true }}
                  className="group overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 shadow-[0_15px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_100px_rgba(0,0,0,0.12)]"
                >
                  {/* IMAGE */}
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={car.image || "https://via.placeholder.com/600x350"}
                      alt={car.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute bottom-5 left-5 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-xl shadow-red-500/20">
                      ${car.price}/day
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-black">
                          {car.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Premium {car.body} Rental
                        </p>
                      </div>

                      <div className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">
                        {car.transmission}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="mt-8 grid grid-cols-3 gap-3">
                      <SpecCard
                        icon={<Users size={18} />}
                        label="Seats"
                        value={String(car.seats)}
                      />

                      <SpecCard
                        icon={<Fuel size={18} />}
                        label="Fuel"
                        value={String(car.fuel)}
                      />

                      <SpecCard
                        icon={<CarFront size={18} />}
                        label="Body"
                        value={String(car.body)}
                      />
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                      <Link
                        href={{
                          pathname: "/booking",
                          query: {
                            carId: car.id,
                            carName: car.name,
                            carImage: car.image,
                            carPrice: car.price,
                            transmission: car.transmission,
                            body: car.body,
                            fuel: car.fuel,
                            seats: car.seats,
                          },
                        }}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_40px_rgba(220,38,38,0.35)]"
                      >
                        Reserve Vehicle
                        <ArrowRight
                          size={18}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SpecCard({
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
