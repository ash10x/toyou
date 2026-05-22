import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getBusinessInfo } from "@/server/db/queries";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  let info = null;
  try {
    info = await getBusinessInfo();
  } catch {
    // DB unavailable during static pre-rendering
  }

  const phone = info?.phone ?? null;
  const email = info?.email ?? null;
  const address = info?.address ?? null;
  const hours = info?.hours ?? null;
  const mapsEmbedUrl = info?.maps_embed_url ?? null;

  return (
    <main className="min-h-screen bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-16 text-center">
          <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Contact Us
          </span>

          <h1 className="mt-6 text-5xl font-black text-black md:text-6xl">
            We're Here to Help
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Have questions, booking requests, or partnership inquiries? Our team
            is ready to assist you.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-10">
          {/* CONTACT FORM */}
          <div className="rounded-[2rem] bg-white border border-black/5 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-black text-black">Send a Message</h2>

            <p className="mt-2 text-gray-500 text-sm">
              We typically respond within a few hours.
            </p>

            <ContactForm />
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-6">
            {phone && (
              <InfoCard icon={Phone} title="Phone" text={phone} />
            )}

            {email && (
              <InfoCard icon={Mail} title="Email" text={email} />
            )}

            {address && (
              <InfoCard icon={MapPin} title="Location" text={address} />
            )}

            {hours && (
              <InfoCard icon={Clock} title="Business Hours" text={hours} />
            )}

            {/* MAP BLOCK */}
            {mapsEmbedUrl && (
              <div className="rounded-[2rem] overflow-hidden border border-black/5 h-72 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <iframe
                  src={mapsEmbedUrl}
                  className="w-full h-full"
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
    <div className="rounded-[2rem] bg-white border border-black/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
        <Icon className="text-white" size={18} />
      </div>

      <div>
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}
