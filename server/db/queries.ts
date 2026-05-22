import { sql, eq } from "drizzle-orm";
import { db } from "./client";
import {
  cars,
  contact_messages,
  faqs,
  locations,
  bookings,
  business_info,
} from "./schema";

export async function getCars() {
  return await db.select().from(cars).orderBy(cars.id);
}

export async function getLocations() {
  const rows = await db
    .select({ name: locations.name })
    .from(locations)
    .orderBy(locations.name);
  return rows.map((r) => r.name);
}

export async function getFaqs() {
  return await db.select().from(faqs).orderBy(faqs.id);
}

export async function getFeaturedCars() {
  return await db
    .select({
      id: cars.id,
      name: cars.name,
      image: cars.image,
      price: cars.price,
    })
    .from(cars)
    .where(eq(cars.featured, true))
    .orderBy(cars.id);
}

export async function getStats() {
  const vehiclesRes = await db
    .select({ vehicles: sql<number>`COUNT(*)::int` })
    .from(cars)
    .limit(1);
  const locationsRes = await db
    .select({ locations: sql<number>`COUNT(*)::int` })
    .from(locations)
    .limit(1);

  let customers: number | null = null;
  try {
    const customersRes = await db
      .select({ customers: sql<number>`COUNT(*)::int` })
      .from(sql`customers`)
      .limit(1);
    customers = customersRes[0]?.customers ?? null;
  } catch {
    customers = null;
  }

  return {
    vehicles: vehiclesRes[0]?.vehicles ?? 0,
    locations: locationsRes[0]?.locations ?? 0,
    customers,
  };
}

export async function createContactMessage(message: {
  name: string;
  email: string;
  message: string;
}) {
  const [created] = await db
    .insert(contact_messages)
    .values({
      name: message.name,
      email: message.email,
      message: message.message,
    })
    .returning();
  return created;
}

export async function getBusinessInfo() {
  const rows = await db
    .select()
    .from(business_info)
    .where(eq(business_info.id, 1))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertBusinessInfo(info: Partial<{
  phone: string;
  email: string;
  address: string;
  hours: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  maps_embed_url: string;
}>) {
  const [row] = await db
    .insert(business_info)
    .values({ id: 1, ...info })
    .onConflictDoUpdate({ target: business_info.id, set: info })
    .returning();
  return row;
}

export async function createBooking(booking: {
  car_id: number;
  full_name: string;
  email: string;
  phone: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
}) {
  const [created] = await db
    .insert(bookings)
    .values({
      car_id: booking.car_id,
      full_name: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      pickup_location: booking.pickup_location,
      dropoff_location: booking.dropoff_location,
      pickup_date: booking.pickup_date,
      dropoff_date: booking.dropoff_date,
      total_price: booking.total_price,
    })
    .returning();
  return created;
}
