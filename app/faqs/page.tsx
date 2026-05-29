"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, Search, ShieldCheck, Clock3, CarFront } from "lucide-react";

type FAQ = { id?: number; category: string; question: string; answer: string };

const defaultFaqs: FAQ[] = [];

const supportCards = [
  {
    icon: Clock3,
    title: "24/7 Support",
    text: "Our team is available anytime to assist with your booking and rental needs.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    text: "All rentals include secure booking and fully maintained vehicles.",
  },
  {
    icon: CarFront,
    title: "Premium Fleet",
    text: "Choose from luxury, SUV, economy, and premium rental vehicles.",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);
  const [faqCategories, setFaqCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/faqs");
        const json = await res.json();
        if (json?.faqs) {
          const faqsData = json.faqs as FAQ[];
          setFaqs(faqsData);
          const cats = Array.from(
            new Set(
              faqsData
                .map((f) => f.category)
                .filter((c): c is string => typeof c === "string" && c.length > 0),
            ),
          );
          setFaqCategories(["All", ...cats]);
        }
      } catch (err) {
        console.error("Failed to load faqs", err);
      }
    }
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-32">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-red-600/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span className="inline-flex rounded-full border border-red-600/20 bg-red-600/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
              Support Center
            </span>
            <h1 className="mt-6 text-5xl font-black tracking-tighter text-zinc-950 md:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
              Find answers to common questions about bookings, payments,
              vehicles, rental policies, and more.
            </p>
          </motion.div>

          {/* SEARCH + FILTER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 rounded-2xl border border-zinc-100 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-100 bg-[#f5f5f7] pl-11 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {faqCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-zinc-950 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
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

      {/* FAQ + SIDEBAR */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_360px] lg:px-10">

          {/* ACCORDION */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center">
                <h3 className="text-2xl font-black tracking-tight text-zinc-900">No FAQs Found</h3>
                <p className="mt-3 text-sm text-zinc-400">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isActive = activeIndex === index;
                return (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                      isActive ? "border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)]" : "border-zinc-100"
                    }`}
                  >
                    <button
                      onClick={() => setActiveIndex(isActive ? null : index)}
                      className="flex w-full items-start justify-between gap-5 p-6 text-left"
                    >
                      <div>
                        <span className="inline-flex rounded-full bg-red-600/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-600">
                          {faq.category}
                        </span>
                        <h3 className="mt-3 text-base font-bold tracking-tight text-zinc-900">
                          {faq.question}
                        </h3>
                      </div>
                      <div
                        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                          isActive ? "bg-red-600 text-white" : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="border-t border-zinc-50 px-6 pb-6 pt-4">
                            <p className="text-sm leading-relaxed text-zinc-500">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">
            {supportCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-900/20">
                    <Icon className="text-white" size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-zinc-950">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{card.text}</p>
                </motion.div>
              );
            })}

            {/* CONTACT BOX */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl bg-zinc-950 p-6"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_60%)]" />
              <span className="inline-flex rounded-full bg-red-600/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                Need More Help?
              </span>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-white">Contact Our Team</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Our support team is ready to assist with your bookings, rentals, and vehicle inquiries.
              </p>
              <button className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
