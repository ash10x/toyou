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

  // Routes that render their own full-screen shell (no site nav/footer)
  const SHELL_HIDDEN = ["/admin", "/login", "/dashboard", "/hoster", "/profile"];
  const hideShell = SHELL_HIDDEN.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  const businessInfo = hideShell ? null : await getBusinessInfo();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {!hideShell && <Navbar />}
        {children}
        {!hideShell && <Footer businessInfo={businessInfo} />}
      </body>
    </html>
  );
}
