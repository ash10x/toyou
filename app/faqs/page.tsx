"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronDown,
  Search,
  ShieldCheck,
  Clock3,
  CarFront,
} from "lucide-react";

const faqCategories = ["All", "Bookings", "Payments", "Vehicles", "Policies"];

const faqs = [
  {
    category: "Bookings",
    question: "How do I book a rental vehicle?",
    answer:
      "You can easily reserve a vehicle through our online booking system by selecting your vehicle, pickup location, dates, and submitting your booking request.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept major debit cards, credit cards, bank transfers, and secure online payments for all bookings.",
  },
  {
    category: "Vehicles",
    question: "Are your vehicles fully insured?",
    answer:
      "Yes. All rental vehicles include insurance coverage for your safety and peace of mind during your rental period.",
  },
  {
    category: "Policies",
    question: "What is your cancellation policy?",
    answer:
      "Bookings can be cancelled within the allowed cancellation window. Refund eligibility depends on the booking terms provided during checkout.",
  },
  {
    category: "Bookings",
    question: "Can I modify my reservation after booking?",
    answer:
      "Yes. Reservation updates can be requested through our support team depending on vehicle availability and scheduling.",
  },
  {
    category: "Vehicles",
    question: "Do you offer luxury and economy vehicles?",
    answer:
      "Yes. Our fleet includes luxury sedans, SUVs, economy vehicles, vans, and premium sports vehicles.",
  },
  {
    category: "Policies",
    question: "Is there a mileage limit on rentals?",
    answer:
      "Mileage limits may vary depending on the selected vehicle and rental package. Full details are provided before booking confirmation.",
  },
  {
    category: "Payments",
    question: "Do I need a security deposit?",
    answer:
      "Yes. Some vehicles may require a refundable security deposit before vehicle pickup.",
  },
];

const supportCards = [
  {
    icon: Clock3,
    title: "24/7 Customer Support",
    text: "Our team is available anytime to assist with your booking and rental needs.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure Rentals",
    text: "All rentals include secure booking and fully maintained vehicles.",
  },
  {
    icon: CarFront,
    title: "Premium Vehicle Fleet",
    text: "Choose from luxury, SUV, economy, and premium rental vehicles.",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;

    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#fafafa] pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          {/* TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              Support Center
            </span>

            <h1 className="mt-6 text-5xl font-black text-black md:text-6xl">
              Frequently Asked Questions
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
              Find answers to common questions about bookings, payments,
              vehicles, rental policies, and more.
            </p>
          </motion.div>

          {/* SEARCH + FILTER */}
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
                  placeholder="Search FAQs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-14 pr-5 text-black outline-none transition-all placeholder:text-gray-500 focus:border-red-500"
                />
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-3">
                {faqCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-black/5 text-black hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_380px] lg:px-10">
          {/* FAQ ACCORDION */}
          <div className="space-y-5">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-black/10 bg-white py-20 text-center">
                <h3 className="text-3xl font-bold text-black">No FAQs Found</h3>

                <p className="mt-3 text-gray-500">
                  Try adjusting your search or category filters.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isActive = activeIndex === index;

                return (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
                  >
                    <button
                      onClick={() => setActiveIndex(isActive ? null : index)}
                      className="flex w-full items-center justify-between gap-5 p-7 text-left"
                    >
                      <div>
                        <span className="mb-3 inline-flex rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-600">
                          {faq.category}
                        </span>

                        <h3 className="text-xl font-bold text-black">
                          {faq.question}
                        </h3>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "bg-red-600 text-white"
                            : "bg-[#fafafa] text-black"
                        }`}
                      >
                        <ChevronDown
                          size={22}
                          className={`transition-transform duration-300 ${
                            isActive ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="border-t border-black/5 px-7 pb-7 pt-5">
                            <p className="leading-relaxed text-gray-600">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* SUPPORT SIDEBAR */}
          <div className="space-y-6">
            {supportCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-black">
                    {card.title}
                  </h3>

                  <p className="mt-4 leading-relaxed text-gray-600">
                    {card.text}
                  </p>
                </motion.div>
              );
            })}

            {/* CONTACT BOX */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="rounded-[2rem] bg-black p-8 text-white"
            >
              <span className="inline-flex rounded-full bg-red-600/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-red-500">
                Need More Help?
              </span>

              <h3 className="mt-5 text-3xl font-black">Contact Our Team</h3>

              <p className="mt-4 leading-relaxed text-gray-400">
                Our support team is ready to assist with your bookings, rentals,
                and vehicle inquiries.
              </p>

              <button className="mt-8 w-full rounded-2xl bg-red-600 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.45)]">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
