CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"car_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"pickup_location" text NOT NULL,
	"dropoff_location" text NOT NULL,
	"pickup_date" text NOT NULL,
	"dropoff_date" text NOT NULL,
	"total_price" integer NOT NULL,
	"created_at" timestamp NOT NULL DEFAULT now()
);
