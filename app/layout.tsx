import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navigation";
import Footer from "./components/footer";
import { getBusinessInfo } from "@/server/db/queries";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
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
  const businessInfo = await getBusinessInfo();

  return (
    <html lang="en" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer businessInfo={businessInfo} />
      </body>
    </html>
  );
}
