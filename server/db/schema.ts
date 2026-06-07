import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const admin_users = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  role: text("role").notNull().default("editor"), // super_admin | editor | viewer
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const vehicle_listings = pgTable("vehicle_listings", {
  id: serial("id").primaryKey(),
  reference_number: text("reference_number").notNull().unique(),
  status: text("status").notNull().default("pending"),

  // Step 1 — Owner
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip_code: text("zip_code").notNull(),
  is_registered_owner: boolean("is_registered_owner").notNull(),

  // Step 2 — Vehicle
  year: text("year").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  trim: text("trim"),
  color: text("color").notNull(),
  vin: text("vin").notNull(),
  license_plate: text("license_plate").notNull(),
  mileage: integer("mileage").notNull(),
  seats: integer("seats"),
  fuel: text("fuel"),
  body: text("body"),
  transmission: text("transmission"),

  // Step 3 — Condition
  title_status: text("title_status").notNull(),
  accident_history: text("accident_history").notNull(),
  vehicle_condition: text("vehicle_condition").notNull(),
  has_mechanical_issues: boolean("has_mechanical_issues").notNull(),
  mechanical_issues_description: text("mechanical_issues_description"),

  // Step 4 — Photo file names (comma-separated; actual storage requires cloud setup)
  photo_files: text("photo_files").notNull().default(""),

  // Step 5 — Document file names
  document_files: text("document_files").notNull().default(""),

  // Step 6 — Goals
  listing_reason: text("listing_reason").notNull(),
  usage_frequency: text("usage_frequency").notNull(),
  available_days_per_month: text("available_days_per_month").notNull(),

  // Step 7 — Location
  pickup_location_type: text("pickup_location_type").notNull(),
  street_address: text("street_address").notNull(),
  location_zip: text("location_zip").notNull(),

  // Linked portal user (hoster)
  user_id: integer("user_id"),

  // Step 8 — Features
  has_gps: boolean("has_gps").notNull().default(false),
  has_carplay: boolean("has_carplay").notNull().default(false),
  has_android_auto: boolean("has_android_auto").notNull().default(false),
  has_backup_camera: boolean("has_backup_camera").notNull().default(false),
  has_leather_seats: boolean("has_leather_seats").notNull().default(false),
  has_sunroof: boolean("has_sunroof").notNull().default(false),
  has_third_row: boolean("has_third_row").notNull().default(false),
  fleet_interest: text("fleet_interest"),

  // Step 9 — Payment
  payment_method: text("payment_method").notNull().default("direct_deposit"),
  bank_name: text("bank_name"),
  account_holder_name: text("account_holder_name"),
  routing_number: text("routing_number"),
  account_number: text("account_number"),
  account_type: text("account_type"),

  review_expires_at: timestamp("review_expires_at").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  price: integer("price").notNull(),
  seats: integer("seats"),
  fuel: text("fuel"),
  body: text("body"),
  transmission: text("transmission"),
  featured: boolean("featured").notNull().default(false),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
});

export const contact_messages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const business_info = pgTable("business_info", {
  id: serial("id").primaryKey(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  hours: text("hours"),
  facebook_url: text("facebook_url"),
  instagram_url: text("instagram_url"),
  twitter_url: text("twitter_url"),
  maps_embed_url: text("maps_embed_url"),
});

export const profit_split_config = pgTable("profit_split_config", {
  id: serial("id").primaryKey(),
  host_percentage: integer("host_percentage").notNull().default(80),
  platform_percentage: integer("platform_percentage").notNull().default(20),
  payment_delay_days: integer("payment_delay_days").notNull().default(3),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const portal_users = pgTable("portal_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("renter"), // renter | hoster
  avatar_url: text("avatar_url"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  car_id: integer("car_id").notNull(),
  full_name: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  pickup_location: text("pickup_location").notNull(),
  dropoff_location: text("dropoff_location").notNull(),
  pickup_date: text("pickup_date").notNull(),
  dropoff_date: text("dropoff_date").notNull(),
  total_price: integer("total_price").notNull(),
  status: text("status").notNull().default("confirmed"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
