import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  is_admin: boolean("is_admin").notNull().default(false),
});
