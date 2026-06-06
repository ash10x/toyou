-- Add payment fields to vehicle_listings
ALTER TABLE "vehicle_listings"
  ADD COLUMN IF NOT EXISTS "payment_method" text NOT NULL DEFAULT 'direct_deposit',
  ADD COLUMN IF NOT EXISTS "bank_name" text,
  ADD COLUMN IF NOT EXISTS "account_holder_name" text,
  ADD COLUMN IF NOT EXISTS "routing_number" text,
  ADD COLUMN IF NOT EXISTS "account_number" text,
  ADD COLUMN IF NOT EXISTS "account_type" text;

-- Profit split configuration table
CREATE TABLE IF NOT EXISTS "profit_split_config" (
  "id" serial PRIMARY KEY,
  "host_percentage" integer NOT NULL DEFAULT 80,
  "platform_percentage" integer NOT NULL DEFAULT 20,
  "payment_delay_days" integer NOT NULL DEFAULT 3,
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Seed default profit split (80:20, 3-day payout delay)
INSERT INTO "profit_split_config" ("id", "host_percentage", "platform_percentage", "payment_delay_days")
VALUES (1, 80, 20, 3)
ON CONFLICT (id) DO NOTHING;
