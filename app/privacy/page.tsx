"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </span>

            <h1 className="mt-6 text-5xl font-black text-black">
              Your Privacy Matters
            </h1>

            <p className="mt-5 text-gray-600">
              We are committed to protecting your personal information and
              ensuring transparency in how we use it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mt-16">
        <div className="mx-auto max-w-4xl px-6 space-y-10 text-gray-700 leading-relaxed">
          <Block title="1. Information We Collect">
            We collect personal details such as name, email, phone number,
            booking details, and payment-related information strictly for rental
            services.
          </Block>

          <Block title="2. How We Use Your Information">
            Your information is used to process bookings, provide customer
            support, improve our services, and ensure secure transactions.
          </Block>

          <Block title="3. Data Protection">
            We use industry-standard security measures to protect your data from
            unauthorized access, disclosure, or misuse.
          </Block>

          <Block title="4. Sharing of Information">
            We do not sell or rent your personal data. Information may only be
            shared with trusted service providers required to complete your
            booking.
          </Block>

          <Block title="5. Cookies">
            We may use cookies to improve website performance, enhance user
            experience, and analyze traffic patterns.
          </Block>

          <Block title="6. Your Rights">
            You may request access, correction, or deletion of your personal
            data at any time by contacting our support team.
          </Block>

          <Block title="7. Contact Us">
            If you have any questions about this Privacy Policy, contact us via
            our support page or email.
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
