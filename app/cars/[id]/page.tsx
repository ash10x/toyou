import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Fuel,
  CarFront,
  Cog,
  ShieldCheck,
  Star,
  MapPin,
} from "lucide-react";
import { getCarById } from "@/server/db/queries";

export default async function CarShowcasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCarById(Number(id));
  if (!car) notFound();

  const bookingQuery = new URLSearchParams({
    carId: String(car.id),
    carName: car.name,
    carImage: car.image,
    carPrice: String(car.price),
    ...(car.transmission ? { transmission: car.transmission } : {}),
    ...(car.body ? { body: car.body } : {}),
    ...(car.fuel ? { fuel: car.fuel } : {}),
    ...(car.seats != null ? { seats: String(car.seats) } : {}),
  });

  const specs = [
    { icon: <Users size={20} />, label: "Seats", value: car.seats != null ? `${car.seats} passengers` : "—" },
    { icon: <Fuel size={20} />, label: "Fuel Type", value: car.fuel ?? "—" },
    { icon: <Cog size={20} />, label: "Transmission", value: car.transmission ?? "—" },
    { icon: <CarFront size={20} />, label: "Body Type", value: car.body ?? "—" },
  ];

  const highlights = [
    "Fully insured & roadworthy",
    "24/7 roadside assistance",
    "Clean & sanitized before each rental",
    "Flexible pickup & return locations",
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      {/* ── HERO ── */}
      <div className="relative h-[65vh] min-h-[420px] w-full overflow-hidden bg-zinc-900">
        <Image
          src={car.image || "https://via.placeholder.com/1200x700"}
          alt={car.name}
          fill
          priority
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10" />

        {/* Back */}
        <div className="absolute left-6 top-28">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ArrowLeft size={15} />
            Back to Fleet
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-400">
            Premium {car.body ?? "Vehicle"} Rental
          </p>
          <h1 className="text-4xl font-black tracking-tighter text-white md:text-6xl lg:text-7xl">
            {car.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <span className="ml-1">Premium listing</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <MapPin size={11} />
              Available now
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-sm">
              <ShieldCheck size={11} />
              Fully insured
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Specs */}
            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <h2 className="mb-6 text-xl font-black tracking-tight text-zinc-950">
                Vehicle Specs
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center rounded-2xl bg-[#f5f5f7] px-4 py-5 text-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                      {s.icon}
                    </div>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      {s.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-zinc-900">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <h2 className="mb-6 text-xl font-black tracking-tight text-zinc-950">
                What&apos;s Included
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-sm text-zinc-600">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <ShieldCheck size={13} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <h2 className="mb-6 text-xl font-black tracking-tight text-zinc-950">
                Rental Policies
              </h2>
              <div className="space-y-3 text-sm text-zinc-500">
                <div className="flex justify-between border-b border-zinc-50 pb-3">
                  <span className="font-medium text-zinc-700">Minimum rental</span>
                  <span>3 days</span>
                </div>
                <div className="flex justify-between border-b border-zinc-50 pb-3">
                  <span className="font-medium text-zinc-700">Advance notice</span>
                  <span>48 hours</span>
                </div>
                <div className="flex justify-between border-b border-zinc-50 pb-3">
                  <span className="font-medium text-zinc-700">Cancellation</span>
                  <span>Free up to 24 hrs before pickup</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-zinc-700">Mileage</span>
                  <span>Unlimited</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — STICKY BOOKING PANEL */}
          <div>
            <div className="sticky top-28 overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
              {/* Accent bar */}
              <div className="h-1.5 bg-red-600" />

              <div className="p-7">
                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black tracking-tight text-zinc-950">
                    ${car.price}
                  </span>
                  <span className="text-base font-medium text-zinc-400">/day</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">Taxes and fees included</p>

                {/* Mini specs */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {specs.filter((s) => s.value !== "—").map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-2 rounded-xl bg-[#f5f5f7] px-3 py-2"
                    >
                      <span className="text-red-600">{s.icon}</span>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
                          {s.label}
                        </p>
                        <p className="text-xs font-bold text-zinc-900">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/booking?${bookingQuery.toString()}`}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-sm font-bold text-white transition-all hover:bg-red-700 hover:shadow-[0_0_28px_rgba(220,38,38,0.4)]"
                >
                  Reserve This Vehicle
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>

                <p className="mt-4 text-center text-[11px] text-zinc-400">
                  No charge until your trip is confirmed
                </p>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-4 border-t border-zinc-50 pt-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    Insured
                  </div>
                  <div className="h-3 w-px bg-zinc-100" />
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    Premium fleet
                  </div>
                  <div className="h-3 w-px bg-zinc-100" />
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <MapPin size={13} className="text-red-500" />
                    Available
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
