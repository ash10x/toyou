import { sql, eq } from "drizzle-orm";
import { db } from "./client";
import { cars, faqs, locations, users } from "./schema";

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

// Admin CRUD helpers
export async function createCar(car: {
  name: string;
  image: string;
  price: number;
  seats?: number;
  fuel?: string;
  body?: string;
  transmission?: string;
  featured?: boolean;
}) {
  const [created] = await db
    .insert(cars)
    .values({
      name: car.name,
      image: car.image,
      price: car.price,
      seats: car.seats ?? null,
      fuel: car.fuel ?? null,
      body: car.body ?? null,
      transmission: car.transmission ?? null,
      featured: !!car.featured,
    })
    .returning();
  return created;
}

export async function updateCar(
  id: number,
  fields: Partial<{
    name: string;
    image: string;
    price: number;
    seats: number;
    fuel: string;
    body: string;
    transmission: string;
    featured: boolean;
  }>,
) {
  const [updated] = await db
    .update(cars)
    .set({
      ...(fields.name !== undefined ? { name: fields.name } : {}),
      ...(fields.image !== undefined ? { image: fields.image } : {}),
      ...(fields.price !== undefined ? { price: fields.price } : {}),
      ...(fields.seats !== undefined ? { seats: fields.seats } : {}),
      ...(fields.fuel !== undefined ? { fuel: fields.fuel } : {}),
      ...(fields.body !== undefined ? { body: fields.body } : {}),
      ...(fields.transmission !== undefined
        ? { transmission: fields.transmission }
        : {}),
      ...(fields.featured !== undefined ? { featured: fields.featured } : {}),
    })
    .where(eq(cars.id, id))
    .returning();
  return updated;
}

export async function deleteCar(id: number) {
  await db.delete(cars).where(eq(cars.id, id));
  return { id };
}

export async function getUsers() {
  return await db.select().from(users).orderBy(users.id);
}

export async function getUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return rows[0] ?? null;
}

export async function updateUser(
  id: number,
  fields: Partial<{ name: string; email: string; is_admin: boolean }>,
) {
  const [updated] = await db
    .update(users)
    .set({
      ...(fields.name !== undefined ? { name: fields.name } : {}),
      ...(fields.email !== undefined ? { email: fields.email } : {}),
      ...(fields.is_admin !== undefined ? { is_admin: fields.is_admin } : {}),
    })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      is_admin: users.is_admin,
    });
  return updated;
}
