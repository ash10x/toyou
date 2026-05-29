import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getBusinessInfo } from "@/server/db/queries";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const info = await getBusinessInfo();

  const phone = info?.phone ?? null;
  const email = info?.email ?? null;
  const address = info?.address ?? null;
  const hours = info?.hours ?? null;
  const mapsEmbedUrl = info?.maps_embed_url ?? null;

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-32">

      {/* HERO */}
      <section className="relative overflow-hidden pb-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-red-600/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-10">
          <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
            Contact Us
          </span>
          <h1 className="mt-6 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
            We&apos;re Here to Help
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
            Have questions, booking requests, or partnership inquiries? Our team
            is ready to assist you.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-10">

          {/* FORM CARD */}
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-black tracking-tight text-zinc-950">Send a Message</h2>
            <p className="mt-2 text-sm text-zinc-400">We typically respond within a few hours.</p>
            <ContactForm />
          </div>

          {/* INFO COLUMN */}
          <div className="space-y-4">
            {phone && <InfoCard icon={Phone} title="Phone" text={phone} />}
            {email && <InfoCard icon={Mail} title="Email" text={email} />}
            {address && <InfoCard icon={MapPin} title="Location" text={address} />}
            {hours && <InfoCard icon={Clock} title="Business Hours" text={hours} />}

            {mapsEmbedUrl && (
              <div className="h-64 overflow-hidden rounded-2xl border border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
                <iframe
                  src={mapsEmbedUrl}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 shadow-md shadow-red-900/20">
        <Icon className="text-white" size={17} />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">{title}</p>
        <p className="mt-0.5 text-sm font-medium text-zinc-900">{text}</p>
      </div>
    </div>
  );
}
