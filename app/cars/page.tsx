"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import {
  Search,
  Users,
  Fuel,
  CarFront,
  SlidersHorizontal,
  ArrowRight,
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
  {
    id: 5,
    name: "Range Rover Sport",
    image: "/cars/range-rover.jpg",
    price: 180,
    seats: 7,
    fuel: "Diesel",
    body: "SUV",
    transmission: "Automatic",
  },
  {
    id: 6,
    name: "Toyota Hiace",
    image: "/cars/hiace.jpg",
    price: 140,
    seats: 12,
    fuel: "Diesel",
    body: "Van",
    transmission: "Manual",
  },
];

const bodyTypes = ["All", "SUV", "Sedan", "Hatchback", "Van"];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [selectedBody, setSelectedBody] = useState("All");

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = car.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBody = selectedBody === "All" || car.body === selectedBody;

      return matchesSearch && matchesBody;
    });
  }, [search, selectedBody]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center rounded-full border border-red-600/20 bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              Premium Fleet
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight text-black md:text-6xl">
              Explore Our Vehicle Inventory
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
              Browse premium rental vehicles designed for luxury, comfort,
              family travel, and business trips.
            </p>
          </motion.div>

          {/* FILTERS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-14 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
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
                  placeholder="Search vehicles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-14 pr-5 text-black outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500 focus:bg-white"
                />
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <SlidersHorizontal size={16} />
                  Filter:
                </div>

                {bodyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedBody(type)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      selectedBody === type
                        ? "bg-red-600 text-white shadow-lg"
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

      {/* INVENTORY GRID */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {filteredCars.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-black/10 bg-white py-20 text-center">
              <h3 className="text-3xl font-bold text-black">
                No Vehicles Found
              </h3>

              <p className="mt-3 text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                >
                  {/* IMAGE */}
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute bottom-5 left-5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                      ${car.price}/day
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    {/* TOP */}
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
                      {/* SEATS */}
                      <div className="rounded-2xl bg-[#fafafa] p-4 text-center transition-all duration-300 hover:bg-red-50">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                          <Users size={18} />
                        </div>

                        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Seats
                        </p>

                        <p className="mt-1 text-lg font-bold text-black">
                          {car.seats}
                        </p>
                      </div>

                      {/* FUEL */}
                      <div className="rounded-2xl bg-[#fafafa] p-4 text-center transition-all duration-300 hover:bg-red-50">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                          <Fuel size={18} />
                        </div>

                        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Fuel
                        </p>

                        <p className="mt-1 text-sm font-bold text-black">
                          {car.fuel}
                        </p>
                      </div>

                      {/* BODY */}
                      <div className="rounded-2xl bg-[#fafafa] p-4 text-center transition-all duration-300 hover:bg-red-50">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                          <CarFront size={18} />
                        </div>

                        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Body
                        </p>

                        <p className="mt-1 text-sm font-bold text-black">
                          {car.body}
                        </p>
                      </div>
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
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.35)]"
                      >
                        Book Now
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
