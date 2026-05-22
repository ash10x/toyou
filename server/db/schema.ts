import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  is_admin: boolean("is_admin").notNull().default(false),
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
  created_at: timestamp("created_at").notNull().defaultNow(),
});
