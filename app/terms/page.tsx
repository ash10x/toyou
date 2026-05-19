"use client";

import { motion } from "framer-motion";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 pb-24">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Terms of Service
            </span>

            <h1 className="mt-6 text-5xl font-black text-black">
              Rental Terms & Conditions
            </h1>

            <p className="mt-5 text-gray-600">
              By using our services, you agree to the following terms and
              conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mt-16">
        <div className="mx-auto max-w-4xl px-6 space-y-10 text-gray-700 leading-relaxed">
          <Block title="1. Eligibility">
            Customers must be 21 years or older and possess a valid driver’s
            license.
          </Block>

          <Block title="2. Booking Policy">
            All bookings are subject to availability and confirmation. Payment
            may be required upfront.
          </Block>

          <Block title="3. Rental Usage">
            Vehicles must be used responsibly and in accordance with local
            traffic laws. Unauthorized use is strictly prohibited.
          </Block>

          <Block title="4. Payments & Fees">
            Rental fees are calculated per day. Additional charges may apply for
            damages, late returns, or extra mileage.
          </Block>

          <Block title="5. Cancellations">
            Cancellations made within the allowed timeframe may be eligible for
            partial refunds.
          </Block>

          <Block title="6. Liability">
            We are not liable for personal belongings left in vehicles or
            incidents caused by misuse.
          </Block>

          <Block title="7. Agreement">
            By booking a vehicle, you acknowledge and agree to these terms in
            full.
          </Block>
        </div>
      </section>
    </main>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white border border-black/5 p-6 shadow-sm">
      <h2 className="text-lg font-black text-black">{title}</h2>
      <p className="mt-3 text-sm">{children}</p>
    </div>
  );
}
