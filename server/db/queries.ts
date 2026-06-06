import { sql, eq, desc, or } from "drizzle-orm";
import { db } from "./client";
import {
  cars,
  contact_messages,
  faqs,
  locations,
  bookings,
  business_info,
  vehicle_listings,
  profit_split_config,
  admin_users,
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

export async function getProfitSplitConfig() {
  const rows = await db
    .select()
    .from(profit_split_config)
    .where(eq(profit_split_config.id, 1))
    .limit(1);
  return rows[0] ?? { host_percentage: 80, platform_percentage: 20, payment_delay_days: 3 };
}

export async function upsertProfitSplitConfig(data: Partial<{
  host_percentage: number;
  platform_percentage: number;
  payment_delay_days: number;
}>) {
  const [row] = await db
    .insert(profit_split_config)
    .values({ id: 1, ...data, updated_at: new Date() })
    .onConflictDoUpdate({
      target: profit_split_config.id,
      set: { ...data, updated_at: new Date() },
    })
    .returning();
  return row;
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

export async function createVehicleListing(data: {
  reference_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zip_code: string;
  is_registered_owner: boolean;
  year: string;
  make: string;
  model: string;
  trim?: string;
  color: string;
  vin: string;
  license_plate: string;
  mileage: number;
  title_status: string;
  accident_history: string;
  vehicle_condition: string;
  has_mechanical_issues: boolean;
  mechanical_issues_description?: string;
  photo_files: string;
  document_files: string;
  listing_reason: string;
  usage_frequency: string;
  available_days_per_month: string;
  pickup_location_type: string;
  street_address: string;
  location_zip: string;
  has_gps: boolean;
  has_carplay: boolean;
  has_android_auto: boolean;
  has_backup_camera: boolean;
  has_leather_seats: boolean;
  has_sunroof: boolean;
  has_third_row: boolean;
  fleet_interest?: string;
  payment_method?: string;
  bank_name?: string;
  account_holder_name?: string;
  routing_number?: string;
  account_number?: string;
  account_type?: string;
  review_expires_at: Date;
}) {
  const [created] = await db
    .insert(vehicle_listings)
    .values(data)
    .returning();
  return created;
}

// ── Admin user queries ────────────────────────────────────────────────────

export async function getAllAdminUsers() {
  return await db
    .select({ id: admin_users.id, username: admin_users.username, email: admin_users.email, role: admin_users.role, created_at: admin_users.created_at })
    .from(admin_users)
    .orderBy(admin_users.created_at);
}

export async function getAdminUserByLogin(usernameOrEmail: string) {
  const rows = await db
    .select()
    .from(admin_users)
    .where(or(eq(admin_users.username, usernameOrEmail), eq(admin_users.email, usernameOrEmail)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAdminUserById(id: number) {
  const rows = await db.select().from(admin_users).where(eq(admin_users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function countAdminUsers(): Promise<number> {
  const rows = await db.select({ count: sql<number>`COUNT(*)::int` }).from(admin_users);
  return rows[0]?.count ?? 0;
}

export async function createAdminUser(data: {
  username: string;
  email: string;
  password_hash: string;
  role: string;
}) {
  const [created] = await db.insert(admin_users).values(data).returning();
  return created;
}

export async function updateAdminUserRole(id: number, role: string) {
  const [updated] = await db.update(admin_users).set({ role }).where(eq(admin_users.id, id)).returning();
  return updated;
}

export async function deleteAdminUserById(id: number) {
  await db.delete(admin_users).where(eq(admin_users.id, id));
}

// ── Admin queries ─────────────────────────────────────────────────────────

// Bookings
export async function getAllBookings() {
  return await db.select().from(bookings).orderBy(desc(bookings.created_at));
}

export async function getBookingById(id: number) {
  const rows = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function deleteBookingById(id: number) {
  await db.delete(bookings).where(eq(bookings.id, id));
}

// Vehicle listings
export async function getAllListings() {
  return await db.select().from(vehicle_listings).orderBy(desc(vehicle_listings.created_at));
}

export async function getListingById(id: number) {
  const rows = await db.select().from(vehicle_listings).where(eq(vehicle_listings.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function updateListingStatus(id: number, status: string) {
  const [row] = await db
    .update(vehicle_listings)
    .set({ status })
    .where(eq(vehicle_listings.id, id))
    .returning();
  return row;
}

export async function deleteListingById(id: number) {
  await db.delete(vehicle_listings).where(eq(vehicle_listings.id, id));
}

// Cars
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
  const [created] = await db.insert(cars).values(car).returning();
  return created;
}

export async function updateCar(
  id: number,
  car: Partial<{
    name: string;
    image: string;
    price: number;
    seats: number;
    fuel: string;
    body: string;
    transmission: string;
    featured: boolean;
  }>
) {
  const [updated] = await db.update(cars).set(car).where(eq(cars.id, id)).returning();
  return updated;
}

export async function deleteCarById(id: number) {
  await db.delete(cars).where(eq(cars.id, id));
}

// Contact messages
export async function getAllContactMessages() {
  return await db.select().from(contact_messages).orderBy(desc(contact_messages.created_at));
}

export async function deleteContactMessageById(id: number) {
  await db.delete(contact_messages).where(eq(contact_messages.id, id));
}

// Locations
export async function getAllLocations() {
  return await db.select().from(locations).orderBy(locations.name);
}

export async function createLocation(name: string) {
  const [created] = await db.insert(locations).values({ name }).returning();
  return created;
}

export async function deleteLocationById(id: number) {
  await db.delete(locations).where(eq(locations.id, id));
}

// FAQs
export async function createFaq(faq: { question: string; answer: string; category: string }) {
  const [created] = await db.insert(faqs).values(faq).returning();
  return created;
}

export async function updateFaq(
  id: number,
  faq: Partial<{ question: string; answer: string; category: string }>
) {
  const [updated] = await db.update(faqs).set(faq).where(eq(faqs.id, id)).returning();
  return updated;
}

export async function deleteFaqById(id: number) {
  await db.delete(faqs).where(eq(faqs.id, id));
}

// Dashboard stats
export async function getAdminStats() {
  const [b, l, c, m] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)::int` }).from(bookings),
    db.select({ count: sql<number>`COUNT(*)::int` }).from(vehicle_listings),
    db.select({ count: sql<number>`COUNT(*)::int` }).from(cars),
    db.select({ count: sql<number>`COUNT(*)::int` }).from(contact_messages),
  ]);
  const pendingListings = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(vehicle_listings)
    .where(eq(vehicle_listings.status, "pending"));
  return {
    bookings: b[0]?.count ?? 0,
    listings: l[0]?.count ?? 0,
    cars: c[0]?.count ?? 0,
    messages: m[0]?.count ?? 0,
    pendingListings: pendingListings[0]?.count ?? 0,
  };
}

// ── Public queries (below) ─────────────────────────────────────────────────

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
