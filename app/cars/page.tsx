/* =========================================
   app/cars/page.tsx
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
                .filter((v): v is string => typeof v === "string" && v.length > 0),
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

  const filteredCars = useMemo(
    () =>
      cars.filter((car) => {
        const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
        const matchesBody = selectedBody === "All" || car.body === selectedBody;
        return matchesSearch && matchesBody;
      }),
    [search, selectedBody, cars],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f7] pt-32">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[28rem] w-[28rem] rounded-full bg-red-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-zinc-900/5 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-14 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
              <Sparkles size={11} />
              Premium Fleet
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tighter text-zinc-950 md:text-7xl">
              Luxury Vehicles
              <span className="mt-1 block text-red-600">Ready to Reserve</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500">
              Explore high-end rentals curated for executive travel, luxury
              experiences, and elevated comfort.
            </p>
          </motion.div>

          {/* FILTERS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 rounded-2xl border border-zinc-100 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full lg:max-w-sm">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-100 bg-[#f5f5f7] pl-11 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                />
              </div>

              {/* CATEGORY CHIPS */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="mr-1 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                  <SlidersHorizontal size={13} />
                  Filter
                </div>
                {bodyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedBody(type)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      selectedBody === type
                        ? "bg-zinc-950 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
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
            <div className="rounded-3xl border border-dashed border-zinc-200 bg-white py-24 text-center">
              <h3 className="text-2xl font-black tracking-tight text-zinc-900">No Vehicles Found</h3>
              <p className="mt-3 text-sm text-zinc-400">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="group overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
                >
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={car.image || "https://via.placeholder.com/600x350"}
                      alt={car.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                      ${car.price}/day
                    </div>
                    {car.transmission && (
                      <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        {car.transmission}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <h2 className="text-xl font-black tracking-tight text-zinc-950">{car.name}</h2>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      Premium {car.body ?? "Vehicle"} Rental
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <SpecCard icon={<Users size={15} />} label="Seats" value={car.seats != null ? String(car.seats) : "—"} />
                      <SpecCard icon={<Fuel size={15} />} label="Fuel" value={car.fuel ?? "—"} />
                      <SpecCard icon={<CarFront size={15} />} label="Body" value={car.body ?? "—"} />
                    </div>

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
                      className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-[0_0_24px_rgba(220,38,38,0.35)]"
                    >
                      Reserve Vehicle
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </Link>
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
    <div className="rounded-xl bg-[#f5f5f7] px-2 py-3 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-red-600/10 text-red-600">
        {icon}
      </div>
      <p className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-zinc-900">{value}</p>
    </div>
  );
}
