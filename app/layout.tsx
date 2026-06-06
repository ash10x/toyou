import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "./components/navigation";
import Footer from "./components/footer";
import { getBusinessInfo } from "@/server/db/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ToYou Car Rentals",
  description:
    "Rent a car with ease at ToYou Car Rentals. We offer a wide selection of vehicles, competitive prices, and exceptional customer service. Whether you're planning a weekend getaway or need a reliable ride for your daily commute, we've got you covered. Book your next adventure with us today!",
  icons: {
    icon: "/logo/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  const businessInfo = isAdmin ? null : await getBusinessInfo();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {!isAdmin && <Navbar />}
        {children}
        {!isAdmin && <Footer businessInfo={businessInfo} />}
      </body>
    </html>
  );
}
